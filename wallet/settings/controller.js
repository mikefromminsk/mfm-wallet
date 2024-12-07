function openSettings(success) {
    showDialog('/mfm-wallet/wallet/settings/index.html?nocache', success, function ($scope) {

            $scope.language = getLanguage()

            $scope.logout = function () {
                openAskSure(function () {
                    wallet.logout()
                    storage.setString(storageKeys.onboardingShowed, "true")
                })
            }

            $scope.deleteAccount = function () {
                openAskSure(function () {
                    getPin(function (pin) {
                        calcPass(wallet.gas_domain, pin, function (pass) {
                            postContract("mfm-analytics", "delete_user.php", {
                                address: wallet.address(),
                                pass: pass
                            }, function () {
                                wallet.logout()
                            })
                        })
                    })
                })
            }

            $scope.burnAssets = function (domain) {
                openAskSure(function () {
                    getProfile(domain, function (profile) {
                        openSend(domain, profile.owner, profile.balance, function () {
                            showSuccess(str.token_burned)
                        })
                    })
                })
            }

            $scope.changePassword = function () {

            }
        }
    )
}