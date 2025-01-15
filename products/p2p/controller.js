function openP2P(promo, success) {
    trackCall(arguments)
    showDialog("products/p2p", success, function ($scope) {
        $scope.place = function place() {
            trackCall(arguments)
            $scope.startRequest()
            getPin(function (pin) {
                calcPassList([domain, wallet.gas_domain], pin, function (passes) {
                    postContract("mfm-exchange", "place", {
                        order_type: "limit",
                        domain: domain,
                        is_sell: $scope.is_sell ? 1 : 0,
                        address: wallet.address(),
                        price: $scope.price,
                        amount: $scope.amount,
                        total: $scope.total,
                        pass: passes[$scope.is_sell ? domain : wallet.gas_domain]
                    }, function () {
                        $scope.finishRequest()
                        showSuccessDialog(str.order_placed, function () {
                            loadOrderbook()
                        })
                    }, $scope.finishRequest)
                })
            }, $scope.finishRequest)
        }

        $scope.refresh = function () {
            loadBaseProfile()
            loadQuoteBalance()
            loadOrderbook()
        }


        function loadBaseProfile() {
            getProfile(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.$apply()
            })
        }

        function loadQuoteBalance() {
            if (wallet.address() != "") {
                postContract("mfm-token", "account", {
                    domain: wallet.gas_domain,
                    address: wallet.address(),
                }, function (response) {
                    $scope.quote = response.account
                    $scope.$apply()
                }, function (message) {
                    console.log(message)
                })
            }
        }

        function loadOrderbook() {
            postContract("mfm-exchange", "orderbook", {
                domain: domain,
            }, function (response) {
                $scope.sell = (response.sell || []).reverse()
                $scope.buy = response.buy
                $scope.$apply()
            })
            if (wallet.address() != "")
                loadOrders()
        }
    })
}