function openOfferPlace(domain, success) {
    trackCall(arguments)
    showDialog("products/p2p/offer_place", success, function ($scope) {
        addExchange($scope, domain, 0)

        if (DEBUG) {
            $scope.price = 4
            $scope.amount = 100
            $scope.min = 10
            $scope.max = 1000
        }

        $scope.place = function () {
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "offer_place", {
                        domain: domain,
                        address: wallet.address(),
                        price: $scope.price,
                        amount: $scope.amount,
                        min: $scope.min,
                        max: $scope.max,
                        pass: pass,
                    }, function () {
                        $scope.finishRequest()
                        showSuccessDialog(str.order_placed, $scope.close)
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            })
        }

        function init() {
            postContract("mfm-direct", "profile", {
                address: wallet.address(),
            }, function (response) {
                $scope.profile = response.profile
            }, function () {
                openPaymentAdd()
            })
        }

        init()
    })
}