function addNavigator($scope) {

    $scope.finish = function (result) {
        window.$mdBottomSheet.hide(result)
        $scope.unsubscribeAll()
        $scope.removePressEnter()
        clearFocus()
        historyStack.pop()
        window.history.pushState({}, document.title, historyStack[historyStack.length - 1])
    }

    $scope.back = function (result) {
        setTimeout(function () {
            $scope.finish(result)
        }, 100)
    }

    $scope.close = function (result) {
        setTimeout(function () {
            window.$mdDialog.hide(result)
            $scope.finish(result)
        }, 100)
    }
    $scope.swipeToRefreshDisable = function () {
        $scope.swipeToRefreshDisabled = true
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

    $scope.openTokenProfile = function (domain, success) {
        openTokenProfile(domain, success)
    }

    $scope.openSettings = function (success) {
        openSettings(success)
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

    $scope.openShareLink = function (title, text, url) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
    }

    $scope.openChart = function (key, success) {
        openChartWithAccomulate(key, null, success)
    }

    $scope.openChartWithAccomulate = function (key, accomulate, success) {
        openChartWithAccomulate(key, accomulate, success)
    }

    $scope.openChartAccomulate = function (key, success) {
        openChartWithAccomulate(key, key, success)
    }

    $scope.openPayOffCredit = function (success) {
        openPayOffCredit(success)
    }

    $scope.openTran = function (next_hash, success) {
        openTran(next_hash, success)
    }

    $scope.openDoc = function (path) {
        openDoc(path)
    }

    $scope.openExchange = function (domain) {
        openExchange(domain)
    }

    $scope.openDistribution = function (domain, success) {
        openDistribution(domain, success)
    }

    $scope.openSpredBot = function (domain, success) {
        openSpredBot(domain, success)
    }
    $scope.openAskCredit = function (success) {
        openAskCredit(success)
    }
    $scope.openStaking = function (domain, success) {
        openStaking(domain, success)
    }

    $scope.openAnalytics = function () {
        openAnalytics()
    }

    $scope.openReview = function () {
        openReview()
    }

    $scope.openReviews = function () {
        openReviews()
    }

    $scope.openLanguages = function () {
        openLanguages()
    }

    $scope.openShare = function (domain, success) {
        openShare(domain, success)
    }
}