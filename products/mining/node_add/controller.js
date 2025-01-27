function openNodeAdd(success) {
    trackCall(arguments)
    showDialog("products/mining/node_add", success, function ($scope) {

        if (DEBUG){
            $scope.ip = "12.12.12.12"
        }

        $scope.nodeAdd = function () {
            $scope.startRequest()
            postContractWithGas("mfm-mining", "node_add", {
                ip: $scope.ip,
            }, function () {
                showSuccessDialog(str.success, $scope.close)
            }, $scope.finishRequest)
        }

        $scope.validateIp = function () {
            if ($scope.ip == null) return false
            let ip = $scope.ip.split(".")
            if (ip.length !== 4) return false
            for (let i = 0; i < 4; i++) {
                if (ip[i] == null || ip[i] == "" || ip[i] < 0 || ip[i] > 255) {
                    return false
                }
            }
            return true
        }
    })
}