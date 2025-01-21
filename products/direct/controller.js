function openDirect(domain, success) {
    trackCall(arguments)
    showDialog("products/direct", success, function ($scope) {
        $scope.domain = domain

        $scope.menu = ["history", "offers", "profile"]
        $scope.selectedIndex = 1
        $scope.selectTab = function (tab) {
            $scope.selectedIndex = tab
            if (tab == 0) {
                openMyOrders($scope, domain)
            } else if (tab == 1) {
                openAllOrders($scope, domain)
            } else if (tab == 2) {
                addDirectProfile($scope, wallet.address())
            }
            swipeToRefresh($scope.swipeToRefresh)
        }

        $scope.selectTab($scope.selectedIndex)
    })
}

function openAllOrders($scope, domain, success) {
    $scope.orders = []
    $scope.sell = []
    $scope.buy = []
    $scope.is_sell = true

    $scope.setIsSell = function (is_sell) {
        $scope.is_sell = is_sell
        $scope.orders = is_sell ? $scope.buy : $scope.sell
    }

    $scope.loadOrderbook = function () {
        postContract("mfm-direct", "orderbook", {
            domain: domain,
        }, function (response) {
            $scope.sell = (response.sell || []).reverse()
            $scope.buy = response.buy
            $scope.setIsSell($scope.is_sell)
            $scope.$apply()
        })
    }

    $scope.swipeToRefresh = function () {
        $scope.loadOrderbook()
    }

    $scope.swipeToRefresh()
}

function openMyOrders($scope) {

    $scope.orderMenu = ["offers", "active", "finish", "cancel", "appeal"]
    $scope.orderMenuSelected = "active"
    $scope.selectOrderMenu = function (menu) {
        $scope.orderMenuSelected = menu
    }

    $scope.orders = {}

    $scope.loadOrders = function () {
        postContract("mfm-direct", "orders", {
            address: wallet.address(),
        }, function (response) {
            $scope.orders.offers = response.offers
            $scope.orders.active = response.active
            $scope.orders.finish = response.finish
            $scope.orders.cancel = response.cancel
            $scope.orders.appeal = response.appeal
            $scope.$apply()
        })
    }

    $scope.swipeToRefresh = function () {
        $scope.loadOrders()
    }
    $scope.loadOrders()
}

function openDirectProfile(address, success) {
    trackCall(arguments)
    showDialog("products/direct/profile", success, function ($scope) {
        addDirectProfile($scope, address)
    })
}

function addDirectProfile($scope, address) {
    $scope.swipeToRefresh = function () {
        postContract("mfm-direct", "profile", {
            address: address,
        }, function (response) {
            $scope.profile = response.profile
            $scope.$apply()
        })
    }

    $scope.swipeToRefresh()
}