function openSearch(success) {
    trackCall(arguments)
    showDialog("wallet/search", success, function ($scope) {
        $scope.recent = storage.getStringArray(storageKeys.search_history).reverse()

        $scope.openToken = function found(domain) {
            trackCall(arguments)
            storage.pushToArray(storageKeys.search_history, domain, 4)
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
        }

        setTimeout(function () {
            document.getElementById('search_input').focus()
        }, 500)
    })
}