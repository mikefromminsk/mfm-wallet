function openDialogs($scope) {
    function loadTrans() {
        if (wallet.address() != "") {
            postContract("mfm-token", "trans", {
                address: wallet.address(),
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }
    }

    $scope.selectTran = function (tran) {
        openTran(tran.next_hash)
    }

    if (wallet.address() == "") {
        $scope.trans = []
    } else {
        loadTrans()
    }
}