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

        $scope.openToken = function found(domain) {
            trackCall(arguments)
            let recent = storage.getStringArray(storageKeys.search_history)
            if (recent.indexOf(domain) == -1) {
                if (recent.length >= 4)
                    storage.removeFromArray(storageKeys.search_history, recent[0])
                storage.pushToArray(storageKeys.search_history, domain)
            }
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