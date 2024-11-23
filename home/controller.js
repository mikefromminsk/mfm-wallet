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
        postContract("mfm-wallet", "home/api/main.php", {}, function (response) {
            $scope.top_mining = response.top_mining
            $scope.top_exchange = response.top_exchange
            $scope.slides = ["oak_log", "rock", "usdt", "usdt2", "usd3t2"]
            $scope.showBody = true
            //startAnimation()
            $scope.$apply()
        })
    }

    $scope.slideIndex = 0
    let interval = null

    function startAnimation() {
        if (interval != null)
            clearInterval(interval)
        interval = setInterval(function () {
            $scope.slideIndex = ($scope.slideIndex + 1) % $scope.slides.length
            $scope.$apply()
        }, 3000)
    }

    init()
}