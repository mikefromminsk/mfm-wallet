function openMiner(domain, success) {
    trackCall(arguments)
    showDialog("miner", success, function ($scope) {
        if (domain == null || domain == "" || domain == wallet.gas_domain)
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
                if ($scope.rewardsReceived < maxRewards && $scope.isNotChecked(str.you_start_mining)) {
                    showSuccessDialog(str.you_start_mining, $scope.refresh)
                } else {
                    $scope.refresh()
                }
            })
        }

        $scope.withdrawal = function () {
            getPin(function (pin) {
                for (const token of Object.values($scope.tokens)) {
                    if (token.account && token.account.balance > 0) {
                        postContract("mfm-miner", "withdrawal", {
                            domain: token.domain,
                            address: wallet.address(),
                        }, $scope.refresh, function () {
                            postContract("mfm-token", "send", {
                                domain: token.domain,
                                to: wallet.address(),
                                pass: wallet.calcUserStartPass(token.domain, pin),
                            }, $scope.withdrawal)
                        })
                    }
                }
            })
        }

        $scope.haveMinerBalance = function () {
            for (const token of Object.values($scope.tokens))
                if (token.account && token.account.balance > 0)
                    return true
            return false
        }

        $scope.minutesInMonth = 60 * 24 * 30
        $scope.getReward = function () {
            let percentInYear = 0
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
            let minutesInYear = 365.0 * 24 * 60
            return $scope.bank.balance / percentInYear / minutesInYear
        }

        $scope.getMinerHashRate = function () {
            return $scope.miner_account.tariff * 100000 * 10000
        }

        function sortAndApply() {
            let values = Object.values($scope.tokens).sort((a, b) => {
                if (a.domain === domain && b.domain !== domain) return -1
                if (a.domain !== domain && b.domain === domain) return 1
                return 0
            })
            $scope.tokens = {}
            for (const token of values)
                $scope.tokens[token.domain] = token
            $scope.$apply()
        }

        function loadTopMining() {
            postContract("mfm-token", "search", {}, function (response) {
                for (const token of response.tokens) {
                    if (token.domain != wallet.gas_domain && $scope.tokens[token.domain] == null) {
                        $scope.tokens[token.domain] = token
                    }
                }
                sortAndApply()
            })
        }

        function loadDomainToken() {
            if (domain != null && $scope.tokens[domain] == null) {
                postContract("mfm-token", "token", {
                    domain: domain
                }, function (response) {
                    $scope.tokens[domain] = response.token
                    sortAndApply()
                })
            }
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
                sortAndApply()
                loadTopMining()
                loadDomainToken()
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
                sortAndApply()
                loadAccounts()
            })
        }

        function loadMinerAccount() {
            postContract("mfm-miner", "account", {
                address: wallet.address(),
            }, function (response) {
                if (response.miner_account) {
                    $scope.miner_account = response.miner_account
                    $scope.miner_gas_account = response.gas_account
                    loadMinerAccounts(response.miner_account.minerAddress)
                    subscribeToMinerAddress(response.miner_account.minerAddress)
                    loadTrans(response.miner_account.minerAddress)
                    sortAndApply()
                }
            }, function () {
                loadAccounts()
            })
        }

        $scope.isMiningEnabled = function () {
            return $scope.miner_account
                && $scope.miner_account.domains
                && $scope.miner_account.domains != ""
        }

        $scope.isMiningPaused = function () {
            if ($scope.isMiningEnabled()
                && $scope.miner_gas_account.balance < $scope.miner_account.domains.split(',').length * 0.0001) {
                return true;
            }
            return false
        }

        $scope.isMining = function () {
            if ($scope.isMiningEnabled()
                && $scope.miner_gas_account.balance >= $scope.miner_account.domains.split(',').length * 0.0001) {
                return true;
            }
            return false
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

        function loadGasAccount() {
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: wallet.address(),
            }, function (response) {
                $scope.account = response.account
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadRewards($scope)
            loadMinerAccount()
            loadGasAccount()
        }

        $scope.refresh()

    })
}