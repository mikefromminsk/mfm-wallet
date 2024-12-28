function openLogin(success) {
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog("wallet/login", success, function ($scope) {
            $scope.username = window.telegram_username || ""
            if (DEBUG) {
                $scope.username = "user"
                $scope.password = "pass"
            }

            if ($scope.username == "") {
                setTimeout(function () {
                    document.getElementById('login_address').focus();
                }, 500)
            } else if ($scope.password == "") {
                setTimeout(function () {
                    document.getElementById('login_password').focus();
                }, 500)
            }

            $scope.login = function () {
                $scope.startRequest()
                postContract("mfm-token", "account", {
                    domain: wallet.gas_domain,
                    address: $scope.username,
                }, function (response) {
                    if (CryptoJS.MD5(wallet.calcHash(
                        wallet.gas_domain,
                        $scope.username,
                        $scope.password,
                        response.account.prev_key)).toString() == response.account.next_hash) {
                        loginSuccess()
                    } else {
                        $scope.finishRequest()
                        showError(str.password_invalid)
                    }
                }, function () {
                    postContract("mfm-token", "send", {
                        domain: wallet.gas_domain,
                        from: wallet.genesis_address,
                        to: $scope.username,
                        amount: 0,
                        pass: ":" + CryptoJS.MD5(wallet.calcHash(
                            wallet.gas_domain,
                            $scope.username,
                            $scope.password)).toString()
                    }, loginSuccess)
                })
            }
            $scope.pressEnter($scope.login)

            function loginSuccess() {
                getPin(function (pin) {
                    // set pin
                    storage.setString(storageKeys.username, $scope.username)
                    storage.setString(storageKeys.passhash, encode($scope.password, pin))
                    if (pin != null)
                        storage.setString(storageKeys.hasPin, true)
                    loginFinish()
                }, function () {
                    // skip pin
                    storage.setString(storageKeys.username, $scope.username)
                    storage.setString(storageKeys.passhash, $scope.password)
                    loginFinish()
                })
            }

            function tg_link(username) {
                if (username != null)
                    trackCall(arguments)
            }

            function loginFinish() {
                tg_link(window.telegram_username)
                if (success) success()
                $scope.close()
            }
        }
    )
}