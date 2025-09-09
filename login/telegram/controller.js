function openTelegramLogin(bot_name, success) {
    if (wallet.address() == "" && getTelegramUserId() != null) {
        showDialog("login/telegram", success, function ($scope) {
            postContract("mfm-telegram", "subscription_check", {
                user_id: getTelegramUserId()
            }, function () {
                postContract("mfm-telegram", "login", {
                    user_id: getTelegramUserId()
                }, function (response) {
                    let password = hash(response.seed)
                    let address = hashAddress(password)
                    wallet.login(address, password, function () {
                        $scope.close()
                        $scope.openOnboarding()
                    }, function (message) {
                        if (message == "invalid password")
                            showError(str.password_invalid)
                    })
                })
            }, function () {
                $scope.close = function () {
                    Telegram.WebApp.close()
                }
            })
        })
    }
}

function getTelegramUserId() {
    try {
        return window.Telegram.WebApp.initDataUnsafe.user.id
    } catch (e) {
        return null
    }
}