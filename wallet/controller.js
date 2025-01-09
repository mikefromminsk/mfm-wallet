function createOdometer(el, value) {
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

function addWallet($scope) {
    function getTokens() {
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

    function getStaked() {
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
        return totalBalance
    }

    setTimeout(() => {
        $scope.subscribe("transactions", function (data) {
            if (data.to == wallet.address()) {
                if ((data.amount || 0) != 0) {
                    showSuccess(str.you_have_received + " " + $scope.formatAmount(data.amount, data.domain))
                    setTimeout(function () {
                        new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
                    })
                }
                getTokens()
            }
        })

        $scope.subscribe("price", function (data) {
            if ($scope.accounts != null) {
                for (let account of $scope.accounts) {
                    if (account.domain == data.domain) {
                        account.token.price = data.price
                        $scope.$apply()
                        break
                    }
                }
            }
        })
    }, 1000)

    $scope.walletInit = function () {
        getTokens()
        getStaked()
    }

    $scope.swipeToRefresh = $scope.walletInit

    if (wallet.address() == "") {
        openLogin($scope.walletInit)
    } else {
        $scope.walletInit()
    }
}