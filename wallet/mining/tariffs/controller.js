function openMinerTariffs(domain, success) {
    trackCall(arguments)
    showDialog("wallet/mining/tariffs", success, function ($scope) {
        $scope.domain = domain

        $scope.tariffs = [
            {
                title: "Starter",
                speed: 10000,
                tariff: 0.0001
            },
            {
                title: "Standard",
                speed: 100000,
                tariff: 0.001
            },
            {
                title: "Pro",
                speed: 1000000,
                tariff: 0.01
            },
        ]

        $scope.setTariff = function () {
            postContract("mfm-miner", "set_tariff", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                showSuccess(str.success)
            })
        }

    })
}