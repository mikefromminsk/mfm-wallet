function addSearch($scope) {
    trackCall(arguments)

    $scope.recent = storage.getStringArray(storageKeys.search_history).reverse()

    $scope.openSearchResult = function found(domain) {
        trackCall(arguments)
        storage.pushToArray(storageKeys.search_history, domain, 4)
        $scope.recent = storage.getStringArray(storageKeys.search_history).reverse()
        openTokenProfile(domain)
    }

    $scope.search = function () {
        postContract("mfm-token", "search", {
            search_text: $scope.search_text,
        }, function (response) {
            $scope.tokens = response.tokens
            $scope.$apply()
        })
    }

    $scope.clear = function () {
        $scope.search_text = ""
        $scope.search()
    }

    $scope.search()
}