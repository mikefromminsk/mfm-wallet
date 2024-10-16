function openSelectToken(success) {
    showBottomSheet('/mfm-wallet/token/select_token/index.html', success, function ($scope) {
            addFormats($scope)

            postContract("mfm-wallet", "token/api/tokens.php", {
                address: wallet.address(),
            }, (response) => {
                $scope.activeTokens = response.active
            })
    })
}