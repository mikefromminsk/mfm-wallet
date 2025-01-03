function openLogin(success) {
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog("wallet/login", success, function ($scope) {
            $scope.validateBip39 = function (mnemonic) {
                return mnemonic.split(" ").length == 12
            }

            $scope.mnemonic = ""
            for (let i = 0; i < 12; i++) {
                $scope.mnemonic += bip39_wordlist[Math.floor(Math.random() * bip39_wordlist.length)] + " "
            }
            $scope.mnemonic = $scope.mnemonic.trim()

            $scope.login = function () {
                $scope.startRequest()
                let password = CryptoJS.MD5($scope.mnemonic).toString()
                let address = CryptoJS.MD5(password).toString()
                postContract("mfm-token", "account", {
                    domain: wallet.gas_domain,
                    address: address,
                }, function (response) {
                    if (CryptoJS.MD5(wallet.calcHash(
                        wallet.gas_domain,
                        address,
                        password,
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
                        to: address,
                        amount: 0,
                        pass: ":" + CryptoJS.MD5(wallet.calcHash(
                            wallet.gas_domain,
                            address,
                            $scope.password)).toString()
                    }, loginSuccess, $scope.finishRequest)
                })

                function loginSuccess() {
                    getPin(function (pin) {
                        // set pin
                        storage.setString(storageKeys.username, address)
                        storage.setString(storageKeys.passhash, encode(password, pin))
                        if (pin != null)
                            storage.setString(storageKeys.hasPin, true)
                        loginFinish()
                    }, function () {
                        // skip pin
                        storage.setString(storageKeys.username, address)
                        storage.setString(storageKeys.passhash, password)
                        loginFinish()
                    })
                }

                function loginFinish() {
                    if (success) success()
                    $scope.close()
                }
            }
            $scope.pressEnter($scope.login)

        }
    )
}