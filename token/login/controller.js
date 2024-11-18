function openLogin(success) {
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog('/mfm-wallet/token/login/index.html', success, function ($scope) {
        $scope.username = ""
        $scope.agree_with_terms_and_condition = false
        if (DEBUG) {
            $scope.username = "admin"
            $scope.password = "pass"
            $scope.agree_with_terms_and_condition = true
        }

        setTimeout(function () {
            document.getElementById('login_address').focus();
        }, 500)

        $scope.toggleTerms = function () {
            $scope.agree_with_terms_and_condition = !$scope.agree_with_terms_and_condition
        }

        $scope.login = function () {
            $scope.in_progress = true
            postContract("mfm-token", "account.php", {
                domain: wallet.gas_domain,
                address: $scope.username,
            }, function (response) {
                $scope.in_progress = false
                if (CryptoJS.MD5(wallet.calcHash(
                    wallet.gas_domain,
                    $scope.username,
                    $scope.password,
                    response.prev_key)).toString() == response.next_hash) {
                    setPin()
                } else {
                    showError("password invalid")
                }
            }, function () {
                $scope.in_progress = false
                postContract("mfm-token", "send.php", {
                    domain: wallet.gas_domain,
                    from_address: "owner",
                    to_address: $scope.username,
                    amount: 0,
                    pass: ":" + CryptoJS.MD5(wallet.calcHash(
                        wallet.gas_domain,
                        $scope.username,
                        $scope.password)).toString()
                }, function () {
                    setPin()
                })
            })
        }

        $scope.$watch(function () {
            return $scope.username
        }, function (newValue, oldValue) {
            if (newValue != newValue.toLowerCase())
                $scope.username = oldValue
            if (newValue.match(new RegExp("\\W")))
                $scope.username = oldValue
        })

        function setPin() {
            if (window.Telegram != null) {
                let userData = window.Telegram.WebApp.initDataUnsafe
                if (userData.user != null) {
                    postContract("mfm-telegram", "link_address.php", {
                        bot: getParam("bot"),
                        address: $scope.username,
                        username: userData.user.username,
                    })
                }
            }
            getPin(function (pin) {
                storage.setString(storageKeys.username, $scope.username)
                storage.setString(storageKeys.passhash, encode($scope.password, pin))
                if (pin != null)
                    storage.setString(storageKeys.hasPin, true)
                if (success) success()
                $scope.close()
            }, function () {
                storage.setString(storageKeys.username, $scope.username)
                storage.setString(storageKeys.passhash, $scope.password)
                if (success) success()
                $scope.close()
            })
        }
    })
}