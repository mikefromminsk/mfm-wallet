function openAccount(success) {
    showDialog('/mfm-wallet/wallet/settings/index.html?nocache', success, function ($scope) {

        $scope.login = function () {
            $scope.back()
            openLogin(function () {
                $scope.close()
                if (success)
                    success()
            })
        }

        $scope.logout = function () {
            wallet.logout()
            storage.setString(storageKeys.onboardingShowed, "true")
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

        $scope.openTermsAndConditions = function () {
            openWeb(location.origin + "/mfm-angular-template/docs?path=/mfm-wallet/docs/terms_and_conditions.md")
        }

        $scope.copy = function () {
            $scope.copyText(wallet.address())
            showSuccess("Username copied")
        }

    })
}