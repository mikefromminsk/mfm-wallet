function addSearch($scope) {

    $scope.clear = function () {
        $scope.search_text = ""
        $scope.search()
    }

    $scope.search = function () {
        postContract("mfm-token", "search", {
            search_text: $scope.search_text,
        }, function (response) {
            $scope.tokens = response.tokens
            $scope.$apply()
        })
    }

    $scope.search()
}

function openSearchDialog(success) {
    trackCall(arguments)
    showDialog("search", success, function ($scope) {
        addSearch($scope)
        $scope.openTokenProfile = $scope.close
    })
}