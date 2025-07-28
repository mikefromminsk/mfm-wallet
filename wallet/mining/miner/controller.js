function openMiningProfile(domain, success) {
    trackCall(arguments)
    showDialog("wallet/mining/miner", success, function ($scope) {
        if (domain == wallet.gas_domain)
            domain = wallet.vavilon
        $scope.domain = domain

        $scope.toggleDomain = function () {
            postContract("mfm-miner", "toggle_domain", {
                domain: domain,
                address: wallet.address(),
            }, $scope.refresh)
        }

        $scope.withdrawal = function () {
            postContract("mfm-miner", "withdrawal", {
                domain: domain,
                address: wallet.address(),
            }, $scope.refresh, function () {
                getPin(function (pin) {
                    wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                        postContract("mfm-token", "send", {
                            domain: $scope.domain,
                            to: wallet.address(),
                            pass: ":" + next_hash,
                        }, $scope.withdrawal)
                    })
                })
            })
        }

        $scope.minutesInMonth = 60 * 24 * 30
        $scope.getReward = function () {
            let percentInYear = 0;
            if ($scope.bank == null){
                return 0
            } if ($scope.bank.delegate == "mfm-contract/mint10") {
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

        function loadMiningInfo() {
            postContract("mfm-contract", "mining_info", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.difficulty = response.difficulty || 1
                $scope.bank = response.bank
                $scope.$apply()
            })
        }

        function loadProfile() {
            getProfile(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.gas_account
                $scope.$apply()
            })
        }

        function loadMinerAccount() {
            postContract("mfm-miner", "account", {
                address: wallet.address(),
                domain: domain,
            }, function (response) {
                if (response.miner_account) {
                    $scope.miner_account = response.miner_account
                    $scope.gas_account = response.gas_account
                    $scope.token_account = response.token_account
                    $scope.$apply()
                }
            }, function () {
            })
        }

        $scope.refresh = function () {
            loadMinerAccount()
            loadMiningInfo(domain)
            loadProfile(domain)
        }

        $scope.refresh()

    })
}