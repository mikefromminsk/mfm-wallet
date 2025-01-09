function openSettings(success) {
    showDialog("wallet/settings", success, function ($scope) {
        $scope.language = getLanguage()

        $scope.logout = function () {
            openAskSure(str.are_you_sure, str.yes, str.no, function () {
                wallet.logout()
                storage.setString(storageKeys.onboardingShowed, "true")
            })
        }

        $scope.init = function () {
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: wallet.address(),
            }, function (response) {
                $scope.account = response.account
                $scope.$apply()
            })
        }

        $scope.init()
    })
}