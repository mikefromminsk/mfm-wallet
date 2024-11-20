function addHome($scope) {

    $scope.openMining = function (domain) {
        openMining(domain)
    }

    $scope.openExchange = function (domain) {
        openExchange(domain)
    }

    function init() {
        postContract("mfm-wallet", "home/api/main.php", {
        }, function (response) {
            $scope.top_mining = response.top_mining
            $scope.top_exchange = response.top_exchange
            $scope.$apply()
        })
    }

    init()
}