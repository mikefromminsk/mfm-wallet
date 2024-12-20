function openExchange(domain, is_sell) {
    trackCall(arguments)
    showDialog("products/exchange", null, function ($scope) {
        $scope.domain = domain
        $scope.is_sell = is_sell == 1

        $scope.openLogin = function () {
            openLogin(init)
        }

        $scope.changePrice = function (price) {
            if (price != null)
                $scope.price = price
            if ($scope.price != null && $scope.amount != null)
                $scope.total = $scope.round($scope.price * $scope.amount, 4)
        }

        $scope.changeAmount = function (amount) {
            if (amount != null)
                $scope.amount = amount
            if ($scope.price != null && $scope.amount != null)
                $scope.total = $scope.round($scope.price * $scope.amount, 4)
        }

        $scope.changeTotal = function () {
            if ($scope.price != null && $scope.total != null)
                $scope.amount = $scope.round($scope.total / $scope.price, 2)
        }

        $scope.$watch('price', function () {
            $scope.price = $scope.round($scope.price, 2)
        })
        $scope.$watch('amount', function () {
            $scope.amount = $scope.round($scope.amount, 2)
        })
        $scope.$watch('total', function () {
            $scope.total = $scope.round($scope.total, 2)
        })
        $scope.portion = 0
        $scope.$watch('portion', function (new_value, old_value) {
            if (new_value == old_value) return;
            if ($scope.is_sell) {
                $scope.changeAmount($scope.account.balance * (new_value / 100))
            } else {
                $scope.changeAmount($scope.quote.balance / $scope.price * (new_value / 100))
            }
        })

        $scope.place = function place() {
            trackCall(arguments)
            $scope.startRequest()
            getPin(function (pin) {
                calcPassList([domain, wallet.gas_domain], pin, function (passes) {
                    postContract("mfm-exchange", "owner.php", {
                        redirect: '/mfm-exchange/place.php',
                        order_type: 'limit',
                        domain: domain,
                        is_sell: $scope.is_sell ? 1 : 0,
                        address: wallet.address(),
                        price: $scope.price,
                        amount: $scope.amount,
                        total: $scope.total,
                        pass: passes[$scope.is_sell ? domain : wallet.gas_domain]
                    }, function () {
                        $scope.finishRequest()
                        loadOrders()
                        showSuccess(str.order_placed, function () {
                            loadOrderbook()
                            /*if (storage.getString(storageKeys.first_review) == "") {
                                storage.setString(storageKeys.first_review, "1")
                                openReview(domain, loadOrderbook)
                            }*/
                        })
                    }, $scope.finishRequest)
                })
            }, $scope.finishRequest)
        }

        $scope.getCredit = function getCredit() {
            trackCall(arguments)
            openGetCredit(init)
        }

        $scope.cancel = function (order_id) {
            openAskSure(function () {
                postContract("mfm-exchange", "owner.php", {
                    redirect: '/mfm-exchange/cancel.php',
                    order_id: order_id,
                }, function () {
                    loadOrders()
                    showSuccess(str.order_canceled, loadOrderbook)
                })
            })
        }

        $scope.orders = []

        function loadOrders() {
            if (wallet.address() != "")
                postContract("mfm-exchange", "orders.php", {
                    domain: domain,
                    address: wallet.address(),
                }, function (response) {
                    $scope.orders = []
                    $scope.orders.push.apply($scope.orders, response.active)
                    $scope.orders.push.apply($scope.orders, response.history)
                    $scope.$apply()
                })
        }

        function init() {
            loadBaseProfile()
            loadQuoteBalance()
            loadOrderbook()
            loadOrders()
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
                postContract("mfm-token", "account.php", {
                    domain: wallet.gas_domain,
                    address: wallet.address(),
                }, function (response) {
                    $scope.quote = response.account
                    $scope.$apply()
                })
            }
        }

        function loadOrderbook() {
            postContract("mfm-exchange", "orderbook.php", {
                domain: domain,
            }, function (response) {
                $scope.sell = (response.sell || []).reverse()
                $scope.buy = response.buy
                $scope.orderbook = response
                $scope.$apply()
            })
        }

        //addChart($scope, domain + "_price")

        $scope.subscribe("price", function (data) {
            if (data.domain == domain) {
                $scope.token.price = data.price
                //$scope.updateChart()
                $scope.$apply()
            }
        });

        $scope.subscribe("orderbook:" + domain, function (data) {
            loadOrderbook() // get orderbook from data
        });

        $scope.subscribe("transactions", function (data) {
            if (data.to == wallet.address() || data.from == wallet.address()) {
                init()
            }
        })

        init()
    })
}