function openAccount(success) {
    showDialog('/mfm-wallet/token/account/index.html', success, function ($scope) {
            addFormats($scope)
            $scope.model = storage.getString("model", window.navigator.userAgent)

            $scope.logout = function () {
                wallet.logout()
                storage.setString(storageKeys.onboardingShowed, "true")
            }
            $scope.login = function () {
                $scope.back()
                openLogin(success)
            }
            $scope.restart = function () {
                location.reload(true)
            }

            $scope.openPage = function () {
                openWeb(location.origin + "/mfm-wallet/docs/clear/index.html")
            }

            $scope.copy = function () {
                $scope.copyText(wallet.address())
                showSuccess("Username copied")
            }

    })
}