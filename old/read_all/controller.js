function openMinerTestReadUsers() {
    showDialog("mining/read_all", null, function ($scope) {

        function loadTrans() {
            postContract("mfm-token", "trans", {
                address: wallet.MINER_ADDRESS,
                size: 100,
            }, function (response) {
                $scope.next_offset = response.next_offset
                $scope.trans = response.trans
                $scope.$apply()
            })
        }

        loadTrans()


        function loadMinerToggle(address) {
            postContract("mfm-miner", "toggle_domain", {
                address: address,
                domain: 'vavilon',
            }, function (response) {
            }, function (response) {
            })
        }

        function loadMinerAccount(address) {
            postContract("mfm-miner", "account", {
                address: address,
            }, function (response) {
                if (response.miner_account) {
                    $scope.minerAccounts.push(response.miner_account)
                    $scope.$apply()
                }
            }, function (response) {
            })
        }

        $scope.loadMinerAccountAndSend1 = function () {
            $scope.minerAccounts = []
            $scope.lastTrans = {}
            for (const tran of $scope.trans) {
                if (tran.to == wallet.MINER_ADDRESS && $scope.lastTrans[tran.from] == null) {
                    $scope.lastTrans[tran.from] = tran
                    //loadMinerToggle(tran.from)
                    loadMinerAccount(tran.from)
                }
            }
            $scope.apply()
        }
    })
}