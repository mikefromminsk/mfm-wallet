function addHistory($scope) {

    function loadTrans() {
        if (wallet.address() != "") {
            postContract("mfm-token", "trans", {
                from_address: wallet.address(),
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }
    }

    if (wallet.address() == "") {
        $scope.trans = []
        openLogin(loadTrans)
    } else {
        loadTrans()
    }
}