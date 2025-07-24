function openTelegramLogin(bot_name, success) {
    if (wallet.address() == "") {
        postContract("mfm-telegram", "login", {
            username: getTelegramUsername()
        }, function (response) {
            let password = hash(response.mnemonic)
            let address = hashAddress(password)
            wallet.login(address, password, success, function (message) {
                if (message == "invalid password")
                    showError(str.password_invalid)
            })
        }, function () {
            showDialog("wallet/login/telegram", success, function ($scope) {
                $scope.subscriptionCheck = function () {
                    postContract("mfm-telegram", "subscription_check", {
                        username: getTelegramUsername(),
                    }, function () {
                        showSuccess(str.login_success, $scope.close)
                    })
                }
            })
        })
    }
}

function getTelegramUsername() {
    if (!window.Telegram?.WebApp) {
        alert('Telegram WebApp не инициализирован');
        return null;
    }
    if (!window.Telegram?.WebApp?.isReady) {
        window.Telegram.WebApp.ready();
    }

    try {
        const params = new URLSearchParams(window.Telegram.WebApp.initData);
        const userStr = params.get('user');

        if (userStr) {
            const user = JSON.parse(userStr);
            return user.username || null;
        }
    } catch (e) {
        console.error('Ошибка при получении username:', e);
    }

    return null;
}