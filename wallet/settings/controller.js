function openSettings(success) {
    showDialog('/mfm-wallet/wallet/settings/index.html?nocache', success, function ($scope) {

        $scope.login = function () {
            $scope.in_progress = true
            $scope.back()
            openLogin(function () {
                $scope.in_progress = false
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

        $scope.openAnalytics = function () {
            openAnalytics()
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