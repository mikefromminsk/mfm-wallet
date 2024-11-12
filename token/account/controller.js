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

            $scope.openBuyFunnel = function () {
                openFunnel([
                    "openTokenProfile",
                    "openExchange",
                ], function () {

                })
            }

            $scope.openTermsAndConditions = function () {
                openWeb(location.origin + "/mfm-angular-template/docs?path=/mfm-wallet/docs/terms_and_conditions.md")
            }

            $scope.copy = function () {
                $scope.copyText(wallet.address())
                showSuccess("Username copied")
            }

    })
}