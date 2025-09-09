let worker

function openWebMiner(domain, success) {
    trackCall(arguments)
    showDialog("miner/web", success, function ($scope) {

        if (window.conn != null && window.conn.readyState !== WebSocket.OPEN) {
            showError(str.web_socket_not_connected)
            connectWs(function () {
                showSuccess(str.web_socket_connection_restored)
            })
        }

        function loadMiningInfo(startMiningAfterRequest) {
            postContract("mfm-contract", "mining_info", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.loaded = true
                $scope.last_hash = response.last_hash || ""
                $scope.difficulty = response.difficulty || 1
                $scope.last_reward = response.last_reward
                $scope.bank = response.bank
                $scope.account = response.account
                $scope.$apply()
                if ($scope.in_progress && startMiningAfterRequest)
                    startMiningProcess($scope.last_hash, $scope.difficulty)
            })
            loadAccounts()
            loadTrans()
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
                            showError($scope.formatDomain(wallet.gas_domain) + " balance_is_not_enough")
                        }
                    })
                })
            })
        }

        function startMiningProcess(last_hash, difficulty) {
            if (worker != null)
                worker.terminate()
            worker = new Worker('/mfm-wallet/miner/web/worker.js')
            worker.addEventListener('message', function (e) {
                $scope.speed = e.data.speed
                if ($scope.last_hash == e.data.last_hash) {
                    postContractWithGas("mfm-contract", $scope.bank.delegate.split("/")[1], {
                        domain: domain,
                        nonce: e.data.nonce,
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
            })
            worker.postMessage({
                domain: domain,
                last_hash: last_hash,
                difficulty: difficulty,
            })
        }

        $scope.stopMining = function (message) {
            if (worker != null)
                worker.terminate()
            $scope.finishRequest(message)
        }

        $scope.subscribe("mining:" + domain, function (data) {
            $scope.balance = data.balance
            $scope.difficulty = data.difficulty
            $scope.$apply()
            if (data.gas_address == wallet.address())
                loadAccounts()
            if ($scope.in_progress)
                startMiningProcess(data.last_hash, data.difficulty)
        })

        function loadToken() {
            getToken(domain, function (response) {
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

        $scope.selectAccount = function () {
            $scope.openProfile(domain, loadAccounts)
        }

        function loadTrans() {
            postContract("mfm-token", "trans", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }

        function init() {
            loadToken()
            loadMiningInfo(false)
        }

        init()

    })
}

let requestQueue = []
let requestInProcess= false
function postContractWithGas(domain, path, params, success, error) {
    if (requestInProcess) {
        requestQueue.push({domain, path, params, success, error})
        return
    }
    requestInProcess = true
    let isParamsFunction = typeof params === 'function'
    getPin(function (pin) {
        if (isParamsFunction) {
        } else {
            calcGas(params)
        }

        function calcGas(params) {
            wallet.calcUserPass(wallet.gas_domain, pin, function (pass) {
                send(params, pass)
            })
        }

        function checkNextRequest(afterCallback, data) {
            let nextRequest = requestQueue.shift()
            if (nextRequest != null) {
                postContractWithGas(
                    nextRequest.domain,
                    nextRequest.path,
                    nextRequest.params,
                    nextRequest.success,
                    nextRequest.error)
            } else {
                requestInProcess = false
                if (afterCallback)
                    afterCallback(data)
            }
        }

        function send(params, pass) {
            if (params == null) return
            params.gas_address = wallet.address()
            params.gas_pass = pass
            postContract(domain, path, params, (data) => {
                checkNextRequest(success, data)
            }, (data) => {
                checkNextRequest(error, data)
            })
        }
    })
}