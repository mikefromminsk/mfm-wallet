function openSelectToken(success) {
    showBottomSheet('/mfm-wallet/token/select_token/index.html', success, function ($scope) {

        $scope.selectToken = function (domain) {
            regAddress(domain, function () {
                $scope.back(domain)
            })
        }

        function tokens(search_text) {
            postContract("mfm-wallet", "token/api/tokens.php", {
                address: wallet.address(),
                search_text: search_text || "",
            }, function (response) {
                $scope.activeTokens = response.active
                $scope.recTokens = response.recs
                $scope.showBody = true
                $scope.$apply()
            })
        }

        $scope.regAddress = function (domain) {
            regAddress(domain, init)
        }

        function init() {
            tokens()
        }

        init()
    })
}