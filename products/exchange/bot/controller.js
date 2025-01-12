function openExchangeBot(domain, success) {
    trackCall(arguments)
    showDialog("products/exchange/bot", success, function ($scope) {
        $scope.domain = domain
        $scope.bot_address = wallet.BOT_PREFIX + domain

        function init() {
            getProfile(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.$apply()
            })
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: wallet.address(),
            }, function (response) {
                $scope.quote = response.account
                $scope.$apply()
            })
            postContract("mfm-token", "account", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.base = response.account
                $scope.$apply()
            })
        }

        get("/mfm-wallet/docs/bot_faq.md", function (text) {
            setMarkdown("bot_faq", text)
        })

        init()
    })
}