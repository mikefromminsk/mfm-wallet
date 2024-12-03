let logoRefreshInterval = null

function openLogoChange(domain, success) {
    showDialog('/mfm-wallet/wallet/launch/logo/index.html', function () {
        if (logoRefreshInterval != null)
            clearInterval(logoRefreshInterval)
        if (success)
            success()
    }, function ($scope) {
        $scope.domain = domain

        function selectFile(success, accept) {
            let input = document.createElement('input')
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
                    width: 64,
                    height: 64,
                    file: file,
                }, function () {
                    logoRefreshInterval = setInterval(function () {
                        $scope.logoLink = $scope.getLogoLink($scope.domain) + '?' + randomString(4)
                        $scope.$apply()
                    }, 1000)
                    showSuccess(str.logo_uploaded)
                })
            }, ".png")
        }

        $scope.logos = []
        for (let i = 0; i < 20; i++) {
            let randomIndex = Math.floor(Math.random() * 199) + 1;
            let logoName = 'logo' + randomIndex
            if ($scope.logos.indexOf(logoName) == -1)
                $scope.logos.push(logoName)
        }

        $scope.copyLogo = function (logo) {
            post("https://storage.mytoken.space/copy_file.php", {
                from: logo + ".png",
                to: domain + ".png",
            }, function () {
                logoRefreshInterval = setInterval(function () {
                    $scope.logoLink = $scope.getLogoLink($scope.domain) + '?' + randomString(4)
                    $scope.$apply()
                }, 1000)
                showSuccess(str.logo_uploaded)
            })
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

function logoLoaded() {
    if (logoRefreshInterval != null)
        clearInterval(logoRefreshInterval)
}