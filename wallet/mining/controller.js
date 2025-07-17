function openMinerFarm(domain, success) {
    trackCall(arguments)
    showDialog("wallet/mining", success, function ($scope) {
        $scope.domain = domain

        //addChart($scope, domain + "_difficulty")

        $scope.setTariff = function () {
            postContract("mfm-miner", "set_tariff", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                showSuccess(str.success)
            })
        }

        $scope.setDomain = function () {
            postContract("mfm-miner", "set_domain", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                showSuccess(str.success)
            })
        }

        $scope.withdrawal = function () {
            postContract("mfm-miner", "withdrawal", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                showSuccess(str.success)
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

        function loadMinerAccount() {
            postContract("mfm-miner", "account", {
                address: wallet.address(),
            }, function (response) {
                if (response.miner_account) {
                    $scope.miner_account = response.miner_account
                    $scope.gas_account = response.gas_account
                    $scope.token_account = response.token_account
                    $scope.accounts = [response.gas_account, response.token_account]
                    subscribeToMinerAddress(response.miner_account.minerAddress)
                    $scope.$apply()
                }
            })
        }

        function loadProfile() {
            getAccount(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.gas_account
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadMinerAccount()
            loadMiningInfo()
            loadProfile()
        }

        $scope.refresh()

    })
}