function openAnalytics(success) {
    trackCall(arguments)
    showDialog("wallet/settings/funnel", success, function ($scope) {
        $scope.funnels = [
            {
                "title": "Telegram open",
                "events": [
                    "tg:start",
                    "ui:tg_referer",
                    "ui:tg_link",
                ]
            },
            {
                "title": "Email open test_invite2",
                "events": [
                    "email:send=test_invite2",
                    "email:readed",
                    "ui:start",
                ]
            },
            {
                "title": "Place orders",
                "events": [
                    "ui:start",
                    "ui:openTokenProfile",
                    "ui:place",
                ]
            },
            {
                "title": "Get credits",
                "events": [
                    "ui:start",
                    "ui:openGetCredit",
                    "ui:getCredit",
                ]
            }/*,
            {
                "title": "Answer reviews",
                "events": [
                    "ui:start",
                    "ui:reviewAnswer",
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

        addChart($scope, "ui:start", "ui:start")
    })
}