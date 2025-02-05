function openVersion(success) {
    trackCall(arguments)
    showDialog("wallet/settings/version", success, function ($scope) {
        addVersion($scope)
    })
}

function addVersion($scope) {
    $scope.loadVersion = function () {
        postContract("mfm-token", "version", {}, function (response) {
            $scope.node = response
            $scope.$apply()
        })
    }

    $scope.loadVersion()
}