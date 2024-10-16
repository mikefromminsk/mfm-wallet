function main($scope) {

    $scope.params = window.location.search

    $scope.domain = getParam("domain") || 'data'

    if (getParam("txid")) {
        $scope.selectedIndex = 1
    }
}