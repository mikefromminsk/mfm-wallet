function openExchange(domain, is_sell) {
    trackCall(arguments)
    showDialog("exchange", null, function ($scope) {
        if (domain == wallet.gas_domain)
            domain = wallet.vavilon
        addPriceAmountTotal($scope)
        $scope.domain = domain
        $scope.is_sell = is_sell == 1

        if (window.conn != null && window.conn.readyState !== WebSocket.OPEN) {
            connectWs()
        }

        $scope.openLogin = function () {
            openLogin($scope.refresh)
        }
        $scope.portion = 0
        $scope.$watch("portion", function (new_value, old_value) {
            if (new_value == old_value) return;
            $scope.setPortion(new_value)
        })

        $scope.setPortion = function (new_value) {
            $scope.portion = new_value
            if ($scope.is_sell) {
                $scope.amount = $scope.round($scope.base * (new_value / 100))
            } else {
                $scope.total = $scope.round($scope.quote * (new_value / 100))
            }
        }

        $scope.place = function place() {
            trackCall(arguments)
            $scope.startRequest()
            postContract("mfm-exchange", "place", {
                order_type: "post_limit",
                address: wallet.address(),
                domain: domain,
                is_sell: $scope.is_sell ? 1 : 0,
                price: $scope.price,
                amount: $scope.amount,
                total: $scope.total,
            }, function (place_response) {
                let placeDomain = $scope.is_sell ? domain : wallet.gas_domain
                getPin(function (pin) {
                    calcPass(placeDomain, pin, function (pass) {
                        postContract("mfm-token", "send", {
                            domain: placeDomain,
                            from: wallet.address(),
                            to: place_response.deposit_address,
                            pass: pass,
                            amount: $scope.is_sell ? $scope.amount : $scope.total,
                        }, function (response) {
                            $scope.finishRequest()
                            showSuccessDialog(str.order_placed, function () {
                                $scope.loadBaseBalance()
                                $scope.loadQuoteBalance()
                                $scope.loadOrderbook()
                            })
                        }, $scope.finishRequest)
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            }, $scope.finishRequest)
        }

        $scope.cancel = function (order_id) {
            openAskSure(str.are_you_sure, str.yes, str.no, function () {
                postContract("mfm-exchange", "cancel", {
                    order_id: order_id,
                }, function () {
                    //$scope.refresh()
                })
            })
        }

        $scope.loadOrders = function () {
            postContract("mfm-exchange", "user_orders", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.active_orders = response.active
                $scope.history_orders = response.history
                $scope.$apply()
            })
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
                $scope.$apply()
            })
        }

        $scope.loadBaseBalance = function () {
            postContract("mfm-token", "account", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.base = response.account.balance
                $scope.$apply()
            }, function () {
            })
        }

        $scope.loadQuoteBalance = function () {
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: wallet.address(),
            }, function (response) {
                $scope.quote = response.account.balance
                $scope.$apply()
            }, function () {
            })
        }

        $scope.loadOrderbook = function () {
            postContract("mfm-exchange", "orderbook", {
                domain: domain,
            }, function (response) {
                $scope.sell = (response.sell || []).reverse()
                $scope.buy = response.buy
                $scope.$apply()
            })
            //if (user.username() != "")
            $scope.loadOrders()
        }

        $scope.subscribe("price:" + domain, function (data) {
            $scope.token.price = data.price
            $scope.$apply()
        });

        $scope.subscribe("orderbook:" + domain, function (data) {
            $scope.loadOrderbook()
        });

        $scope.subscribe("account:" + wallet.address(), function (data) {
            $scope.refresh()
        })

        $scope.refresh = function () {
            $scope.loadBaseProfile()
            $scope.loadBaseBalance()
            $scope.loadQuoteBalance()
            $scope.loadOrderbook()
        }
        $scope.refresh()
    })
}

function addPriceAmountTotal($scope) {
    $scope.setIsSell = function (is_sell) {
        $scope.is_sell = is_sell
    }

    let focused = null
    $scope.setFocus = function (focus) {
        focused = focus
    }

    $scope.$watch("price", function (price) {
        if (price == null) return
        if (price != $scope.round(price))
            $scope.price = $scope.round(price)
        else if ($scope.amount != null)
            $scope.total = $scope.round(price * $scope.amount)
    })

    $scope.$watch("amount", function (amount) {
        if (amount == null) return
        if (amount != $scope.round(amount))
            $scope.amount = $scope.round(amount)
        else if ($scope.price != null && focused == 'amount')
            $scope.total = $scope.round(amount * $scope.price)
    })

    $scope.$watch("total", function (total) {
        if (total == null) return
        if (total != $scope.round(total))
            $scope.total = $scope.round(total)
        else if ($scope.price != null)
            $scope.amount = $scope.round(total / $scope.price)
    })

    $scope.setPrice = function (price) {
        $scope.price = price
    }
}
