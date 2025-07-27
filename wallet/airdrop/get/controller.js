function openAirdrop(domain, success) {
    trackCall(arguments)
    showDialog("wallet/airdrop/get", success, function ($scope) {
        $scope.domain = domain

        $scope.getReward = function () {
            postContract("mfm-airdrop", "reward", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                showSuccessDialog(str.success, $scope.close)
            })
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