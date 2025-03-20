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
        postContract("mfm-contract", "staked", {
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

    $scope.selectAccount = function (domain) {
        openTokenProfile(domain, $scope.refresh)
    }

    function subscribeAccount() {
        $scope.subscribe("account:" + wallet.address(), function (data) {
            if (data.amount != 0 && data.to == wallet.address()) {
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

    $scope.refresh = function () {
        loadTokens()
        loadStaked()
    }

    if (wallet.address() != "") {
        $scope.refresh()
        subscribeAccount()
        subscribeNewOrders()
    }
}