function getPin(success, cancel) {
    if (DEBUG){
        success("2222")
    } else if (cancel == null && storage.getString(storageKeys.hasPin) == "") {
        // No pin
        if (success)
            success()
    } else {
        if (window.pinForSesstion != null) {
            if (success)
                success(window.pinForSesstion)
        } else {
            showBottomSheet("/mfm-wallet/dialogs/pin/index.html", function (result) {
                window.pinForSesstion = result
                if (success)
                    success(result)
            }, function ($scope) {
                $scope.pin = ""

                $scope.add = function (symbol) {
                    $scope.pin += symbol
                    if ($scope.pin.length == 4) {
                        $scope.back($scope.pin)
                    }
                }

                $scope.remove = function () {
                    if ($scope.pin.length > 0)
                        $scope.pin = $scope.pin.substring(0, $scope.pin.length - 1);
                }
            })
        }
    }
}