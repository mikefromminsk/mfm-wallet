function openDirectDomain(success) {
    trackCall(arguments)
    showDialog("products/direct/domain", success, function ($scope) {
        $scope.domains = [
            "usdt",
            "pln",
            "byr",
        ]
    })
}