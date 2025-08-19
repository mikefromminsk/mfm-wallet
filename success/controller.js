function showSuccessDialog(message, success, action_title) {
    showBottomSheet("success", success, function ($scope) {
        $scope.message = message || str.success
        $scope.title = action_title || str.close
        $scope.get_bonus = false

        new Audio("/mfm-wallet/success/payment_success.mp3").play()

        $scope.getBonusAndClose = function () {
            if (!$scope.isChecked(message)) {
                let password = hash("nation finger unable fade exist visa arch awake anchor surround paddle riot")
                let address = hashAddress(password)
                postContract("mfm-token", "account", {
                    domain: wallet.gas_domain,
                    address: address,
                }, (response) => {
                    postContract("mfm-miner", "send", {
                        domain: wallet.gas_domain,
                        from: address,
                        pass: wallet.calcPass(wallet.gas_domain, address, password, response.account.prev_key),
                        to: wallet.address(),
                        amount: 1,
                    }, function () {
                        $scope.check(message)
                        $scope.back()
                    }, $scope.back)
                })
            } else {
                $scope.back()
            }
        }
    })
}