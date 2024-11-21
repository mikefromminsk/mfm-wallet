function addNavigator($scope) {

    $scope.openLogin = function (init) {
        openLogin(init)
    }

    $scope.openTokenProfile = function (domain) {
        openTokenProfile(domain)
    }

    $scope.openAccount = function () {
        openAccount()
    }

    $scope.openLaunchToken = function () {
        openLaunchToken()
    }

    $scope.openDeposit = function () {
        openDeposit()
    }

    $scope.openWithdrawal = function () {
        openWithdrawal()
    }

    $scope.openSend = function () {
        openSend()
    }

    $scope.openCredit = function () {
        openCredit()
    }

    $scope.openReceive = function () {
        openReceive()
    }

    $scope.openMining = function (domain) {
        openMining(domain)
    }

    $scope.openBuy = function (domain) {
        openExchange(domain, 0)
    }

    $scope.openSell = function (domain) {
        openExchange(domain, 1)
    }

    $scope.openTokenSettings = function () {
        openLogoChange(domain, function (result) {
            if (result == "success")
                location.reload()
        })
    }

    $scope.openSite = function () {
        window.open("/" + domain)
    }

    $scope.openSupport = function () {
        window.open("https://t.me/mytoken_space_bot")
    }
}