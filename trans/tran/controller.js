function openTran(next_hash, success) {
    showDialog('/mfm-wallet/trans/tran/index.html', success, function ($scope) {

        let tryCount = 0

        function getTran() {
            if (tryCount < 3)
                post("/mfm-token/tran.php", {
                    next_hash: next_hash,
                }, function (response) {
                    $scope.tran = response.tran
                    $scope.trans = $scope.groupByTimePeriod([response.tran])
                    $scope.$apply()
                }, getTran)
        }

        getTran()
        /*
        $scope.getTxLink = function (txid) {
            return location.origin + "/explorer?domain=" + $scope.tran[domain] + "&txid=" + txid
        }*/
    })
}