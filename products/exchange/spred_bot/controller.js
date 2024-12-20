function openSpredBot(domain, success) {
    showDialog("products/exchange/spred_bot", success, function ($scope) {
        $scope.domain = domain


        get("/mfm-exchange/spred_bot/readme.md", function (text) {
            setMarkdown("spred_bot_readme", text)
        })

        $scope.send = function () {
            openSend(wallet.gas_domain, "bot_spred_" + domain, 10, success)
        }

        function init() {
            getProfile(wallet.gas_domain, function (response) {
                $scope.token = response
                $scope.$apply()
            })
        }

        init()
    })
}