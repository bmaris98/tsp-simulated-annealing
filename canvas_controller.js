var w = document.getElementById("canvas").getBoundingClientRect().width, h = 400,
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

var linesCanvas = document.getElementById("lines-canvas");
var linesContext = linesCanvas.getContext("2d");

d3.select(canvas).attr("width", w).attr("height", h);
d3.select(linesCanvas).attr("width", w).attr("height", h);

function getRandomInInterval(min, max) {
    return Math.random() * (max - min) + min;
}

function genCircles (n) {
    if (!n) { n = 10; }
    return d3.range(n)
        .map(function (d, i) {
            return {
                x: getRandomInInterval(10, w - 10),
                y: getRandomInInterval(10, h - 10),
                r: 5
            };
        });
}

var customNode = document.createElement("custom:cc"),
    dataContainer = d3.select(customNode),
    p = {
        num: 10,
        data: genCircles(this.num)
    };

var slider = document.getElementById("myRange");
slider.oninput = function() {
    stop();
    linesContext.clearRect(0, 0, w, h);
    p.data = genCircles(slider.value);
    drawCustom();
}

function drawCustom () {
    var u = dataContainer.selectAll("c").data(p.data);
    u.enter()
    .append("c")
    .attr("r", d => d.r)
    .attr("x", Math.random() * w)
    .attr("y", Math.random() * h)
    .merge(u)
    .transition()
    .duration(2000)
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("r", d => d.r);
    
    u.exit().transition()
    .duration(2000)
    .attr("r", 0)
    .remove();
}

function drawCanvas () {
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#335";
    ctx.beginPath();
    dataContainer.selectAll("c").each(function (d) {
        var x = +this.getAttribute("x"),
            y = +this.getAttribute("y"),
            r = +this.getAttribute("r");
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
    });
    ctx.stroke();
    ctx.restore();
}

drawCustom();
var config = { attributes: true, childList: true, subtree: true };
var callback = function (mutationsList, observer) {
    drawCanvas();
};
var observer = new MutationObserver(callback);
observer.observe(customNode, config);

function computeDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

function getDistanceMatrix() {
    var data = p.data;
    var distanceMatrix = [];
    for (var i = 0; i < data.length; i++) {
        var distancesForCurrent = [];
        for(var j = 0; j < data.length; j++) {
            distancesForCurrent.push(computeDistance(data[i], data[j]));
        }
        distanceMatrix.push(distancesForCurrent);
    }
    return distanceMatrix;
}

function initializeOverlayCanvas() {
    linesContext.clearRect(0, 0, w, h);
}

function notifyOverlayCanvas(sol, is_better=true) {
    linesContext.clearRect(0, 0, w, h);
    linesContext.lineWidth = 1;
    linesContext.strokeStyle = "#335";
    if (!is_better) {
        linesContext.strokeStyle = "#b33";
    }
    linesContext.beginPath();
    if (! p.data[sol[0]]) {
        return;
    }
    linesContext.moveTo(p.data[sol[0]].x, p.data[sol[0]].y);
    sol.forEach(element => {
        if (! p.data[element]) {
            return;
        }
        linesContext.lineTo(p.data[element].x, p.data[element].y);
        linesContext.moveTo(p.data[element].x, p.data[element].y);
    });
    linesContext.lineTo(p.data[sol[0]].x, p.data[sol[0]].y);
    linesContext.stroke();
}

function start() {
    stop();
    chartingEnabled = $("#enable-charting").is(":checked");
    load_default_chart();
    temperature = $('#temp').val();
    relativeTemperatureRetention = $('#retention').val();
    distanceMatrix = getDistanceMatrix();
    optimize();
}

function stop() {
    if (interval) {
        clearInterval(interval);
    }
}