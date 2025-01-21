function openExchange(domain, is_sell) {
    trackCall(arguments)
    showDialog("products/exchange", null, function ($scope) {
        addExchange($scope, domain, is_sell)
        $scope.refresh()
    })
}

function addPriceAmountTotal($scope) {
    $scope.setIsSell = function (is_sell) {
        $scope.is_sell = is_sell
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
            $scope.amount = $scope.round($scope.total / $scope.price, 4)
    }

    $scope.$watch("price", function (newValue) {
        if (newValue != null)
            $scope.price = $scope.round($scope.price, 4)
    })
    $scope.$watch("amount", function (newValue) {
        if (newValue != null)
            $scope.amount = $scope.round($scope.amount, 4)
    })
    $scope.$watch("total", function (newValue) {
        if (newValue != null)
            $scope.total = $scope.round($scope.total, 4)
    })
}

function addExchange($scope, domain, is_sell) {
    $scope.domain = domain
    $scope.is_sell = is_sell == 1

    addPriceAmountTotal($scope)

    $scope.openLogin = function () {
        openLogin($scope.refresh)
    }
    $scope.portion = 0
    $scope.$watch("portion", function (new_value, old_value) {
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
                    showSuccessDialog(str.order_placed, $scope.loadOrderbook)
                }, $scope.finishRequest)
            })
        }, $scope.finishRequest)
    }

    $scope.cancel = function (order_id) {
        openAskSure(str.are_you_sure, str.yes, str.no, function () {
            postContract("mfm-exchange", "cancel", {
                order_id: order_id,
            }, function () {
                showSuccess(str.order_canceled, $scope.refresh)
            })
        })
    }

    $scope.loadOrders = function () {
        if (wallet.address() != "") {
            postContract("mfm-exchange", "user_orders", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.active_orders = response.active
                $scope.history_orders = response.history
                $scope.$apply()
            })
        }
    }

    $scope.hasMyOrder = function (price) {
        if ($scope.active_orders == null) return false
        for (const order of $scope.active_orders)
            if (order.price == price) return true
        return false
    }

    $scope.loadBaseProfile = function () {
        getProfile(domain, function (response) {
            $scope.token = response.token
            $scope.account = response.account
            $scope.$apply()
        })
    }

    $scope.loadQuoteBalance = function () {
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

    $scope.loadOrderbook = function () {
        postContract("mfm-exchange", "orderbook", {
            domain: domain,
        }, function (response) {
            $scope.sell = (response.sell || []).reverse()
            $scope.buy = response.buy
            $scope.$apply()
        })
        if (wallet.address() != "")
            $scope.loadOrders()
    }

    $scope.subscribe("price:" + domain, function (data) {
        $scope.token.price = data.price
        $scope.$apply()
    });

    $scope.subscribe("orderbook:" + domain, function (data) {
        $scope.loadOrderbook() // get orderbook from data
    });

    $scope.subscribe("account:" + wallet.address(), function (data) {
        $scope.refresh()
    })

    $scope.refresh = function () {
        $scope.loadBaseProfile()
        $scope.loadQuoteBalance()
        $scope.loadOrderbook()
    }
}