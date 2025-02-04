function openTran(next_hash, success) {
    trackCall(arguments)
    showDialog("trans/tran", success, function ($scope) {
        addTran($scope)

        $scope.loadTran(next_hash, function (response) {
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

function addTran($scope) {
    $scope.loadTran = function (next_hash, success, error) {
        postContract("mfm-token", "tran", {
            next_hash: next_hash,
        }, success, error)
    }
}