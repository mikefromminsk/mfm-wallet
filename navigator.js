function addNavigator($scope) {

    $scope.getLanguage = function () {
        return getLanguage()
    }

    function historyBack() {
        historyStack.pop()
        if (getTelegramUserId() == null)
            window.history.pushState({}, document.title, historyStack[historyStack.length - 1])
    }

    function finish() {
        $scope.unsubscribeAll()
        $scope.removePressEnter()
        clearFocus()
    }

    $scope.channels = []
    $scope.subscription_id_list = []
    $scope.subscribe = function (channel, callback) {
        if ($scope.channels.indexOf(channel) == -1) {
            $scope.subscription_id_list.push(subscribe(channel, callback))
            $scope.channels.push(channel)
        }
    }

    $scope.unsubscribeAll = function () {
        for (let subscription_id of $scope.subscription_id_list) {
            unsubscribe(subscription_id)
        }
    }

    $scope.scrollTo = function (id) {
        setTimeout(function () {
            document.getElementById(id).scrollIntoView({behavior: 'smooth'})
        }, 100)
    }

    $scope.back = function (result) {
        window.$mdBottomSheet.hide(result)
        finish()
    }

    $scope.close = function (result) {
        window.$mdDialog.hide(result)
        finish()
        historyBack()
    }

    $scope.closeAll = function (success) {
        for (let i = 0; i < 10; i++){
            window.$mdDialog.hide()
            historyBack()
        }
        finish()
        if (success)
            success()
    }

    $scope.open = function (link) {
        window.finishAutoOpening = false
        historyStack.push(link)
        if (getTelegramUserId() == null)
            history.pushState({}, '', link)
        loaded()
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

    $scope.stringHash = function (string) {
        let hash = 0;
        if (string != null) {
            for (const char of string) {
                hash = (hash << 5) - hash + char.charCodeAt(0)
                hash |= 0;
            }
        }
        return hash;
    }

    $scope.check = function (value) {
        storage.setString(storageKeys.check_prefix + $scope.stringHash(value), "true")
    }

    $scope.isChecked = function (value) {
        return storage.getString(storageKeys.check_prefix + $scope.stringHash(value)) == "true"
    }

    $scope.isNotChecked = function (value) {
        return !$scope.isChecked(value)
    }

    $scope.openLogin = function (success) {
        openLogin(success)
    }

    $scope.openTokenProfile = function (domain, success, mode) {
        openTokenProfile(domain, success, mode)
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

    $scope.openDeposit = function (domain, success) {
        openDeposit(domain, success)
    }

    $scope.openNetwork = function (success) {
        openNetwork(success)
    }

    $scope.openWithdrawal = function (domain, success) {
        openWithdrawal(domain, success)
    }

    $scope.openSend = function (domain, to_address, amount, success, project) {
        openSend(domain, to_address, amount, success, project)
    }

    $scope.openWebMiner = function (domain, success) {
        openWebMiner(domain, success)
    }

    $scope.openAirdrop = function (promo, success) {
        openAirdrop(promo, success)
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
        $scope.openWeb('https://t.me/vavilon_bugs')
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
        openChartWithAccumulate(key, null, success)
    }

    $scope.openChartWithAccumulate = function (key, accomulate, success) {
        openChartWithAccumulate(key, accomulate, success)
    }

    $scope.openChartWithAccumulate = function (key, success) {
        openChartWithAccumulate(key, key, success)
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

    $scope.openExchange = function (domain, is_sell, success) {
        openExchange(domain, is_sell, success)
    }

    $scope.openDistribution = function (domain, success) {
        openDistribution(domain, success)
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

    $scope.openAirdropCreate = function (domain, success) {
        openAirdropCreate(domain, success)
    }

    $scope.openExchangeBot = function (domain, success) {
        openExchangeBot(domain, success)
    }

    $scope.openExchangeBots = function (domain, success) {
        openExchangeBots(domain, success)
    }

    $scope.openP2P = function (success) {
        openP2P(success)
    }

    $scope.openOfferPlace = function (domain, success) {
        openOfferPlace(domain, success)
    }

    $scope.openPaymentAdd = function (domain, success) {
        openPaymentAdd(domain, success)
    }

    $scope.openOrderPlace = function (order_id, success) {
        openOrderPlace("" + order_id, success)
    }

    $scope.openOrder = function (order_id, success) {
        openOrder("" + order_id, success)
    }

    $scope.openP2PChat = function (order_id, success) {
        openP2PChat("" + order_id, success)
    }

    $scope.openP2PProfile = function (address, success) {
        openP2PProfile(address, success)
    }

    $scope.openSelectDomain = function (success) {
        openSelectDomain(success)
    }

    $scope.openVersion = function (success) {
        openVersion(success)
    }

    $scope.openQuiz = function (success) {
        openQuiz(success)
    }

    $scope.openPool = function (domain, success) {
        openPool(domain, success)
    }

    $scope.openBuy = function (domain) {
        openExchange(domain, 0)
    }

    $scope.openSell = function (domain) {
        openExchange(domain, 1)
    }

    $scope.openExchangeBot = function (domain, success) {
        openExchangeBot(domain, success)
    }

    $scope.openDividend = function (domain, success) {
        openDividend(domain, success)
    }

    $scope.openMinerTariffs = function (domain, success) {
        openMinerTariffs(domain, success)
    }

    $scope.openSearchDialog = function (domain, success) {
        openSearchDialog(domain, success)
    }

    $scope.openAirdropAdd = function (domain, success) {
        openAirdropAdd(domain, success)
    }

    $scope.openAirdrop = function (domain, success) {
        openAirdrop(domain, success)
    }

    $scope.openMiner = function (domain, success) {
        openMiner(domain, success)
    }

    $scope.openMinerTestReadUsers = function () {
        openMinerTestReadUsers()
    }

    $scope.openTelegramLogin = function (bot_name, success) {
        openTelegramLogin(bot_name, success)
    }

    $scope.openOnboarding = function (domain, success) {
        openOnboarding(domain, success)
    }

    $scope.openLanding = function () {
        location.href = "/mfm-landing"
    }

    $scope.openWeb = function (page) {
        window.open(page)
    }
}