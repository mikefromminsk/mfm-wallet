function addSearch($scope) {
    trackCall(arguments)


    $scope.search = function () {
        postContract("mfm-token", "search", {
            search_text: $scope.search_text,
        }, function (response) {
            $scope.tokens = response.tokens
            $scope.$apply()
        })
    }

    $scope.refresh = function () {
        $scope.recent = storage.getStringArray(storageKeys.search_history).reverse()
    }

    $scope.clear = function () {
        $scope.search_text = ""
        $scope.search()
    }

    $scope.search()
    $scope.refresh()
}