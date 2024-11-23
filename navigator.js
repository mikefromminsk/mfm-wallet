function addNavigator($scope) {

    $scope.back = function (result) {
        setTimeout(function () {
            window.$mdBottomSheet.hide(result)
            $scope.unsubscribeAll()
        }, 100)
    }

    $scope.close = function (result) {
        setTimeout(function () {
            window.$mdDialog.hide(result)
            $scope.unsubscribeAll()
        }, 100)
    }

    $scope.copy = function (text) {
        let textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess(str.copied)
    }

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

    $scope.openDistribution = function () {
        openDistribution()
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

    $scope.openSearch = function () {
        openSearch()
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