function openTran(domain, txid, success) {
    showBottomSheet('/mfm-wallet/token/trans/tran/index.html', success, function ($scope) {
            addFormats($scope)
            $scope.domain = domain
            $scope.username = wallet.address()

            post("/mfm-wallet/api/tran.php", {
                domain: domain,
                txid: txid,
            }, function (response) {
                $scope.tran = response
            })

            $scope.copy = function (txid) {
                $scope.copyText(txid)
                showSuccess("TxId copied")
            }

            $scope.getTxLink = function (txid) {
                return location.origin + "/explorer?domain=" + domain + "&txid=" + txid
            }
    })
}