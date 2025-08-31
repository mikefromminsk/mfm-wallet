function openLaunchContracts(domain, success) {
    showDialog("launch/contracts", success, function ($scope) {
        $scope.selectContract = function (contract) {
            if (contract == "mining")
                openLaunchMining(domain, function () {
                    $scope.close(domain)
                })
            if (contract == "craft")
                openLaunchRecipe(domain, function () {
                    $scope.close(domain)
                })
            if (contract == "simple")
                openLaunchSimple(domain, function () {
                    $scope.close(domain)
                })
        }
    })
}