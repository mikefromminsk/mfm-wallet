let rewardPassword = hash("nation finger unable fade exist visa arch awake anchor surround paddle riot")
let rewardAddress = hashAddress(rewardPassword)
const maxRewards = 5
const energyReward = 100
let rewardsReceived = maxRewards

function loadRewards($scope) {
    $scope.maxRewards = maxRewards
    $scope.energyReward = energyReward
    postContract("mfm-miner", "trans", {
        domain: wallet.gas_domain,
        address: rewardAddress,
        to: wallet.address(),
        size: maxRewards,
    }, (response) => {
        $scope.rewardsReceived = response.trans.length
        $scope.$apply()
    }, function () {
        $scope.rewardsReceived = 0
        $scope.$apply()
    })
}

function addWallet($scope) {
    $scope.domain = wallet.gas_domain
    $scope.host = location.host

    addLogin($scope, function () {
        if ($scope.refresh)
            $scope.refresh()
        $scope.subscribeAccount()
    })

    $scope.finishOnboardingPercent = function () {
        return Math.min(5,
            Math.max($scope.rewardsReceived,
                ($scope.isChecked(str.your_token_created) ? 1 : 0) +
                ($scope.isChecked(str.you_start_mining) ? 1 : 0) +
                ($scope.isChecked(str.giveaway_received) ? 1 : 0) +
                ($scope.isChecked(str.order_placed) ? 1 : 0) +
                ($scope.isChecked(str.you_block_tokens) ? 1 : 0)
            )
        ) * 20
    }

    function loadTokens(recalculateTotal) {
        postContract("mfm-token", "accounts", {
            address: wallet.address(),
        }, function (response) {
            setAccounts(response.accounts || [])
            $scope.showBody = true
            $scope.$apply()
            loadMinerAccount(recalculateTotal)
        })
    }

    function setAccounts(accounts) {
        accounts.sort((a, b) => {
            try {
                if (a.domain === wallet.gas_domain) return -1
                if (b.domain === wallet.gas_domain) return 1
                const aPrice = a.token?.price || 0
                const bPrice = b.token?.price || 0
                if (aPrice === 0 && bPrice === 0)
                    return (b.balance || 0) - (a.balance || 0)
                if (bPrice === 0) return -1
                if (aPrice === 0) return 1
                return (b.balance * bPrice) - (a.balance * aPrice)
            } catch (e) {
                return 0
            }
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

    function setTotalBalance(recalculateTotal) {
        if (!recalculateTotal)
            if (!isDelayFinished) return
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
        }, 15000)
    }

    $scope.selectAccount = function (domain) {
        openProfile(domain, refresh)
    }

    let lastRefreshTime = 0
    const refreshInterval = 1000

    function subscribePrices() {
        $scope.subscribe("price", function () {
            const currentTime = Date.now()
            if ($scope.refresh && currentTime - lastRefreshTime >= refreshInterval) {
                refresh()
                lastRefreshTime = currentTime
            }
            if ($scope.search)
                $scope.search()
        })
    }

    $scope.selectTran = function (tran) {
        openTran(tran.next_hash)
    }

    function loadTrans() {
        postContract("mfm-token", "trans", {
            address: wallet.address(),
        }, function (response) {
            $scope.trans = $scope.groupByTimePeriod(response.trans)
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

    function loadMinerAccount(recalculateTotal) {
        postContract("mfm-miner", "account", {
            address: wallet.address(),
        }, function (response) {
            if (response.miner_account) {
                $scope.miner_account = response.miner_account
                $scope.miner_gas_account = response.gas_account
                $scope.$apply()
            }
            setTotalBalance(recalculateTotal)
        }, function () {
            $scope.miner_account = null
            $scope.miner_gas_account = null
            $scope.$apply()
            setTotalBalance(recalculateTotal)
        })
    }

    $scope.isMiningEnabled = function () {
        return $scope.miner_account
            && $scope.miner_account.domains
            && $scope.miner_account.domains != ""
    }

    $scope.isMiningPaused = function () {
        if ($scope.isMiningEnabled()
            && $scope.miner_gas_account?.balance < $scope.miner_account?.domains.split(',').length * 0.0001) {
            return true;
        }
        return false
    }

    $scope.isMining = function () {
        if ($scope.isMiningEnabled()
            && $scope.miner_gas_account?.balance >= $scope.miner_account?.domains.split(',').length * 0.0001) {
            return true;
        }
        return false
    }

    $scope.launch = function () {
        openLaunchToken(function (domain) {
            postContract("mfm-token", "token", {
                domain: domain,
                address: wallet.address()
            }, function (response) {
                if (response.supply.delegate.startsWith("mfm-contract/mint"))
                    openMiner(domain, refresh)
            })
            refresh()
        })
    }

    $scope.refresh = function () {
        refresh(true)
    }

    function refresh(recalculateTotal) {
        loadTokens(recalculateTotal)
        loadTrans()
        loadAirdrops()
        loadRewards($scope)
    }

    if (wallet.address() != "") {
        if (refresh)
            refresh()
        $scope.subscribeAccount()
        subscribePrices()
    } else {
        $scope.trans = []
        $scope.showBody = true
        if (getTelegramUserId() != null) {
            openTelegramLogin("", refresh)
        }
    }
}