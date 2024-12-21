function getProfile(domain, success, error) {
    postContract("mfm-token", "profile", {
        domain: domain,
        address: wallet.address(),
    }, success, error)
}

function openTokenProfile(domain, success) {
    trackCall(arguments)
    showDialog("wallet/profile", success, function ($scope) {
        $scope.domain = domain

        function loadProfile() {
            postContract("mfm-token", "token_info", {
                domain: domain,
                address: wallet.address()
            }, function (response) {
                $scope.token = response.token
                $scope.owner = response.owner
                $scope.account = response.account
                $scope.analytics = response.analytics
                $scope.$apply()
            })
        }

        addChart($scope, domain + "_price", domain + "_volume")

        $scope.subscribe("price", function (data) {
            if (data.domain == domain) {
                $scope.token.price = data.price
                $scope.updateChart()
                $scope.$apply()
            }
        })

        $scope.init = function () {
            loadProfile()
            get("/mfm-token/readme.md", function (text) {
                setMarkdown("token-readme", text)
            })
        }

        $scope.init()
    })
}