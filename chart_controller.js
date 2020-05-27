var chartContext;
var chart;

function load_default_chart() {
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
    chart.data.labels.push(temperature);
    chart.data.datasets[0].data.push(currentCost);
    chart.update();
}