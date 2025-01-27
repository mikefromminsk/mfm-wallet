function openAnalytics(success) {
    trackCall(arguments)
    showDialog("wallet/settings/analytics", success, function ($scope) {
        $scope.funnels = [/*
            {
                "title": "Telegram open",
                "events": [
                    "tg_start",
                    "tg_referer",
                    "tg_link",
                ]
            },*//*
            {
                "title": "Email open test_invite2",
                "events": [
                    "email_send=test_invite2",
                    "email_readed",
                    "start",
                ]
            },*/
            {
                "title": "Place orders",
                "events": [
                    "start",
                    "openTokenProfile",
                    "place",
                ]
            },
            {
                "title": "Get credits",
                "events": [
                    "start",
                    "openEarn",
                    "getCredit",
                ]
            }/*,
            {
                "title": "Answer reviews",
                "events": [
                    "start",
                    "reviewAnswer",
                ]
            }*/
        ]

        for (let funnel of $scope.funnels) {
            postContract("mfm-analytics", "funnel", {
                funnel: funnel.events.join(","),
            }, function (response) {
                funnel.response = response
                $scope.$apply()
            })
        }

        addChart($scope, "start", "start")
        postContract("mfm-analytics", "candles", {
            key: "start",
            period_name: "D",
        }, function (response) {
            $scope.dau = response.change24
            $scope.$apply()
        })

        postContract("mfm-token", "token_info", {
            domain: wallet.stocks_domain,
            address: wallet.address()
        }, function (response) {
            $scope.token = response.token
            $scope.owner = response.owner
            $scope.mining = response.mining
            $scope.exchange_bot = response.exchange_bot
            $scope.staking = response.staking
            $scope.account = response.account
            $scope.analytics = response.analytics
            $scope.$apply()
        })
    })
}