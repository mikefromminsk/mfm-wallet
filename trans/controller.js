function addDialogs($scope) {

    function loadTrans() {
        if (wallet.address() != "") {
            postContract("mfm-token", "tran_dialogs", {
                address: wallet.address(),
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.dialogs)
                $scope.$apply()
            })
        }
    }

    $scope.selectTran = function (tran) {
        openChat(tran.from == wallet.address() ? tran.to : tran.from)
    }

    if (wallet.address() == "") {
        $scope.trans = []
    } else {
        loadTrans()
    }
}