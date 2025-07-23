function start($scope) {
    trackCall(arguments)

    document.title = window.location.hostname

    $scope.menu = ["apps", "wallet", "search"]
    $scope.selectedIndex = 1
    $scope.selectTab = function (tab) {
        $scope.selectedIndex = tab
        if (tab == 0) {
            addStore($scope)
        } else if (tab == 1) {
            addWallet($scope)
        } else if (tab == 2) {
            openSearch($scope)
        }
        swipeToRefresh($scope.swipeToRefresh)
    }
    $scope.showBody = true

    $scope.swipeToRefresh = function () {
        $scope.selectTab($scope.selectedIndex)
    }

    $scope.selectTab($scope.selectedIndex)

    if (window.location.search != "") {
        window.history.pushState({}, document.title, "/mfm-wallet")
    }

    window.addEventListener('popstate', () => {
        $scope.close()
    })

    connectWs()
}

window.finishAutoOpening = false

function loaded() {
    if (!finishAutoOpening) {
        for (const [functionName, value] of new URLSearchParams(window.location.hash.substring(1))) {
            if (functionName.startsWith('open')) {
                if (typeof window[functionName] === 'function' && functionName != 'openWallet') {
                    setTimeout(function () {
                        window[functionName](value)
                    }, 100)
                }
                window.finishAutoOpening = true
            }
        }
    }
}