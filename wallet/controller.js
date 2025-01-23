function createOdometer(el, value) {
    if (el == null) return
    const odometer = new Odometer({
        el: el,
        value: 0,
    })

    let hasRun = false
    const callback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!hasRun) {
                    odometer.update(value)
                    hasRun = true
                }
            }
        })
    }

    const observer = new IntersectionObserver(callback, {
        threshold: [0, 0.9],
    })
    observer.observe(el)
}

function openWallet($scope) {

    $scope.domain = "usdt"

    addLogin($scope, function () {
        $scope.refresh()
        subscribeAccount()
        subscribeNewOrders()
    })

    function loadTokens() {
        postContract("mfm-token", "accounts", {
            address: wallet.address(),
        }, function (response) {
            $scope.accounts = response.accounts
            setTimeout(function () {
                createOdometer(document.getElementById("total"), $scope.getTotalBalance())
            }, 100)
            $scope.$apply()
        })
    }

    $scope.getPrice = function (domain) {
        for (const account of $scope.accounts) {
            if (account.domain == domain)
                return account.token.price
        }
        return 0
    }

    function loadStaked() {
        postContract("mfm-token", "staked", {
            address: wallet.address(),
        }, function (response) {
            $scope.staked = response.staked
            $scope.$apply()
        })
    }

    $scope.getTotalBalance = function () {
        let totalBalance = 0
        if ($scope.accounts != null)
            for (const account of $scope.accounts)
                totalBalance += account.token.price * account.balance
        if ($scope.staked != null)
            for (const stake of $scope.staked)
                totalBalance += $scope.getPrice(stake.domain) * stake.amount
        if ($scope.orders != null)
            for (const order of $scope.orders)
                totalBalance += order.total
        return totalBalance
    }

    function subscribeAccount() {
        $scope.subscribe("account:" + wallet.address(), function (data) {
            if (data.amount != 0) {
                showSuccess(str.you_have_received + " " + $scope.formatAmount(data.amount, data.domain))
                setTimeout(function () {
                    new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
                })
            }
            $scope.refresh()
        })
    }

    function subscribeNewOrders() {
        $scope.subscribe("new_order:" + wallet.address(), function (data) {
            showSuccess(str.new_p2p_order)
            setTimeout(function () {
                new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
            })
        })
    }

    function loadOrders() {
        if (wallet.address() != "") {
            postContract("mfm-exchange", "user_orders_active", {
                address: wallet.address(),
            }, function (response) {
                $scope.orders = response.orders
                $scope.$apply()
            })
        }
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

    $scope.refresh = function () {
        loadTokens()
        loadStaked()
        loadOrders()
    }

    if (wallet.address() != "") {
        $scope.refresh()
        subscribeAccount()
        subscribeNewOrders()
    }
}