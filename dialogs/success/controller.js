function showSuccessDialog(message, success, title) {
    showBottomSheet("dialogs/success", success, function ($scope) {
        $scope.message = message
        $scope.title = title || str.close
        new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
    })
}