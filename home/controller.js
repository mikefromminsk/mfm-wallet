function addHome($scope) {

    $scope.DEBUG = DEBUG

    $scope.openMining = function (domain) {
        openMining(domain)
    }

    $scope.openExchange = function (domain) {
        openExchange(domain)
    }

    $scope.openTokenProfile = function (domain) {
        openTokenProfile(domain)
    }

    function init() {
        postContract("mfm-wallet", "home/api/main.php", {
        }, function (response) {
            $scope.top_mining = response.top_mining
            $scope.top_exchange = response.top_exchange
            $scope.slides = ["oak_log", "rock", "usdt", "usdt2", "usd3t2"]
            $scope.showBody = true
            $scope.$apply()
        })
    }

    init()
}