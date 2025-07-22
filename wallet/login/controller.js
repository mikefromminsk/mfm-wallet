function openLogin(success) {
    trackCall(arguments)
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog("wallet/login", success, function ($scope) {
        addLogin($scope, $scope.close)
    })
}

function addLogin($scope, success) {
    $scope.validateBip39 = function (mnemonic) {
        return mnemonic.split(" ").length == 12
    }

    if (DEBUG) {
        $scope.mnemonic = "nation finger unable fade exist visa arch awake anchor surround paddle riot"
    } else {
        if (getTelegramUsername() != null) {
            postContract("mfm-telegram", "login", {
                username: getTelegramUsername()
            }, function (response) {
                $scope.mnemonic = response.seed
            });
        } else {
            $scope.mnemonic = bip39Generate()
        }
    }

    $scope.login = function (mnemonic) {
        $scope.startRequest()
        let password = hash(mnemonic)
        let address = hash(password)
        wallet.login(address, password, function () {
            showSuccess(str.login_success, success)
            $scope.close()
        }, function (message) {
            if (message == "invalid password")
                showError(str.password_invalid)
            $scope.finishRequest()
        })
    }
    $scope.copied = false
    $scope.copySeed = function () {
        $scope.copy($scope.mnemonic)
        $scope.copied = true
    }
}

function getTelegramUsername() {
    if (!window.Telegram?.WebApp) {
        alert('Telegram WebApp не инициализирован');
        return null;
    }
    if (window.Telegram?.WebApp?.isReady) {
        // Данные точно доступны
        const username = window.Telegram.WebApp.initDataUnsafe.user?.username;
    } else {
        window.Telegram.WebApp.ready(); // Метод для явного подтверждения готовности
    }

    const webApp = window.Telegram.WebApp;
    try {
        const initData = webApp.initData;
        const params = new URLSearchParams(initData);
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


