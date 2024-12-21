function openMining(domain, success) {
    trackCall(arguments)
    let worker;
    let restartTimer;
    if (domain == null) return;
    showDialog("products/mining", function () {
            if (worker)
                worker.terminate()
            if (restartTimer)
                clearTimeout(restartTimer)
            if (success)
                success()
        }, function ($scope) {
            $scope.domain = domain
            $scope.speed = 0

            if (window.conn != null && window.conn.readyState !== WebSocket.OPEN) {
                showError(str.web_socket_not_connected)
            }

            function loadMiningInfo(startMiningAfterRequest) {
                postContract("mfm-mining", "info", {
                    domain: domain,
                    address: wallet.address(),
                }, function (response) {
                    $scope.loaded = true
                    $scope.last_hash = response.last_hash || ""
                    $scope.difficulty = response.difficulty || 1
                    $scope.last_reward = response.last_reward
                    $scope.bank = response.bank
                    $scope.$apply()
                    if ($scope.in_progress && startMiningAfterRequest)
                        startMiningProcess($scope.last_hash, $scope.difficulty)
                })
                loadTrans()
                loadAccounts()
            }

            $scope.startMining = function () {
                $scope.startRequest()
                getPin(function (pin) {
                    storage.setString(storageKeys.mining_auto_start, "1")
                    restartTimer = setTimeout(function () {
                        window.location.reload()
                    }, 1000 * 60 * 10)
                    window.pinForSesstion = pin
                    wallet.calcPass(domain, pin, function (pass) { // reg domain account
                        postContract("mfm-token", "account", {
                            domain: wallet.gas_domain,
                            address: wallet.address(),
                        }, function (response) {
                            if (response.account.balance > 0) {
                                loadMiningInfo(true)
                            } else {
                                openAskCredit(wallet.gas_domain, init)
                            }
                        })
                    })
                })
            }

            function startMiningProcess(last_hash, difficulty) {
                if (worker != null)
                    worker.terminate()
                worker = new Worker('/mfm-wallet/products/mining/worker.js');
                worker.addEventListener('message', function (e) {
                    $scope.speed = e.data.speed
                    if ($scope.last_hash == e.data.last_hash) {
                        postContractWithGas("mfm-mining", "mint", {
                            domain: domain,
                            nonce: e.data.nonce,
                            str: e.data.str,
                            hash: e.data.hash,
                            last_hash: e.data.last_hash,
                        }, function () {
                            loadMiningInfo(true)
                        }, function (message) {
                            if (message.indexOf("Invalid nonce") !== -1) {
                                loadMiningInfo(true)
                            } else {
                                $scope.stopMining(message)
                            }
                        })
                    } else {
                        loadMiningInfo(true)
                    }
                });
                worker.postMessage({
                    domain: domain,
                    last_hash: last_hash,
                    difficulty: difficulty,
                });
            }

            $scope.stopMining = function (message) {
                if (worker != null)
                    worker.terminate()
                $scope.finishRequest(message)
                storage.setString(storageKeys.mining_auto_start, "")
                if (restartTimer)
                    clearTimeout(restartTimer)
            }

            $scope.subscribe("mining", function (data) {
                if (data.domain == domain) {
                    $scope.balance = data.balance
                    $scope.difficulty = data.difficulty
                    $scope.last_reward = data.reward
                    $scope.$apply()
                    startMiningProcess(data.last_hash, data.difficulty)
                }
            })

            function loadProfile() {
                getProfile(domain, function (response) {
                    $scope.token = response.token
                    $scope.account = response.account
                    $scope.$apply()
                })
            }

            function loadAccounts() {
                postContract("mfm-token", "accounts", {
                    address: wallet.address(),
                }, function (response) {
                    let accounts = []
                    for (const account of response.accounts)
                        if (account.domain == domain || account.domain == wallet.gas_domain)
                            accounts.push(account)
                    $scope.accounts = accounts
                    $scope.$apply()
                })
            }

            function loadTrans() {
                postContract("mfm-token", "trans", {
                    from_address: "mining",
                    to_address: wallet.address(),
                    domain: domain,
                }, function (response) {
                    $scope.trans = $scope.groupByTimePeriod(response.trans)
                    $scope.$apply()
                })
            }

            function init() {
                loadProfile()
                loadMiningInfo()
                get("/mfm-mining/readme.md", function (text) {
                    setMarkdown("mfm-mining-readme", text)
                })
            }

            init()

            if (storage.getString(storageKeys.mining_auto_start) != "") {
                $scope.startMining()
            }
        }
    )

}