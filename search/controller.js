function openSearch(success) {
    trackCall(arguments)
    showDialog("search", success, function ($scope) {
        addSearch($scope)
        $scope.openTokenProfile = $scope.close
    })
}

function addSearch($scope) {
    $scope.clear = function () {
        $scope.search_text = ""
        $scope.search()
    }

    $scope.search = function () {

        let search_text = $scope.search_text

        let translations = []
        if (search_text != '') {
            for (const key of Object.keys(ticker)) {
                const value = ticker[key].toLowerCase()
                if (value.startsWith(search_text))
                    translations.push(key)
            }
        }

        if (translations.length > 0) {
            postContract("mfm-token", "tokens", {
                domains: translations.join(",")
            }, function (response) {
                $scope.tokens = response.tokens
                $scope.$apply()
            }, function () {})
        } else {
            postContract("mfm-token", "search", {
                search_text: search_text
            }, function (response) {
                $scope.tokens = response.tokens
                $scope.$apply()
            }, function () {})
        }
    }

    $scope.search()
}