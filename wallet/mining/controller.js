function openMinerFarm(success) {
    trackCall(arguments)
    showDialog("wallet/mining", success, function ($scope) {
        let subscribed = false
        $scope.accounts = {}

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
            }, $scope.refresh)
        }

        function loadMinerAccounts(address) {
            postContract("mfm-token", "accounts", {
                address: address,
            }, function (response) {
                $scope.accounts = {}
                for (const account of response.accounts)
                    if (account.domain != wallet.gas_domain)
                        $scope.accounts[account.domain] = account
                $scope.$apply()
                loadTopMining()
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
            }, function (response) {
                loadTopMining()
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

        function loadTopMining() {
            postContract("mfm-token", "search", {}, function (response) {
                $scope.tokens = []
                for (const token of response.tokens)
                    if ($scope.accounts[token.domain] == null && token.domain != wallet.gas_domain)
                        $scope.tokens.push(token)
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadMinerAccount()
        }

        $scope.refresh()

    })
}