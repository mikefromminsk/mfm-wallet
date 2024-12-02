function openLogin(success) {
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog('/mfm-wallet/wallet/login/index.html', success, function ($scope) {
            $scope.username = window.telegram_username || ""
            $scope.agree_with_terms_and_condition = false
            if (DEBUG) {
                $scope.username = "admin"
                $scope.password = "pass"
                $scope.agree_with_terms_and_condition = true
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

            $scope.toggleTerms = function () {
                $scope.agree_with_terms_and_condition = !$scope.agree_with_terms_and_condition
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
                        from_address: "owner",
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

            $scope.$watch(function () {
                return $scope.username
            }, function (newValue, oldValue) {
                if (newValue != newValue.toLowerCase())
                    $scope.username = oldValue
                if (newValue.match(new RegExp("\\W")))
                    $scope.username = oldValue
            })

            function tg_link(username) {
                if (username != null)
                    trackCall(arguments)
            }

            function loginSuccess() {
                getPin(function (pin) {
                    storage.setString(storageKeys.username, $scope.username)
                    storage.setString(storageKeys.passhash, encode($scope.password, pin))
                    if (pin != null)
                        storage.setString(storageKeys.hasPin, true)
                    tg_link(window.telegram_username)
                    if (success) success()
                    $scope.close()
                }, function () {
                    storage.setString(storageKeys.username, $scope.username)
                    storage.setString(storageKeys.passhash, $scope.password)
                    tg_link($scope.telegram_username)
                    if (success) success()
                    $scope.close()
                })
            }
        }
    )
}