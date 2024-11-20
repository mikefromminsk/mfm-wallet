function main($scope) {
    function setIcon(){
        var link = document.createElement('link');
        link.rel = 'icon';
        link.href = DEBUG ? 'logo-debug.png' : 'logo.png';
        document.head.appendChild(link);
    }
    setIcon()

    addTokens($scope)

    if (getParam("bonus") != null) {
        openShareReceive(getParam("bonus"))
    }

    $scope.menu = ["History", "Home", "Wallet"]
    $scope.selectedIndex = 1
    $scope.selectTab = function (tab) {
        $scope.selectedIndex = tab
        if (tab == 0) {
            addHistory($scope)
        } else if (tab == 1) {
            addHome($scope)
        } else if (tab == 2) {
            addTokens($scope)
        }
    }

    $scope.selectTab($scope.selectedIndex)

    trackStart("mfm-wallet")

    connectWs();
}