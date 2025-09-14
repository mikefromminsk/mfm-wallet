let logoRefreshInterval = null

function openLogoChange(domain, success) {
    showDialog("launch/logo", function () {
        if (logoRefreshInterval != null)
            clearInterval(logoRefreshInterval)
    }, function ($scope) {
        $scope.domain = domain

        function generateApps(prefix, start, end, maxCount) {
            const apps = []
            const total = Math.min(end - start + 1, maxCount)
            const step = Math.floor((end - start + 1) / total)
            let count = 0
            for (let i = start; i <= end && count < total; i += step) {
                apps.push({
                    title: " ",
                    domain: prefix + i,
                    link: prefix + i
                })
                count++
            }
            return apps
        }

        $scope.apps = {
            "stones": generateApps("stone", 1, 20, 20),
            "minecraft": generateApps("logo", 1, 200, 20)
        }

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
                post("https://storage.vavilon.org/upload_file", {
                    filename: domain + ".png",
                    width: 64,
                    height: 64,
                    file: file,
                }, function () {
                    logoRefreshInterval = setInterval(function () {
                        $scope.logoLink = $scope.getLogoLink($scope.domain) + '?' + Math.random()
                        $scope.$apply()
                    }, 1000)
                    showSuccess(str.logo_uploaded)
                })
            }, ".png")
        }

        $scope.selectApp = function (logo) {
            postContract("mfm-storage", "copy", {
                from: logo + ".png",
                to: domain + ".png",
            }, function () {
                logoRefreshInterval = setInterval(function () {
                    $scope.logoLink = $scope.getLogoLink($scope.domain)
                    $scope.$apply()
                }, 1000)
                showSuccess(str.logo_uploaded)
            })
        }

        $scope.next = function () {
            $scope.close()
            $scope.openLaunchMining(domain, success)
        }
    })
}

function logoLoaded() {
    if (logoRefreshInterval != null)
        clearInterval(logoRefreshInterval)
}