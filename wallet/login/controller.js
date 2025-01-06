function openLogin(success) {
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog("wallet/login", success, function ($scope) {

        $scope.validateBip39 = function (mnemonic) {
            return mnemonic.split(" ").length == 12
        }

        if (DEBUG) {
            $scope.mnemonic = "card wing home athlete regular post notice paddle isolate zone payment chef"
        } else {
            $scope.mnemonic = ""
            for (let i = 0; i < 12; i++) {
                $scope.mnemonic += bip39_wordlist[Math.floor(Math.random() * bip39_wordlist.length)] + " "
            }
            $scope.mnemonic = $scope.mnemonic.trim()
        }

        $scope.login = function () {
            $scope.startRequest()
            let password = md5($scope.mnemonic)
            let address = md5(password)
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: address,
            }, function (response) {
                if (md5(wallet.calcHash(
                    wallet.gas_domain,
                    address,
                    password,
                    response.account.prev_key)) == response.account.next_hash) {
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
                    pass: wallet.calcStartPass(wallet.gas_domain, address, password)
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
                showSuccess(str.login_success)
                if (success) success()
                $scope.close()
            }
        }
        $scope.pressEnter($scope.login)

    })
}