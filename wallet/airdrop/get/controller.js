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

        $scope.refresh = function () {
            getAirdrop()
        }
    })
}