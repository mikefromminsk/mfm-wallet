function addStore($scope) {

    $scope.openApp = function (app) {
        if (app.domain == "mfm-mining") {
            openSelectToken(function (token) {
                openMining(token)
            })
        }
        //openWeb(location.origin + "/" + app.domain + "?domain=" + $scope.selectedToken, init)
    }

    function loadApps() {
        $scope.apps = {
            "mfm-mining": {
                title: "Mining",
                domain: "mfm-mining",
                description: "Earn MFM by mining",
            },
        }
    }

    function init() {
        loadApps()
    }

    init()
}