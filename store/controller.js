function openStore($scope) {

    $scope.apps = {}

    function addApp(categoryName, domain, backgroundColor, link){
        let category = $scope.apps[categoryName] || []
        category.push({
            domain: domain,
            link: link,
            backgroundColor: backgroundColor,
        })
        $scope.apps[categoryName] = category
    }

    addApp("exchange", "CexExchange", "#8646f5", "/mfm-exchange")
    addApp("exchange", "DexExchange", "#46aef5", "#openPool=vavilon")
    addApp("exchange", "P2P", "#46aef5", "#openPool=vavilon")

    addApp("bridges", "TronUsdt", "#46aef5", "/mfm-explorer")

    addApp("defi", "Miner", "#46aef5", "#openMining=vavilon")
    addApp("defi", "Staking", "#46aef5", "/mfm-explorer")
    addApp("defi", "Credits", "#46aef5", "/mfm-explorer")
    addApp("defi", "Airdrop", "#46aef5", "/mfm-explorer")

    addApp("utilities", "Explorer", "#46aef5", "/mfm-explorer")
    addApp("utilities", "Launcher", "#46aef5", "#openLaunchToken")
    addApp("utilities", "Analytics", "#46aef5", "#openAnalytics")
    addApp("utilities", "Storage", "#46aef5", "#openAnalytics")

    addApp("games", "ShitBomb", "#46aef5", "/mfm-pigeon")
    addApp("games", "Quizes", "#46aef5", "/mfm-pigeon")

    addApp("dialects", "Gopnics", "#46aef5", "/mfm-pigeon")

    addApp("docs", "Whitepaper", "#46aef5", "/mfm-pigeon")
    addApp("docs", "Roadmap", "#46aef5", "/mfm-pigeon")
    addApp("docs", "Terms", "#46aef5", "/mfm-pigeon")
    addApp("docs", "Dev", "#46aef5", "/mfm-pigeon")
    addApp("docs", "Dev", "#46aef5", "/mfm-pigeon")

    $scope.openApp = function (link) {
        window.open(link, '_blank');
    }
}