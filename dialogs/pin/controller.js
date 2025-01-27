function getPin(success, cancel) {
    if (cancel == null && storage.getString(storageKeys.hasPin) == "") {
        if (success)
            success()
    } else {
        showBottomSheet("dialogs/pin", function (result) {
            if (result == null)
                cancel()
            else
                success(result)
        }, function ($scope) {
            $scope.pin = ""
            $scope.setMode = cancel != null

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