function start($scope) {
    trackCall(arguments)

    document.title = window.location.hostname

    $scope.menu = ["apps", "wallet", "search"]
    $scope.selectedIndex = 1
    $scope.selectTab = function (tab) {
        $scope.selectedIndex = tab
        if (tab == 0) {
            openStore($scope)
        } else if (tab == 1) {
            openWallet($scope)
        } else if (tab == 2) {
            addSearch($scope)
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
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        for (const [key, value] of params) {
            if (key.startsWith('open')) {
                const functionName = key
                if (typeof window[functionName] === 'function') {
                    setTimeout(function () {
                        window[functionName](value)
                    }, 100)
                    window.finishAutoOpening = true
                }
            }
        }
    }
}