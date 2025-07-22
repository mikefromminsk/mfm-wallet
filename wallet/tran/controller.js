function openTran(next_hash, success) {
    trackCall(arguments)
    showDialog("wallet/tran", success, function ($scope) {
        postContract("mfm-token", "tran", {
            next_hash: next_hash,
        }, function (response) {
            $scope.tran = response.tran
            $scope.trans = $scope.groupByTimePeriod([response.tran])
            $scope.$apply()
        })
    })
}