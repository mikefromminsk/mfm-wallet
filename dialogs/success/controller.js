function showSuccessDialog(message, success) {
    showBottomSheet('/mfm-wallet/dialogs/success/index.html', success, function ($scope, $mdBottomSheet) {
            addFormats($scope)
            $scope.message = message
            //new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
    })
}