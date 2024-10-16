function openAppSettings(domain, success) {
    showDialog('/mfm-wallet/store/settings/index.html', success, function ($scope) {
            addFormats($scope)

            $scope.title = ""
            $scope.hide_in_store = false
            $scope.domain = domain

            $scope.save = function () {
                postContractWithGas("wallet", "store/api/info_update.php", {
                    domain: $scope.domain,
                    title: $scope.title,
                    hide_in_store: $scope.hide_in_store ? 1 : 0,
                }, function () {
                    showSuccess("Updated success", success)
                }, function (message) {
                    showError(message)
                })
            }

            $scope.uploadArchive = function () {
                selectFile(function (file) {
                    postContractWithGas("wallet", "store/api/upload.php", {
                        domain: $scope.domain,
                        file: file,
                    }, function () {
                        showSuccess("Archive uploaded successfully")
                    })
                }, ".zip")
            }

            $scope.uploadLogo = function () {
                selectFile(function (file) {
                    var zip = new JSZip();
                    zip.file("logo.svg", file);
                    zip.generateAsync({type: "blob"}).then(function (content) {
                        postContract("mfm-wallet", "store/api/upload.php", {
                            domain: domain,
                            file: content,
                        }, function () {
                            showSuccess("Logo uploaded successfully")
                        })
                    });
                }, ".svg")
            }

            $scope.archive = function () {
                postContractWithGas("wallet", "store/api/archive.php", {
                    domain: $scope.domain,
                }, function () {
                    showSuccess("Archived successfully")
                })
            }

            function init() {
                getProfile(domain, function (response) {
                    $scope.title = response.title
                    $scope.hide_in_store = response.hide_in_store
                    $scope.$apply()
                })
            }

            init()
    })
}