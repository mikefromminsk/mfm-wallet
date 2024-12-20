function showSuccessDialog(message, success) {
    showBottomSheet("dialogs/success", success, function ($scope) {
            $scope.message = message
            //new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
    })
}