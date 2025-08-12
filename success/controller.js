function showSuccessDialog(message, success, title) {
    showBottomSheet("success", success, function ($scope) {
        $scope.message = message
        $scope.title = title || str.close
        new Audio("/mfm-wallet/success/payment_success.mp3").play()
    })
}