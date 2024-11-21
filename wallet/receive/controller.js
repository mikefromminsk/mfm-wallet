function openReceive(domain, to_address, amount, success) {
    trackCall(arguments)
    showBottomSheet('/mfm-wallet/wallet/receive/index.html', success, function ($scope) {
        $scope.wallet = wallet

        $scope.copy = function () {
            $scope.copyText(wallet.address())
            showSuccess("Copied", $scope.back)
        }
    })
}