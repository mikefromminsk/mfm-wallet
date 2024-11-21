function openSearch(success) {
    trackCall(arguments)
    showDialog('/mfm-wallet/wallet/search/index.html', success, function ($scope) {

        $scope.search_text = ''
        $scope.$watch('search_text', function (newValue, oldValue) {
            if (newValue == null) return
            if (newValue != newValue.toLowerCase())
                $scope.search_text = newValue.toLowerCase()
            if (newValue.match(new RegExp("\\W")))
                $scope.search_text = oldValue
            if (newValue.indexOf(' ') != -1)
                $scope.search_text = oldValue
            if (newValue != oldValue)
                $scope.search()
        })

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
        $scope.search()
    })
}