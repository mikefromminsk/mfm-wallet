function openTran(next_hash, success) {
    showBottomSheet('/mfm-wallet/trans/tran/index.html', success, function ($scope) {

        post("/mfm-token/tran.php", {
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