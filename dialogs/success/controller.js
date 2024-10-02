function showSuccessDialog(message, success) {
    window.$mdBottomSheet.show({
        templateUrl: '/mfm-wallet/dialogs/success/index.html',
        controller: function ($scope, $mdBottomSheet) {
            addFormats($scope)
            $scope.message = message
            //new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
        }
    }).then(function () {
        if (success)
            success()
    })
}