function openP2P(domain, success) {
    trackCall(arguments)
    showDialog("products/p2p", success, function ($scope) {
        addExchange($scope, domain, 0)

        $scope.orders = []
        $scope.sell = []
        $scope.buy = []

        $scope.setIsSell = function (is_sell) {
            $scope.is_sell = is_sell
            $scope.orders = is_sell ? $scope.buy : $scope.sell
        }

        $scope.loadOrderbook = function () {
            postContract("mfm-exchange", "orders", {
                domain: domain,
            }, function (response) {
                $scope.sell = (response.sell || []).reverse()
                $scope.buy = response.buy
                $scope.setIsSell($scope.is_sell)
                $scope.$apply()
            })
            if (wallet.address() != "")
                $scope.loadOrders()
        }

        $scope.refresh = function () {
            $scope.loadBaseProfile()
            $scope.loadQuoteBalance()
            $scope.loadOrderbook()
        }

        $scope.refresh()


    })
}