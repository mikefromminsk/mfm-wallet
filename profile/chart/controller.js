function getChartOptions() {
    return {
        layout: {
            background: {color: '#222'},
            textColor: '#DDD'
        },
        grid: {
            vertLines: {color: '#444'},
            horzLines: {color: '#444'}
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal
        },
        localization: {
            timeFormatter: (time) => {
                if (typeof time === 'number') {
                    let date = new Date(time * 1000);
                    return date.toLocaleTimeString([], {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        year: '2-digit'
                    });
                }
                return String(time);
            },
            priceFormatter: (price) => {
                if (price == null || isNaN(price)) return ''
                if (price >= 1) {
                    return price.toFixed(2)
                } else {
                    return price.toFixed(4)
                }
            }
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
    tradeChart.id = id + Math.floor(Math.random() * 10000)
    var chart = LightweightCharts.createChart(tradeChart, getChartOptions())
    chartResize(tradeChart, chart)
    return chart
}

function addChart($scope, app, key, accumulate_key) {
    function init() {
        setTimeout(function () {
            if ($scope.candleSeries == null) {
                let chart = createChart("chart")
                $scope.candleSeries = chart.addCandlestickSeries({
                    upColor: '#45be88',
                    downColor: '#FF3347',
                    borderUpColor: '#45be88',
                    borderDownColor: '#FF3347',
                    wickUpColor: '#45be88',
                    wickDownColor: '#FF3347'
                })
                $scope.accomulateSeries = chart.addHistogramSeries({
                    color: '#45be88',
                    priceFormat: {
                        type: 'volume'
                    },
                    priceScaleId: ''
                })
                $scope.accomulateSeries.priceScale().applyOptions({
                    scaleMargins: {
                        top: 0.9,
                        bottom: 0
                    }
                })
            }
            $scope.setPeriod($scope.period_name)
        }, !window.chartLoaded ? 300 : 0)
        window.chartLoaded = true
    }

    $scope.periods = ['M', 'H', 'D']
    $scope.period_name = window.storage ? window.storage.getString(storageKeys.chart_period, "D") : "D"
    $scope.setPeriod = function (period_name) {
        $scope.period_name = period_name
        if (window.storage)
            window.storage.setString(storageKeys.chart_period, period_name)
        postContract("mfm-chart", "chart", {
            app: app,
            key: key,
            accumulate_key: accumulate_key,
            period_name: period_name
        }, function (response) {
            if (response.candles != null) {
                $scope.candleSeries.setData(response.candles)
                for (const volume of response.accumulate) {
                    for (const candle of response.candles) {
                        if (candle.time == volume.time) {
                            if (candle.open > candle.close)
                                volume.color = "#FF3347"
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

function openChartWithAccumulate(app, key, accumulate_key, success) {
    showBottomSheet("profile/chart", success, function ($scope) {
        $scope.app = app
        $scope.key = key
        $scope.accumulate_key = accumulate_key
    }, function ($scope) {
        addChart($scope, $scope.app, $scope.key, $scope.accumulate_key)
    })
}