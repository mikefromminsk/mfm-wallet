function openTran(next_hash, success) {
    showDialog("trans/tran", success, function ($scope) {
        postContract("mfm-token", "tran", {
            next_hash: next_hash,
        }, function (response) {
            $scope.tran = response.tran
            $scope.trans = $scope.groupByTimePeriod([response.tran])
            $scope.$apply()
        })
        /*
        $scope.getTxLink = function (txid) {
            return location.origin + "/explorer?domain=" + $scope.tran[domain] + "&txid=" + txid
        }*/
    })
}