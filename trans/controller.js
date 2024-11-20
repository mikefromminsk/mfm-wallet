function addTransactions($scope) {

    function loadTrans() {
        postContract("mfm-token", "trans.php", {
            address: wallet.address(),
        }, function (response) {
            $scope.trans = []
            $scope.$apply()
        })
    }

    $scope.openTran = function (tran) {
        openTran(tran.next_hash)
    }

    loadTrans()
}