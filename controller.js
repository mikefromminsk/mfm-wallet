function start($scope) {
    trackCall(arguments)

    document.title = window.location.hostname

    function setIcon() {
        let link = document.createElement('link')
        link.rel = 'icon'
        link.href = DEBUG ? 'logo-debug.png' : 'logo.png'
        document.head.appendChild(link)
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
        swipeToRefresh($scope.swipeToRefresh)
    }

    $scope.swipeToRefresh = function () {
        $scope.selectTab($scope.selectedIndex)
    }

    $scope.selectTab($scope.selectedIndex)

    if (window.location.search != "") {
        window.history.pushState({}, document.title, "/mfm-wallet")
    }

    if (window.Telegram != null) {
        setTimeout(function () {
            let userData = window.Telegram.WebApp.initDataUnsafe
            if (userData.user != null) {
                window.telegram_username = userData.user.username
                trackEvent("tg_referer", null, window.telegram_username)
            }
        })
    }

    window.addEventListener('popstate', () => {
        $scope.close()
    })

    connectWs(8800 + getPortOffset())
}

window.finishAutoOpening = false

function loaded() {
    if (!finishAutoOpening) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        for (const [key, value] of params) {
            if (key.startsWith('open')) {
                const functionName = key;
                if (typeof window[functionName] === 'function') {
                    window[functionName](value);
                    window.finishAutoOpening = true;
                }
            }
        }
    }
}