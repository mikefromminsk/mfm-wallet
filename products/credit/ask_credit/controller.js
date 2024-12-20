function openAskCredit(success) {
    trackCall(arguments)
    showBottomSheet("credit/ask_credit", null, function ($scope) {
        $scope.accept = function () {
            $scope.back()
            $scope.openGetCredit(success)
        }
    })
}