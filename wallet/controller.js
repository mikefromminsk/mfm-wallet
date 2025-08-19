function addWallet($scope) {
    $scope.domain = wallet.gas_domain
    $scope.host = location.host

    addLogin($scope, function () {
        if ($scope.refresh)
            $scope.refresh()
        subscribeAccount()
        subscribeNewOrders()
    })

    function loadTokens() {
        postContract("mfm-token", "accounts", {
            address: wallet.address(),
        }, function (response) {
            setAccounts(response.accounts || [])
            $scope.showBody = true
            setTotalBalance()
            $scope.$apply()
        })
    }

    function setAccounts(accounts) {
        accounts.sort((a, b) => {
            if (a.domain === wallet.gas_domain) return -1;
            if (b.domain === wallet.gas_domain) return 1;
            if (a.token.price == 0 && b.token.price == 0) {
                if (a.balance == 0 && b.balance == 0)
                    return b.created - a.created
                else
                    return b.balance - a.balance
            }
            if (b.token.price == 0) return 1;
            if (a.token.price == 0) return -1;
            return (b.balance * b.token.price) - (a.balance * a.token.price);
        })
        $scope.accounts = accounts
    }

    $scope.getPrice = function (domain) {
        for (const account of $scope.accounts) {
            if (account.domain == domain)
                return account.token.price
        }
        return 0
    }

    $scope.getTotalBalance = function () {
        let totalBalance = 0
        if ($scope.accounts != null)
            for (const account of $scope.accounts)
                totalBalance += account.token.price * account.balance
        if ($scope.miner_gas_account)
            totalBalance += $scope.miner_gas_account.balance
        return totalBalance
    }

    let isDelayFinished = true
    let lastTotalBalance = 0
    function setTotalBalance() {
        if (!isDelayFinished) return;
        let newTotalBalance = $scope.getTotalBalance()
        let precision = 4
        if (newTotalBalance > 100)
            precision = 0
        else if (newTotalBalance > 1)
            precision = 2
        setTimeout(function () {
            createOdometer(document.getElementById("total"), 0, $scope.round(newTotalBalance, precision))
        }, document.getElementById("total") ? 100 : 1500)
        lastTotalBalance = newTotalBalance
        isDelayFinished = false
        setTimeout(() => {
            isDelayFinished = true
        }, 15000);
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
            if ($scope.refresh)
                $scope.refresh()
        })
    }
    let lastRefreshTime = 0
    const refreshInterval = 1000

    function subscribePrices() {
        $scope.subscribe("price", function () {
            const currentTime = Date.now()
            if ($scope.refresh && currentTime - lastRefreshTime >= refreshInterval) {
                $scope.refresh()
                lastRefreshTime = currentTime
            }
            if ($scope.search)
                $scope.search()
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

    $scope.selectTran = function (tran) {
        openTran(tran.next_hash)
    }

    function loadTrans() {
        postContract("mfm-token", "trans", {
            address: wallet.address(),
        }, function (response) {
            $scope.next_offset = response.next_offset
            $scope.trans = response.trans
            $scope.$apply()
        })
    }

    $scope.loadNextTrans = function () {
        postContract("mfm-token", "trans", {
            address: wallet.address(),
            offset: $scope.next_offset,
            size: 5,
        }, function (response) {
            $scope.next_offset = response.next_offset
            $scope.trans = [...$scope.trans, ...response.trans]
            $scope.$apply()
        })
    }

    function loadAirdrops() {
        postContract("mfm-airdrop", "list", {
            address: wallet.address()
        }, function (response) {
            $scope.top_airdrops = response.top_airdrops
            $scope.$apply()
        }, function () {
        })
    }

    function loadMinerAccount() {
        postContract("mfm-miner", "account", {
            address: wallet.address(),
        }, function (response) {
            if (response.miner_account) {
                $scope.miner_account = response.miner_account
                $scope.miner_gas_account = response.gas_account
                $scope.$apply()
            }
        }, function (response) {
        })
    }

    $scope.refresh = function () {
        loadTokens()
        loadTrans()
        loadAirdrops()
        loadMinerAccount()
    }

    if (wallet.address() != "") {
        if ($scope.refresh)
            $scope.refresh()
        subscribeAccount()
        subscribeNewOrders()
        subscribePrices()
    } else {
        $scope.trans = []
        $scope.showBody = true
        if (getTelegramUserId() != null) {
            openTelegramLogin("", $scope.refresh)
        }
    }
}