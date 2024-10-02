function openSelectToken(success) {
    window.$mdBottomSheet.show({
        templateUrl: '/mfm-wallet/token/select_token/index.html',
        controller: function ($scope) {
            addFormats($scope)

            postContract("mfm-wallet", "token/api/tokens.php", {
                address: wallet.address(),
            }, (response) => {
                $scope.activeTokens = response.active
            })
        }
    }).then(function (scene) {
        if (success)
            success(scene)
    })
}