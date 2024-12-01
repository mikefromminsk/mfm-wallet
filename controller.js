function start($scope) {
    trackCall(arguments)

    function setIcon() {
        let link = document.createElement('link');
        link.rel = 'icon';
        link.href = DEBUG ? 'logo-debug.png' : 'logo.png';
        document.head.appendChild(link);
    }

    setIcon()

    $scope.menu = ["history", "home", "wallet"]
    $scope.selectedIndex = 1
    $scope.selectTab = function (tab) {
        $scope.selectedIndex = tab
        if (tab == 0) {
            addHistory($scope)
        } else if (tab == 1) {
            addHome($scope)
        } else if (tab == 2) {
            addWallet($scope)
        }
    }

    $scope.selectTab($scope.selectedIndex)

    if (getParam("o")) {
        function referer(object) {
            trackCall(arguments)
        }
        referer(getParam("o"))
        window.history.pushState({}, document.title, "/mfm-wallet");
    }


    connectWs();
}