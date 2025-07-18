function getChartOptions() {
    return {
        layout: {
            background: {color: '#222'},
            textColor: '#DDD',
        },
        grid: {
            vertLines: {color: '#444'},
            horzLines: {color: '#444'},
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        }
    }
}

function chartResize(tradeChart, chart) {
    new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== tradeChart) return
        const newRect = entries[0].contentRect
        chart.applyOptions({height: newRect.height, width: newRect.width})
    }).observe(tradeChart)
}

function createChart(id) {
    var tradeChart = document.getElementById(id)
    tradeChart.id = id + randomString(2)
    var chart = LightweightCharts.createChart(tradeChart, getChartOptions())
    chartResize(tradeChart, chart)
    return chart
}

function addChart($scope, key, accumulate_key) {
    function init() {
        setTimeout(function () {
            if ($scope.candleSeries == null) {
                let chart = createChart("chart")
                $scope.candleSeries = chart.addCandlestickSeries({
                    upColor: '#45be88', // Цвет свечей, когда цена растет
                    downColor: '#FF3347', // Цвет свечей, когда цена падает
                    borderUpColor: '#45be88', // Цвет границ свечей, когда цена растет
                    borderDownColor: '#FF3347', // Цвет границ свечей, когда цена падает
                    wickUpColor: '#45be88', // Цвет фитиля свечей, когда цена растет
                    wickDownColor: '#FF3347' // Цвет фитиля свечей, когда цена падает
                })
                $scope.accomulateSeries = chart.addHistogramSeries({
                    color: '#45be88',
                    priceFormat: {
                        type: 'volume',
                    },
                    priceScaleId: '',
                })
                $scope.accomulateSeries.priceScale().applyOptions({
                    scaleMargins: {
                        top: 0.9,
                        bottom: 0,
                    },
                })
            }
            $scope.setPeriod($scope.period_name)
        }, !window.chartLoaded ? 300 : 0)
        window.chartLoaded = true
    }

    $scope.periods = ['M', 'D']
    $scope.period_name = 'D'
    $scope.setPeriod = function (period_name) {
        $scope.period_name = period_name
        postContract("mfm-analytics", "candles", {
            key: key,
            accumulate_key: accumulate_key,
            period_name: period_name,
        }, function (response) {
            if (response.candles != null) {
                $scope.candleSeries.setData(response.candles)
                for (const volume of response.accumulate) {
                    for (const candle of response.candles) {
                        if (candle.time == volume.time) {
                            if (candle.open > candle.close)
                                volume.color = "#FF3347";
                            break
                        }
                    }
                }
                $scope.accomulateSeries.setData(response.accumulate)
                $scope.showNoData = false
            } else {
                $scope.showNoData = true
            }
        })
    }

    $scope.updateChart = function () {
        $scope.setPeriod($scope.period_name)
    }

    init()
}

function openChartWithAccumulate(key, accumulate_key, success) {
    showBottomSheet("wallet/profile/chart", success, function ($scope) {
        $scope.key = key
        $scope.accumulate_key = accumulate_key
        addChart($scope, key, accumulate_key)
    })
}