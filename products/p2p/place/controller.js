function openP2PPlace(domain, success) {
    trackCall(arguments)
    showDialog("products/p2p/place", success, function ($scope) {
        addExchange($scope, domain, 0)

        $scope.placeP2P = function () {
            $scope.place()
        }
    })
}