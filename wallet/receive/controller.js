function openReceive(success) {
    trackCall(arguments)
    showBottomSheet('/mfm-wallet/wallet/receive/index.html', success, function ($scope) {

        $scope.receive = function () {
            let bonus = $scope.share_pass.split(":")
            postContractWithGas("mfm-bank",  "receive.php", {
                domain: bonus[0],
                to_address: wallet.address(),
                invite_key: bonus[1],
            }, function (response) {
                showSuccessDialog("You have been received " + $scope.formatAmount(response.received), init)
            })
        }
    })
}