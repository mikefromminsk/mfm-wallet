function openDeposit(address, success) {
    trackCall(arguments)
    showDialog("deposit", success, function ($scope) {
        $scope.domain = wallet.gas_domain
        $scope.network = "tron"

        postContract("mfm-tron", "deposit_address", {
            address: wallet.address(),
        }, function (response) {
            $scope.deposit_address = response.deposit_address
            $scope.$apply()
            drawQr(response.deposit_address)
        })

        var qrcode = null;
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
    })
}