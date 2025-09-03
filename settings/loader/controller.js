function openLoader(success) {
    trackCall(arguments)
    showDialog("settings/loader", success, function ($scope) {
        $scope.json_text = "[\n" +
            "    {\n" +
            "        \"path\": \"/mfm-token/send\",\n" +
            "        \"domain\": \"ak74\",\n" +
            "        \"to\": \"V46MuUa95z6N3ZLtKY59r44VaTfJh\",\n" +
            "        \"amount\": \"1000000\",\n" +
            "        \"delegate\": \"mfm-contract/craft?domain\u003dak74\u0026coin\u003d2500\",\n" +
            "        \"pass\": \":a48b7fea0746fbf457ae1ac95a7a24b6ad676c99478f2f1236980f10526454c1\"\n" +
            "    }]";

        $scope.send = function () {
            getPin(function (pin) {
                $scope.startRequest()
                $scope.error_count = 0
                $scope.success_count = 0
                let obj = JSON.parse($scope.json_text)
                for (let params of obj) {
                    post(params.path, params, function () {
                        $scope.success_count += 1
                        if ($scope.error_count + $scope.success_count == obj.length) {
                            $scope.finishRequest()
                        }
                    }, function () {
                        $scope.error_count += 1
                        if ($scope.error_count + $scope.success_count == obj.length) {
                            $scope.finishRequest()
                        }
                    })
                }
            })
        }
    })
}