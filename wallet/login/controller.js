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
        $scope.mnemonic = bip39Generate()
    }

    $scope.login = function (mnemonic) {
        $scope.startRequest()
        let password = hash(mnemonic)
        let address = hashAddress(password)
        wallet.login(address, password, function () {
            showSuccess(str.login_success, success)
            $scope.finishRequest()
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


