function openSettings(success) {
    trackCall(arguments)
    showDialog("settings", success, function ($scope) {
        $scope.language = getLanguage()
        $scope.languages = window.languages
        $scope.year = new Date().getFullYear()

        $scope.logout = function () {
            openAskSure(str.are_you_sure, str.yes, str.no, function () {
                storage.setString(storageKeys.address, '')
                storage.setString(storageKeys.passhash, '')
                if (storage.getString(storageKeys.address3) != '') {
                    $scope.changeAddress3()
                } else if (storage.getString(storageKeys.address2) != '') {
                    $scope.changeAddress2()
                }
            })
        }

        $scope.addAddress2 = function () {
            changeAddress2()
            openLogin(null, function () {
                if (wallet.address() == '')
                    changeAddress2()
            })
        }

        $scope.addAddress3 = function () {
            changeAddress3()
            openLogin(null, function () {
                if (wallet.address() == '')
                    changeAddress3()
            })
        }

        function changeAddress2() {
            let address = storage.getString(storageKeys.address)
            let passhash = storage.getString(storageKeys.passhash)
            let address2 = storage.getString(storageKeys.address2)
            let passhash2 = storage.getString(storageKeys.passhash2)
            storage.setString(storageKeys.address2, address)
            storage.setString(storageKeys.passhash2, passhash)
            storage.setString(storageKeys.address, address2)
            storage.setString(storageKeys.passhash, passhash2)
        }

        $scope.changeAddress2 = function () {
            changeAddress2()
            showSuccess(str.login_success)
        }

        function changeAddress3() {
            let address = storage.getString(storageKeys.address)
            let passhash = storage.getString(storageKeys.passhash)
            let address3 = storage.getString(storageKeys.address3)
            let passhash3 = storage.getString(storageKeys.passhash3)
            storage.setString(storageKeys.address3, address)
            storage.setString(storageKeys.passhash3, passhash)
            storage.setString(storageKeys.address, address3)
            storage.setString(storageKeys.passhash, passhash3)
        }

        $scope.changeAddress3 = function () {
            changeAddress3()
            showSuccess(str.login_success)
        }

        $scope.init = function () {
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: wallet.address(),
            }, function (response) {
                $scope.account = response.account
                $scope.$apply()
            }, function () {
            })
        }

        $scope.init()
    })
}