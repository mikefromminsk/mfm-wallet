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
        if (error)
            error()
        else
            showInfoDialog("You need to add " + domain.toUpperCase() + " token")
    })
}

function hasBalance(domain, success, error) {
    hasToken(domain, function (response) {
        if (response.balance == null || response.balance == 0) {
            if (error)
                error()
            else
                showInfoDialog("You need to buy " + domain.toUpperCase() + " token")
        } else {
            if (success)
                success()
        }
    })
}