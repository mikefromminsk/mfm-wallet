function openWeb(link, success) {
    showBottomSheet('/mfm-wallet/dialogs/web/index.html', success, function ($scope) {
            addFormats($scope)
            setTimeout(function () {
                document.getElementById('web-frame').src = link
            }, 1)
    })
}