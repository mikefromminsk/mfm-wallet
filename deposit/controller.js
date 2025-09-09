function openDeposit(address, success) {
    trackCall(arguments)
    showDialog("deposit", success, function ($scope) {
        $scope.domain = wallet.gas_domain
        $scope.network = "tron"

        postContract("mfm-tron", "deposit_address", {
            address: wallet.address()
        }, function (response) {
            $scope.deposit_address = response.deposit_address
            $scope.$apply()
            drawQr(response.deposit_address)
        })

        var qrcode = null
        function drawQr(text){
            if (qrcode == null){
                qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: text,
                    width: 128,
                    height: 128,
                    colorDark : "#1d2733",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                })
            } else {
                qrcode.makeCode(text)
            }
        }

        $scope.blockAddress = function () {
            $scope.startRequest()
            postContract("mfm-tron", "deposit_address_block", {
                address: wallet.address(),
                deposit_address: $scope.deposit_address
            }, function (response) {
                $scope.deposit_deadline = response.deposit_deadline
                $scope.copy($scope.deposit_address)
                $scope.check('copy_tron_address')
                $scope.finishRequest()
                $scope.$apply()
            }, function (message){
                $scope.finishRequest()
                if (message == "you block this address") {
                    $scope.copy($scope.deposit_address)
                }
            })
        }
    })
}