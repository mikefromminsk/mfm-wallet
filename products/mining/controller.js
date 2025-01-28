let worker;

function openMining(domain, success) {
    trackCall(arguments)
    if (domain == null) return;
    showDialog("products/mining", function () {
            if (worker)
                worker.terminate()
            if (success)
                success()
        }, function ($scope) {
            $scope.domain = domain
            $scope.menu = ["history", "mining", "nodes"]
            $scope.selectedIndex = 1
            $scope.selectTab = function (tab) {
                $scope.selectedIndex = tab
                if (tab == 0) {
                    addMiningHistory($scope, domain)
                } else if (tab == 1) {
                    addMining($scope, domain)
                } else if (tab == 2) {
                    addNodes($scope)
                }
                swipeToRefresh($scope.swipeToRefresh)
            }
            $scope.swipeToRefresh = function () {
                $scope.selectTab($scope.selectedIndex)
            }
            $scope.selectTab($scope.selectedIndex)
        }
    )
}

function addMining($scope, domain) {
    if (window.conn != null && window.conn.readyState !== WebSocket.OPEN) {
        showError(str.web_socket_not_connected)
        connectWs(8443, function () {
            showSuccess(str.web_socket_connection_restored)
        })
    }

    function loadMiningInfo(startMiningAfterRequest) {
        postContract("mfm-mining", "mining_info", {
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
        loadAccounts()
    }

    $scope.startMining = function () {
        $scope.startRequest()
        getPin(function (pin) {
            window.pinForSesstion = pin
            wallet.reg(domain, pin, function () {
                postContract("mfm-token", "account", {
                    domain: wallet.gas_domain,
                    address: wallet.address(),
                }, function (response) {
                    if (response.account.balance > 0) {
                        loadMiningInfo(true)
                    } else {
                        showError($scope.formatDomain(wallet.gas_domain) + " " + str.balance_is_not_enough)
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
                postContractWithGas("mfm-mining", "mint10", {
                    domain: domain,
                    nonce: e.data.nonce,
                    str: e.data.str,
                    hash: e.data.hash,
                    last_hash: e.data.last_hash,
                    time: Math.ceil(new Date().getTime() / 1000),
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
    }

    $scope.subscribe("mining:" + domain, function (data) {
        $scope.balance = data.balance
        $scope.difficulty = data.difficulty
        $scope.last_reward = data.reward
        $scope.$apply()
        if (data.gas_address == wallet.address())
            loadAccounts()
        if ($scope.in_progress)
            startMiningProcess(data.last_hash, data.difficulty)
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

    function init() {
        loadProfile()
        loadMiningInfo(false)
    }

    $scope.swipeToRefresh = function () {
        init()
    }

    init()
}


function addMiningHistory($scope, domain) {
    $scope.refresh = function () {
        postContract("mfm-token", "dialog_trans", {
            domain: domain,
            from: "mining",
            to: wallet.address(),
        }, function (response) {
            $scope.trans = $scope.groupByTimePeriod(response.trans)
            $scope.$apply()
        })
    }

    $scope.swipeToRefresh = function () {
        $scope.refresh()
    }

    $scope.refresh()
}


function addNodes($scope) {
    $scope.refresh = function () {
        postContract("mfm-mining", "nodes", {}, function (response) {
            $scope.nodes = response.nodes
            $scope.$apply()
        })
    }

    $scope.swipeToRefresh = function () {
        $scope.refresh()
    }

    $scope.refresh()
}