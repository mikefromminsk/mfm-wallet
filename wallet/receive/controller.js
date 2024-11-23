function openReceive(success) {
    trackCall(arguments)
    showBottomSheet('/mfm-wallet/wallet/receive/index.html', success, function ($scope) {
    })
}