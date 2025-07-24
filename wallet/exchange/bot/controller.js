function openExchangeBot(domain, success) {
    trackCall(arguments)
    showDialog("wallet/exchange/bot", success, function ($scope) {
        $scope.domain = domain
        $scope.accounts = []
        let bot_address = hashAddress(hash("exhibit tragic bundle galaxy zero lunch lift six access story round " + domain))

        $scope.selectAccount = function (domain) {
            openSend(domain, bot_address, null, init)
        }

        $scope.addLiquidity = function () {
            openSend(domain, bot_address, null, function () {
                init()
                openSend(wallet.gas_domain, bot_address, null, init)
            })
        }

        function init() {
            $scope.accounts = []
            postContract("mfm-token", "account", {
                domain: domain,
                address: bot_address,
            }, function (response) {
                $scope.accounts.push(response.account)
                $scope.$apply()
            })
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: bot_address,
            }, function (response) {
                $scope.accounts.push(response.account)
                $scope.$apply()
            })
        }

        init()
    })
}