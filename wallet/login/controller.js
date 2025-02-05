function openLogin(success) {
    trackCall(arguments)
    if (wallet.address() != "") {
        if (success) success()
        return
    }
    showDialog("wallet/login", success, function ($scope) {
        addLogin($scope, success)
    })
}

function addLogin($scope, success) {
    $scope.validateBip39 = function (mnemonic) {
        return mnemonic.split(" ").length == 12
    }

    if (DEBUG) {
        $scope.mnemonic = "nation finger unable fade exist visa arch awake anchor surround paddle riot"
    } else {
        $scope.mnemonic = ""
        for (let i = 0; i < 12; i++) {
            $scope.mnemonic += bip39_wordlist[Math.floor(Math.random() * bip39_wordlist.length)] + " "
        }
        $scope.mnemonic = $scope.mnemonic.trim()
    }

    $scope.login = function (mnemonic) {
        $scope.startRequest()
        let password = md5(mnemonic)
        let address = md5(password)
        authorize(address, password, loginSuccess, $scope.finishRequest, function () {
            postContract("mfm-token", "send", {
                domain: wallet.gas_domain,
                to: address,
                amount: 0,
                pass: wallet.calcStartPass(wallet.gas_domain, address, password)
            }, loginSuccess, $scope.finishRequest)
        })

        function loginSuccess() {
            getPin(function (pin) {
                // set pin
                storage.setString(storageKeys.address, address)
                storage.setString(storageKeys.passhash, encode(password, pin))
                if (pin != null)
                    storage.setString(storageKeys.hasPin, true)
                showSuccess(str.login_success, success)
                $scope.close()
            }, function () {
                // skip pin
                storage.setString(storageKeys.address, address)
                storage.setString(storageKeys.passhash, password)
                showSuccess(str.login_success, success)
                $scope.close()
            })
        }
    }
    $scope.copied = false
    $scope.copySeed = function () {
        $scope.copy($scope.mnemonic)
        $scope.copied = true
    }
}

function authorize(address, password, success, invalid_pass, error) {
    postContract("mfm-token", "account", {
        domain: wallet.gas_domain,
        address: address,
    }, function (response) {
        if (md5(wallet.calcHash(
            wallet.gas_domain,
            address,
            password,
            response.account.prev_key)) == response.account.next_hash) {
            success()
        } else {
            showError(str.password_invalid, invalid_pass)
        }
    }, error)
}
