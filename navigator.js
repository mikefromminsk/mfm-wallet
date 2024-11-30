function addNavigator($scope) {

    $scope.back = function (result) {
        setTimeout(function () {
            window.$mdBottomSheet.hide(result)
            $scope.unsubscribeAll()
            $scope.removePressEnter()
        }, 100)
    }

    $scope.close = function (result) {
        setTimeout(function () {
            window.$mdDialog.hide(result)
            window.$mdBottomSheet.hide(result)
            $scope.unsubscribeAll()
            $scope.removePressEnter()
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

    $scope.openLogin = function (success) {
        openLogin(success)
    }

    $scope.openTokenProfile = function (domain) {
        openTokenProfile(domain)
    }

    $scope.openAccount = function (success) {
        openAccount(success)
    }

    $scope.openLaunchToken = function (success) {
        openLaunchToken(success)
    }

    $scope.openDistribution = function (domain, success) {
        openDistribution(domain, success)
    }

    $scope.openDeposit = function (success) {
        openDeposit(success)
    }

    $scope.openWithdrawal = function (success) {
        openWithdrawal(success)
    }

    $scope.openSend = function (domain, to_address, amount, success) {
        openSend(domain, to_address, amount, success)
    }

    $scope.openGetCredit = function (success) {
        openGetCredit(success)
    }

    $scope.openReceive = function (success) {
        openReceive(success)
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

    $scope.openSearch = function (success) {
        openSearch(success)
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

    $scope.openChart = function (key, success) {
        openChart(key, success)
    }

    $scope.openCredit = function (success) {
        openCredit(success)
    }

    $scope.openTran = function (next_hash, success) {
        openTran(next_hash, success)
    }

    $scope.openDoc = function (path) {
        openWeb(location.origin + "/mfm-angular-template/docs?path=" + path)
    }

    $scope.openExchange = function (domain) {
        openExchange(domain)
    }

    $scope.openDistribution = function (domain, success) {
        openDistribution(domain, success)
    }

    $scope.openPro = function (domain, success) {
        openPro(domain, success)
    }
    $scope.openAskCredit = function (success) {
        openAskCredit(success)
    }
}