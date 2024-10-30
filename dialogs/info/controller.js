function showInfoDialog(message, success) {
    showBottomSheet('/mfm-wallet/dialogs/info/index.html', success, function ($scope) {
        $scope.message = message
    })
}

function hasGas(success) {
    postContract("mfm-token", "account.php", {
        domain: wallet.gas_domain,
        address: wallet.address(),
    }, function (response) {
        if (response.balance > 0) {
            if (success)
                success()
        } else {
            showBottomSheet('/mfm-wallet/dialogs/info/index.html', null, function ($scope) {
                $scope.openCredit = function () {
                    $scope.back()
                    openCredit()
                }

                $scope.openDeposit = function () {
                    $scope.back()
                    openDeposit()
                }
            })
        }
    })
}