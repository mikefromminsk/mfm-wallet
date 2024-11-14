function openTokenSettings(domain, success) {
    showDialog('/mfm-wallet/token/logo/index.html', success, function ($scope) {
        $scope.DEBUG = DEBUG

        $scope.domain = domain

        $scope.getLogoOrGen = function () {
            if ($scope.logo == null)
                return "https://storage.mytoken.space/" + domain + ".png"
            let canvas = document.createElement("canvas")
            canvas.width = 32
            canvas.height = 32
            drawLogo(canvas.getContext("2d"), $scope.logo)
            return canvas.toDataURL()
        }

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

        $scope.uploadLogo = function () {
            selectFile(function (file) {
                post("https://storage.mytoken.space/upload_file.php", {
                    filename: domain + ".png",
                    file: file,
                }, function () {
                    showSuccess("Logo uploaded successfully", function () {
                        $scope.close("success")
                    })
                })
            }, ".png")
        }

        $scope.generate = async function () {
            function getHash(t) {
                let e = (new TextEncoder).encode(t);
                return window.crypto.subtle.digest("SHA-1", e)
            }

            function hexString(t) {
                return [...new Uint8Array(t)].map(t => t.toString(16).padStart(2, "0")).join("")
            }

            $scope.logo = hexString(await getHash(randomString(4)))
            $scope.$apply()
        }

        function drawLogo(context, logo) {
            function getColor(t) {
                return "#" + t.slice(-6)
            }

            let wh = 32
            let wh5 = wh / 5
            context.clearRect(0, 0, wh, wh);
            let o = getColor(logo);
            for (let t = 0; t < 5; t++)
                for (let n = 0; n < 5; n++) {
                    context.fillStyle = "transparent"
                    context.moveTo(t + wh5 * n, wh5 * (n + 1))
                    parseInt(logo.charAt(3 * t + (n > 2 ? 4 - n : n)), 16) % 2 && (context.fillStyle = o)
                    context.fillRect(wh5 * n, wh5 * t, wh5, wh5)
                    context.stroke()
                }
            return context
        }

        function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[arr.length - 1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type: mime});
        }

        $scope.saveLogo = function () {
            if ($scope.logo != null) {
                post("https://storage.mytoken.space/upload_file.php", {
                    filename: domain + ".png",
                    file: dataURLtoFile($scope.getLogoOrGen(), "logo.png"),
                }, function () {
                    showSuccess("Logo uploaded successfully", function () {
                        $scope.close("success")
                    })
                })
            } else {
                $scope.close("success")
            }
        }

        function init() {
            getProfile(domain, function (response) {
                $scope.profile = response
                $scope.$apply()
            })
        }

        window.imgError = function () {
            $scope.generate()
        }

        init()
    })
}