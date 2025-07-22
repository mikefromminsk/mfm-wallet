function openMinerFarm(domain, success) {
    trackCall(arguments)
    showDialog("wallet/mining", success, function ($scope) {

        $scope.setDomain = function (domain) {
            postContract("mfm-miner", "set_domain", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                showSuccess(str.success, $scope.refresh)
            })
        }

        $scope.withdrawal = function () {
            let domain = $scope.miner_account.minerDomain
            postContract("mfm-token", "account", {
                domain: domain,
                address: wallet.address(),
            }, function () {
                postContract("mfm-miner", "withdrawal", {
                    domain: domain,
                    address: wallet.address(),
                }, function (response) {
                })
            }, function () {
                getPin(function (pin) {
                    wallet.calcStartHash(domain, pin, function (next_hash) {
                        postContract("mfm-token", "send", {
                            domain: domain,
                            to: wallet.address(),
                            pass: ":" + next_hash
                        }, $scope.withdrawal)
                    })
                })
            })
        }

        let subscribed = false

        function subscribeToMinerAddress(minerAddress) {
            if (!subscribed) {
                subscribed = true
                $scope.subscribe("account:" + minerAddress, function (data) {
                    if ($scope.refresh)
                        $scope.refresh()
                })
            }
        }

        function loadMiningInfo() {
            postContract("mfm-contract", "mining_info", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.difficulty = response.difficulty || 1
                $scope.last_reward = response.last_reward
                $scope.bank = response.bank
                $scope.$apply()
            })
        }

        $scope.selectAccount = function (domain) {
            openMinerFarm(domain, $scope.refresh)
        }

        function loadMinerAccounts(address) {
            postContract("mfm-token", "accounts", {
                address: address,
            }, function (response) {
                let accounts = []
                for (const account of response.accounts)
                    if (account.domain == domain && account.domain != domain)
                        accounts.push(account)
                $scope.accounts = accounts
                $scope.$apply()
            })
        }

        function loadMinerTrans(address) {
            postContract("mfm-token", "trans", {
                address: address,
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }

        function loadProfile(domain) {
            getAccount(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.gas_account
                $scope.$apply()
            })
        }

        function loadMinerAccount() {
            postContract("mfm-miner", "account", {
                address: wallet.address(),
            }, function (response) {
                if (response.miner_account) {
                    $scope.miner_account = response.miner_account
                    $scope.gas_account = response.gas_account
                    $scope.token_account = response.token_account
                    loadMinerAccounts(response.miner_account.minerAddress)
                    loadMinerTrans(response.miner_account.minerAddress)
                    subscribeToMinerAddress(response.miner_account.minerAddress)
                    loadMiningInfo(response.miner_account.minerDomain)
                    loadProfile(response.miner_account.minerDomain)
                    $scope.$apply()
                }
            })
        }

        $scope.refresh = function () {
            loadMinerAccount()
        }

        $scope.refresh()

    })
}