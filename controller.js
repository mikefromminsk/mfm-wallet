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

    $scope.menu = ["Wallet", "Store", "History"]
    $scope.selectTab = function (tab) {
        $scope.selectedIndex = tab
        if (tab == 0) {
            //mfm-wallet
            addTokens($scope)
        } else if (tab == 1) {
            //store
            addStore($scope)
        } else if (tab == 2) {
            //transactions
            addTransactions($scope)
        }
    }

    trackStart()

    connectWs();
}