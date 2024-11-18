function openAccount(success) {
    showDialog('/mfm-wallet/token/settings/index.html?nocache', success, function ($scope) {
        $scope.package = window.package_json
        $scope.logout = function () {
            wallet.logout()
            storage.setString(storageKeys.onboardingShowed, "true")
        }
        $scope.login = function () {
            $scope.back()
            openLogin(success)
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