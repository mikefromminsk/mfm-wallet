function openMiner(domain, success) {
    trackCall(arguments)
    showDialog("miner", success, function ($scope) {
        if (domain == wallet.gas_domain)
            domain = wallet.vavilon
        $scope.domain = domain
        $scope.tokens = {}
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

        $scope.toggleDomain = function (domain) {
            postContract("mfm-miner", "toggle_domain", {
                address: wallet.address(),
                domain: domain,
            }, function () {
                if ($scope.isNotChecked(str.you_start_mining)){
                    showSuccessDialog(str.you_start_mining, $scope.refresh)
                } else {
                    $scope.refresh()
                }
            })
        }

        $scope.withdrawal = function () {
            for (const account of Object.values($scope.accounts)) {
                if (account.balance > 0) {
                    postContract("mfm-miner", "withdrawal", {
                        domain: account.domain,
                        address: wallet.address(),
                    }, $scope.refresh, function () {
                        getPin(function (pin) {
                            wallet.calcStartHash(account.domain, pin, function (next_hash) {
                                postContract("mfm-token", "send", {
                                    domain: account.domain,
                                    to: wallet.address(),
                                    pass: ":" + next_hash,
                                }, $scope.withdrawal)
                            })
                        })
                    })
                }
            }
        }

        $scope.haveMinerBalance = function () {
            for (const token of Object.values($scope.tokens))
                if (token.account && token.account.balance > 0)
                    return true
            return false
        }

        $scope.minutesInMonth = 60 * 24 * 30
        $scope.getReward = function () {
            let percentInYear = 0;
            if ($scope.bank == null) {
                return 0
            }
            if ($scope.bank.delegate == "mfm-contract/mint10") {
                percentInYear = 10
            } else if ($scope.bank.delegate == "mfm-contract/mint20") {
                percentInYear = 20
            } else if ($scope.bank.delegate == "mfm-contract/mint100") {
                percentInYear = 100
            }
            let minutesInYear = 365.0 * 24 * 60;
            return $scope.bank.balance / percentInYear / minutesInYear
        }

        $scope.getMinerHashRate = function () {
            return $scope.miner_account.tariff * 100000 * 10000
        }

        function loadTopMining() {
            postContract("mfm-token", "search", {}, function (response) {
                for (const token of response.tokens) {
                    if (token.domain != wallet.gas_domain && $scope.tokens[token.domain] == null) {
                        $scope.tokens[token.domain] = token
                    }
                }
                $scope.$apply()
            })
        }

        function loadAccounts() {
            postContract("mfm-token", "accounts", {
                address: wallet.address(),
            }, function (response) {
                for (const account of response.accounts) {
                    if (account.domain != wallet.gas_domain && $scope.tokens[account.domain] == null) {
                        $scope.tokens[account.domain] = account.token
                    }
                }
                $scope.$apply()
                loadTopMining()
            })
        }

        function loadMinerAccounts(address) {
            postContract("mfm-token", "accounts", {
                address: address,
            }, function (response) {
                for (const account of response.accounts) {
                    if (account.domain != wallet.gas_domain) {
                        $scope.tokens[account.domain] = account.token
                        $scope.tokens[account.domain].account = account
                    }
                }
                $scope.$apply()
                loadAccounts()
            })
        }

        function loadMinerAccount() {
            postContract("mfm-miner", "account", {
                address: wallet.address(),
            }, function (response) {
                if (response.miner_account) {
                    $scope.miner_account = response.miner_account
                    $scope.gas_account = response.gas_account
                    loadMinerAccounts(response.miner_account.minerAddress)
                    subscribeToMinerAddress(response.miner_account.minerAddress)
                    loadTrans(response.miner_account.minerAddress)
                    $scope.$apply()
                }
            }, function () {
                loadAccounts()
            })
        }

        function loadTrans(minerAddress) {
            postContract("mfm-token", "trans", {
                address: minerAddress,
                to: wallet.address(),
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }

        function loadAccount() {
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: wallet.address(),
            }, function (response) {
                $scope.account = response.account
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadMinerAccount()
            loadAccount()
        }

        $scope.refresh()

    })
}