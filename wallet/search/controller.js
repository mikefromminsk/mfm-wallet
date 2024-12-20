function openSearch(success) {
    trackCall(arguments)
    showDialog("wallet/search", success, function ($scope) {

        $scope.search_text = ''
        $scope.$watch('search_text', function (newValue, oldValue) {
            if (newValue != newValue.toLowerCase())
                $scope.search_text = newValue.toLowerCase()
            if (newValue.match(new RegExp("\\W")))
                $scope.search_text = oldValue
            if (newValue.indexOf(' ') != -1)
                $scope.search_text = oldValue
            if (newValue != oldValue)
                $scope.search()
        })

        $scope.openToken = function found(domain) {
            trackCall(arguments)
            storage.pushToArray(storageKeys.search_history, domain, 4)
            openTokenProfile(domain,init)
        }

        setTimeout(function () {
            document.getElementById('search_input').focus()
        }, 500)

        $scope.search = function () {
            postContract("mfm-token", "search.php", {
                search_text: $scope.search_text,
            }, function (response) {
                $scope.tokens = response.tokens
                $scope.$apply()
            })
        }

        function init() {
            $scope.recent = storage.getStringArray(storageKeys.search_history).reverse()
            $scope.search()
        }

        init()
    })
}