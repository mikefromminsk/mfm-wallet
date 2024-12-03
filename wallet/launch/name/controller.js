function openLaunchToken(success) {
    showDialog("/mfm-wallet/wallet/launch/name/index.html", success, function ($scope) {
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

        $scope.search = function () {
            if ($scope.search_text.length < 3) {
                $scope.tokens = []
            } else {
                postContract("mfm-token", "search.php", {
                    search_text: $scope.search_text,
                    size: 1,
                }, function (response) {
                    $scope.tokens = response.tokens
                    $scope.$apply()
                })
            }
        }

        $scope.hasTheSameToken = function () {
            return ($scope.tokens || []).filter(function(token) {
                return token.domain === $scope.search_text;
            }).length == 0;
        }

        $scope.selectName = function () {
            openLogoChange($scope.search_text, function () {
                $scope.close()
            })
        }

        $scope.pressEnter($scope.selectName)

        setTimeout(function () {
            document.getElementById('search_input').focus()
        }, 500)
    })
}
