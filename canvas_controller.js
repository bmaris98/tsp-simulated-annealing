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
    //window.requestAnimationFrame(drawCanvas);
}

function drawLinesOnOverlay() {
    linesContext.clearRect(0, 0, w, h);
    linesContext.lineWidth = 1;
    linesContext.strokeStyle = "#335";
    linesContext.beginPath();
    linesContext.moveTo(p.data[0].x, p.data[0].y);
    p.data.forEach(element => {
        linesContext.lineTo(element.x, element.y);
        linesContext.moveTo(element.x, element.y);
    });
    linesContext.lineTo(p.data[0].x, p.data[0].y);
    linesContext.stroke();
}

drawCustom();
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
var config = { attributes: true, childList: true, subtree: true };
var callback = function (mutationsList, observer) {
    drawCanvas();
};
var observer = new MutationObserver(callback);
observer.observe(customNode, config);