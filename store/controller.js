function addStore($scope) {
    $scope.apps = {
        "shops": [
            {
                title: "ShitShop",
                domain: "shit",
                link: function () {
                    openShitShop()
                }
            },
            {
                title: "GunsShop",
                domain: "ak74",
                link: function () {
                    openShopGuns(function (link) {
                        openRecipe(link)
                    })
                }
            }
        ],
        "games": [
            {
                title: "Shit",
                domain: "Shit",
                link: "/mfm-pigeon/"
            }
        ],
        "defi": [
            {
                title: "Mining",
                domain: "miner",
                link: function () {
                    $scope.openMiner(wallet.vavilon)
                }
            },
            {
                title: "Dividend",
                domain: wallet.vavilon,
                link: function () {
                    $scope.openDividend(wallet.vavilon)
                }
            },
            {
                title: "Explorer",
                domain: "explorer",
                link: "/mfm-landing/explorer/"
            },
            {
                title: "Launcher",
                domain: "Launcher",
                link: function () {
                    $scope.openLaunchToken()
                }
            }
        ],
        "docs": [
            {
                title: "Whitepaper",
                domain: "whitepaper",
                link: "/mfm-landing/docs/?doc=whitepaper.md"
            },
            {
                title: "Roadmap",
                domain: "roadmap",
                link: "/mfm-landing/docs/?doc=roadmap.md"
            },
            {
                title: "Terms",
                domain: "terms",
                link: "/mfm-landing/docs/?doc=terms.md"
            },
            {
                title: "Dev",
                domain: "dev",
                link: "/mfm-landing/docs/?doc=dev.md"
            }
        ]
    }

    $scope.selectApp = function (link) {
        if (link[0] == "/") {
            window.open(link, '_blank')
        }
        if (typeof link === "function") {
            link()
        }
    }
}