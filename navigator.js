function addNavigator($scope) {
    $scope.openWeb = function (page) {
        window.open(page)
    }
    $scope.openSupport = function () {
        $scope.openWeb('https://t.me/mikefromvavilon')
    }
    $scope.openLogin = function (success) {
        openLogin(success)
    }
    $scope.openProfile = function (domain, success, mode) {
        openProfile(domain, success, mode)
    }
    $scope.openSettings = function (success) {
        openSettings(success)
    }
    $scope.openLaunchToken = function (success) {
        openLaunchToken(success)
    }
    $scope.openDeposit = function (domain, success) {
        openDeposit(domain, success)
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
    $scope.openChart = function (app, key, success) {
        openChartWithAccumulate(app, key, null, success)
    }
    $scope.openChartWithAccumulate = function (app, key, accomulate, success) {
        openChartWithAccumulate(app, key, accomulate, success)
    }
    $scope.openTran = function (next_hash, success) {
        openTran(next_hash, success)
    }
    $scope.openExchange = function (domain, is_sell, success) {
        openExchange(domain, is_sell, success)
    }
    $scope.opeLaunchMining = function (domain, success) {
        openLaunchMining(domain, success)
    }
    $scope.openLaunchRecipe = function (domain, success) {
        openLaunchRecipe(domain, success)
    }
    $scope.openLaunchSimple = function (contract, success) {
        openLaunchSimple(contract, success)
    }
    $scope.openLaunchContracts = function (contract, success) {
        openLaunchContracts(contract, success)
    }
    $scope.openLanguages = function () {
        openLanguages()
    }
    $scope.openAirdropCreate = function (domain, success) {
        openAirdropCreate(domain, success)
    }
    $scope.openExchangeBot = function (title, domain, success) {
        openExchangeBot(title, domain, success)
    }
    $scope.openExchangeBots = function (domain, success) {
        openExchangeBots(domain, success)
    }
    $scope.openPool = function (domain, success) {
        openPool(domain, success)
    }
    $scope.openDividend = function (domain, success) {
        openDividend(domain, success)
    }
    $scope.openSearchDialog = function (domain, success) {
        openSearchDialog(domain, success)
    }
    $scope.openAirdropAdd = function (domain, success) {
        openAirdropAdd(domain, success)
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
    $scope.openRecipe = function (delegate, success) {
        openRecipe(delegate, success)
    }
    $scope.openLoader = function (success) {
        openLoader(success)
    }
}