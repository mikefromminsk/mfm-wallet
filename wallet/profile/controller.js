function getProfile(domain, success, error) {
    postContract("mfm-token", "profile.php", {
        domain: domain,
        address: wallet.address(),
    }, success, error)
}

function openTokenProfile(domain, success) {
    trackCall(arguments)
    showDialog('/mfm-wallet/wallet/profile/index.html', success, function ($scope) {
        $scope.domain = domain

        function loadProfile() {
            getProfile(domain, function (response) {
                $scope.token = response
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