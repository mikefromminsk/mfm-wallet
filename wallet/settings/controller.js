function openAccount(success) {
    showDialog('/mfm-wallet/wallet/settings/index.html?nocache', success, function ($scope) {

        $scope.version = version

        $scope.login = function () {
            $scope.back()
            openLogin(function () {
                $scope.close()
                if (success)
                    success()
            })
        }

        $scope.logout = function () {
            openAskSure(function () {
                wallet.logout()
                storage.setString(storageKeys.onboardingShowed, "true")
            })
        }

        $scope.openBuyFunnel = function () {
            openFunnel("buy")
        }

        $scope.leaveReview = function () {
            openReview()
        }

        $scope.openReviews = function () {
            openReviews()
        }

        $scope.openLanguages = function () {
            openLanguages()
        }

    })
}