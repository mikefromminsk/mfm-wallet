function openAirdropGet(domain, success) {
    trackCall(arguments)
    showDialog("wallet/airdrop/get", success, function ($scope) {

        $scope.add = function () {
            postContract("mfm-airdrop", "get", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.airdrop = response.airdrop
                $scope.$apply()
            })
        }
    })
}