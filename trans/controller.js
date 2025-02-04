function openTrans($scope) {
    addTrans($scope)

    $scope.selectTran = function (tran) {
        openTran(tran.next_hash)
    }

    if (wallet.address() == "") {
        $scope.trans = []
    } else {
        $scope.loadTrans(wallet.address())
    }
}

function addTrans($scope) {
    $scope.loadTrans = function (address) {
        if (address != "") {
            postContract("mfm-token", "trans", {
                address: address,
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }
    }
}
