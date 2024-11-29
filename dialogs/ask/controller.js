function openAskSure(success) {
    trackCall(arguments)
    showBottomSheet('/mfm-wallet/dialogs/ask/index.html', null, function ($scope) {
        $scope.yes = function like() {
            trackCall(arguments)
            $scope.back()
            if (success)
                success()
        }

        $scope.no = function dislike(message) {
            trackCall(arguments)
            $scope.back()
        }
    })
}