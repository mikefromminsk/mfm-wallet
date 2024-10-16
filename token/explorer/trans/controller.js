function main($scope) {
    $scope.searchTxid = ""

    $scope.search_domain = ''
    $scope.$watch('search_domain', function (newValue) {
        if (newValue == null) return
        post("/mfm-wallet/api/search.php", {
            search_text: (newValue || ""),
        }, function (response) {
            $scope.searchCoins = response.result
            $scope.$apply()
            if (getParam("domain")) {
                $scope.selectDomain($scope.searchCoins[0])
                if (getParam("txid"))
                    openTran($scope.selectedToken, getParam("txid"))
            }
        })
    })

    if (getParam("domain")) {
        $scope.search_domain = getParam("domain")
    }

    $scope.selectDomain = function (coin) {
        $scope.selectedCoin = coin
        $scope.searchCoins = [coin]
        post("/mfm-wallet/api/trans_domain.php", {
            domain: coin.domain,
        }, function (response) {
            $scope.trans = $scope.groupByTimePeriod(response.trans)
            $scope.$apply()
        })
    }

    $scope.openTran = function (tran) {
        openTran(tran.domain, tran.txid)
    }

    $scope.searchTran = function () {
        openTran($scope.selectedToken, $scope.searchTxid)
    }
}