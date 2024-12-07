function openLogin(success) {
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog('/mfm-wallet/wallet/login/index.html', success, function ($scope) {
            $scope.username = window.telegram_username || ""
            if (DEBUG) {
                $scope.username = "admin"
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
                $scope.in_progress = true
                postContract("mfm-token", "account.php", {
                    domain: wallet.gas_domain,
                    address: $scope.username,
                }, function (response) {
                    if (CryptoJS.MD5(wallet.calcHash(
                        wallet.gas_domain,
                        $scope.username,
                        $scope.password,
                        response.prev_key)).toString() == response.next_hash) {
                        loginSuccess()
                    } else {
                        $scope.in_progress = false
                        showError(str.password_invalid)
                    }
                }, function () {
                    postContract("mfm-token", "send.php", {
                        domain: wallet.gas_domain,
                        from_address: wallet.genesis_address,
                        to_address: $scope.username,
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

            function email_link(email_address) {
                if (email_address != null)
                    trackCall(arguments)
            }

            function loginFinish() {
                tg_link(window.telegram_username)
                email_link(window.email_address)
                if (success) success()
                $scope.close()
            }
        }
    )
}