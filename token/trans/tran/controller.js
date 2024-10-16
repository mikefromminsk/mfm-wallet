function openTran(next_hash, success) {
    showBottomSheet('/mfm-wallet/token/trans/tran/index.html', success, function ($scope) {
            addFormats($scope)

            post("/mfm-token/tran.php", {
                next_hash: next_hash,
            }, function (response) {
                $scope.tran = response.tran
                $scope.$apply()
            })

            /*$scope.copy = function (txid) {
                $scope.copyText(txid)
                showSuccess("TxId copied")
            }

            $scope.getTxLink = function (txid) {
                return location.origin + "/explorer?domain=" + $scope.tran[domain] + "&txid=" + txid
            }*/
    })
}