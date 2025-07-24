function openTelegramLogin(bot_name, success) {
    if (wallet.address() == "" && getTelegramUserId() != null) {
        showDialog("wallet/login/telegram", success, function ($scope) {
            $scope.subscriptionCheck = function () {
                postContract("mfm-telegram", "subscription_check", {
                    user_id: getTelegramUserId(),
                }, function () {
                    showSuccess(str.login_success, $scope.close)
                })
            }

            postContract("mfm-telegram", "login", {
                user_id: getTelegramUserId()
            }, function (response) {
                let password = hash(response.mnemonic)
                let address = hashAddress(password)
                wallet.login(address, password, $scope.close, function (message) {
                    if (message == "invalid password")
                        showError(str.password_invalid)
                })
            })
        })
    }
}

function getTelegramUserId() {
    if (!window.Telegram?.WebApp) {
        alert('Telegram WebApp не инициализирован');
        return null;
    }
    if (!window.Telegram?.WebApp?.isReady) {
        window.Telegram.WebApp.ready();
    }

    try {
        return window.Telegram.WebApp.initDataUnsafe.user.id
    } catch (e) {
        console.error('Ошибка при получении username:', e);
    }
    return null;
}