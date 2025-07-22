function openMinerTariffs(domain, success) {
    trackCall(arguments)
    showDialog("wallet/mining/tariffs", success, function ($scope) {
        $scope.domain = domain

        $scope.tariffs = [
            {
                title: "Starter",
                speed: 100000,
                tariff: 0.0001
            },
            {
                title: "Standard",
                speed: 1000000,
                tariff: 0.001
            },
            {
                title: "Pro",
                speed: 10000000,
                tariff: 0.01
            },
        ]

        $scope.setTariff = function (tariff) {
            postContract("mfm-miner", "set_tariff", {
                address: wallet.address(),
                tariff: tariff,
            }, $scope.close)
        }

    })
}