function addStore($scope) {

    $scope.apps = {
        "shops": [{
            title: "ShitShop",
            domain: "shit",
            link: function () {
                openShitShop()
            }
        },{
            title: "GunsShop",
            domain: "ak74",
            link: function () {
                openShopGuns()
            }
        }],
        "games": [{
            title: "Shit",
            domain: "Shit",
            link: "/mfm-pigeon/"
        }],
        "defi": [{
            title: str.mining,
            domain: "miner",
            link: function () {
                $scope.openMiner(wallet.vavilon)
            }
        }, {
            domain: wallet.vavilon,
            link: function () {
                $scope.openDividend(wallet.vavilon)
            }
        }],
        "utilities": [{
            title: "Explorer",
            domain: "explorer",
            link: "/mfm-explorer/"
        }, {
            title: "Launcher",
            domain: "Launcher",
            link: function () {
                $scope.openLaunchToken()
            }
        }],
        "docs": [{
            title: "Whitepaper",
            domain: "whitepaper",
            link: "/mfm-docs/?doc=whitepaper"
        }, {
            title: "Roadmap",
            domain: "roadmap",
            link: "/mfm-docs/?doc=roadmap"
        }, {
            title: "Terms",
            domain: "terms",
            link: "/mfm-docs/?doc=terms"
        }, {
            title: "Dev",
            domain: "dev",
            link: "/mfm-docs/?doc=dev"
        }]

        /* add("defi", "Airdrop", "#46aef5", "#openAirdrop")*/
        /*add("defi", "Staking", "#46aef5", "/mfm-explorer")*/

        /*    add("utilities", "Analytics", "#46aef5", "#openAnalytics")*/
        /*add("utilities", "Storage", "#46aef5", "#openAnalytics")*/

        /*    add("games", "Quizes", "#46aef5", "/mfm-pigeon")*/
    }

    /*add("exchange", "Cex", "#8646f5", "/mfm-exchange")
       add("exchange", "Dex", "#46aef5", "#openPool=vavilon")
       add("exchange", "P2P", "#46aef5", "#openPool=vavilon")*/

    /*add("bridges", "USDT", "#46aef5", function () {
        $scope.openDeposit()
    })*/
    $scope.selectApp = function (link) {
        if (link[0] == "/") {
            window.open(link, '_blank');
        }
        if (typeof link === "function") {
            link()
        }
    }
}