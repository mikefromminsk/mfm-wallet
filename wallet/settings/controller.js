function openSettings(success) {
    showDialog('/mfm-wallet/wallet/settings/index.html?nocache', success, function ($scope) {

            $scope.language = getLanguage()

            $scope.logout = function () {
                openAskSure(function () {
                    wallet.logout()
                    storage.setString(storageKeys.onboardingShowed, "true")
                })
            }
        }
    )
}