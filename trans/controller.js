function addHistory($scope) {

    function loadTrans() {
        postContract("mfm-token", "trans.php", {
            from_address: wallet.address(),
        }, function (response) {
            $scope.trans = $scope.trans = $scope.groupByTimePeriod(response.trans)
            $scope.$apply()
        })
    }

    loadTrans()
}