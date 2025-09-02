function openGunsShop(success) {
    trackCall(arguments)
    showDialog("store/shit", success, function ($scope) {
        $scope.title = "ShitShop"
        $scope.apps = {
            "assault_rifles": [
                {"domain": "ak74", "price": 2500},
                {"domain": "ak74_black", "price": 2500},
                {"domain": "m16", "price": 3100},
                {"domain": "famas", "price": 2250},
                {"domain": "galil", "price": 2000},
                {"domain": "scar", "price": 2750}
            ],
            "sniper_rifles": [
                {"domain": "awp", "price": 4750},
                {"domain": "awp_black", "price": 4750},
                {"domain": "svd", "price": 4300}
            ],
            "smgs": [
                {"domain": "bizon", "price": 1400},
                {"domain": "mp5", "price": 1500},
                {"domain": "p90", "price": 2350},
                {"domain": "ump45", "price": 1700},
                {"domain": "uzi", "price": 1200}
            ],
            "pistols": [
                {"domain": "beretta", "price": 500},
                {"domain": "deagle", "price": 650},
                {"domain": "revolver", "price": 700},
                {"domain": "ruger", "price": 550},
                {"domain": "magnum", "price": 600}
            ],
            "shotguns": [
                {"domain": "xm1014", "price": 2200}
            ],
            "heavy_weapons": [
                {"domain": "minigun", "price": 5000},
                {"domain": "rpg", "price": 850},
                {"domain": "granate_launcher", "price": 1200}
            ],
            "melee": [
                {"domain": "axe", "price": 800},
                {"domain": "knife", "price": 50},
                {"domain": "sword", "price": 950}
            ],
            "grenades": [
                {"domain": "flash", "price": 200},
                {"domain": "granate", "price": 300},
                {"domain": "smoke", "price": 300}
            ],
            "specials": [
                {"domain": "arbalet", "price": 4750},
                {"domain": "iron_ingot", "price": 850},
                {"domain": "laser", "price": 1250},
                {"domain": "rifle", "price": 3500},
                {"domain": "zeus", "price": 200}
            ]
        }

        $scope.selectApp = function (link) {
            if (link[0] == "/") {
                window.open(link, '_blank');
            } else if (typeof link === "function") {
                link()
            } else {
                postContract("mfm-token", "profile", {
                    domain: link
                }, function (response) {
                    if (response.supply.delegate?.startsWith("mfm-contract/craft")) {
                        openRecipe(link)
                    } else {
                        openProfile(link)
                    }
                })
            }
        }
    })
}