function showInfoDialog(message, success) {
    showBottomSheet('/mfm-wallet/dialogs/info/index.html', success, function ($scope) {
        $scope.message = message
    })
}

function hasToken(domain, success, error) {
    postContract("mfm-token", "account.php", {
        domain: domain,
        address: wallet.address(),
    }, function (response) {
        if (success)
            success(response)
    }, function () {
        showInfoDialog("You need to add " + domain.toUpperCase() + " token", error)
    })
}

function hasBalance(domain, success, error) {
    hasToken(domain, function (response) {
        if (response.amount == null || response.amount == 0) {
            showInfoDialog("You need to buy " + domain.toUpperCase() + " token", error)
        } else {
            if (success)
                success()
        }
    })
}