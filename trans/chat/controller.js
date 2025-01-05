function openChat(to, success) {
    showDialog("trans/chat", success, function ($scope) {
        postContract("mfm-token", "trans", {
            from: wallet.address(),
            to: to,
        }, function (response) {
            $scope.trans = $scope.groupByTimePeriod(response.trans)
            $scope.$apply()
        })
    })
}