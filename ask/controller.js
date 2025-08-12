function openAskSure(title, yes, no, yesCallback, noCallback) {
    showBottomSheet("ask", null, function ($scope) {
        $scope.title = title
        $scope.yes = yes
        $scope.no = no
        $scope.answerYes = function () {
            $scope.back()
            if (yesCallback)
                yesCallback()
        }

        $scope.answerNo = function () {
            $scope.back()
            if (noCallback)
                noCallback()
        }
    })
}