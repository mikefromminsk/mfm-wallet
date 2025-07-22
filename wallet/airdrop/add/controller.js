function openAirdropAdd(domain, success) {
    trackCall(arguments)
    showDialog("wallet/airdrop/add", success, function ($scope) {

        $scope.tasks = [
            {
                type: "registration"
            },
            {
                type: "exchange",
            },
            {
                type: "subscribe_tg=vavilon_org",
            },
        ]

        $scope.add = function () {
            postContract("mfm-airdrop", "add", {
                domain: domain,
                address: wallet.address(),
                tasks: $scope.tasks,
            }, function (response) {

            })
        }

    })
}