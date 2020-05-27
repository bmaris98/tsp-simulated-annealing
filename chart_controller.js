var chartContext;
var chart;
var chartingEnabled = true;

function load_default_chart() {
    if (!chartingEnabled) {
        if (chart) {
            chart.destroy();
        }
        return;
    }
    chartContext = document.getElementById('chart').getContext('2d');


    chart = new Chart(chartContext, {
        type: 'line',
        bezierCurve: false,
        data: {
            labels: [],
            datasets: [{
                borderColor: ["#050599"],
                label: "Total weight for given temperature",
                fill: false,
                data: []
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Weight of traversal'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature'
                    }
                }]
            }
        }
    });
}

function notifyChart(currentCost, temperature) {
    if (! chartingEnabled) {
        return;
    }
    chart.data.labels.push(temperature);
    chart.data.datasets[0].data.push(currentCost);
    chart.update();
}