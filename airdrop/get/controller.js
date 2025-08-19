function openAirdrop(domain, success) {
    trackCall(arguments)
    showDialog("airdrop/get", success, function ($scope) {
        $scope.domain = domain

        $scope.getReward = function () {
            postContract("mfm-airdrop", "reward", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                showSuccessDialog(str.giveaway_received, $scope.close)
            })
        }

        $scope.isAddedToWallet = function () {
            return $scope.account
        }

        $scope.addToWallet = function () {
            openTokenProfile(domain, $scope.refresh, 'airdrop');
        }

        $scope.isTelegramSubscribed = function () {
            return $scope.isChecked('subscribe_to_telegram_' + domain)
        }

        $scope.subscribeToTelegram = function () {
            $scope.check('subscribe_to_telegram_' + domain)
            $scope.show_task1 = false
            $scope.openWeb('https://t.me/' + $scope.airdrop.telegram)
        }

        $scope.show_task0 = false
        $scope.show_task1 = !$scope.isTelegramSubscribed()

        $scope.isRewardEnabled = function () {
            return $scope.airdrop
                && !$scope.airdrop.rewarded
                && $scope.isAddedToWallet()
                && $scope.isTelegramSubscribed()
        }

        function getAirdrop() {
            postContract("mfm-airdrop", "get", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.airdrop = response.airdrop
                $scope.$apply()
            })
        }

        function loadProfile() {
            getProfile(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.show_task0 = response.account == null
                $scope.$apply()
            })
        }

        function loadTrans() {
            postContract("mfm-token", "trans", {
                address: wallet.AIRDROP_ADDRESS,
                domain: domain,
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            getAirdrop()
            loadProfile()
            loadTrans()
        }

        $scope.refresh()
    })
}