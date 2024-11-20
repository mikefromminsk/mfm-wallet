function openLogoChange(domain, success) {
    let interval = null
    showDialog('/mfm-wallet/wallet/launch/logo/index.html', function () {
        if (interval != null)
            clearInterval(interval)
        if (success)
            success()
    }, function ($scope) {
        $scope.DEBUG = DEBUG
        $scope.domain = domain

        function selectFile(success, accept) {
            var input = document.createElement('input')
            input.type = 'file'
            input.accept = accept || "*/*"
            input.onchange = e => {
                if (success != null)
                    success(e.target.files[0])
            }
            input.click()
        }

        $scope.logoLink = ""
        $scope.uploadLogo = function () {
            selectFile(function (file) {
                post("https://storage.mytoken.space/upload_file.php", {
                    filename: domain + ".png",
                    file: file,
                }, function () {
                    interval = setInterval(function () {
                        $scope.logoLink = $scope.getLogoLink($scope.domain) + '?' + randomString(4)
                        $scope.$apply()
                    }, 1000)
                    showSuccess("Logo uploaded successfully")
                })
            }, ".png")
        }

        $scope.next = function () {
            $scope.close()
        }

        function init() {
            getProfile(domain, function (response) {
                $scope.profile = response
                $scope.$apply()
            })
        }

        init()
    })
}