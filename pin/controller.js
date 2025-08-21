function getPin(success, cancel) {
    if (cancel == null && storage.getString(storageKeys.hasPin) == "") {
        if (success)
            success()
    } else {
        if (cancel == null && window.pinForSesstion) {
            success(window.pinForSesstion)
        } else {
            clearFocus()
            showBottomSheet("pin", function (result) {
                if (result == null) {
                    if (cancel)
                        cancel()
                } else {
                    if (success)
                        success(result)
                }
            }, function ($scope) {
                $scope.pincode = ""
                $scope.setMode = cancel != null

                $scope.add = function (symbol) {
                    $scope.pincode += symbol
                    if ($scope.pincode.length == 4) {
                        window.$mdBottomSheet.hide($scope.pincode)
                    }
                }

                $scope.remove = function () {
                    if ($scope.pincode.length > 0)
                        $scope.pincode = $scope.pincode.substring(0, $scope.pincode.length - 1);
                }
            })
        }
    }
}