$('#temp').val(100);
$('#retention').val(0.9);

var stop;
var distanceMatrix;
var currentSolution;
var iterationCount = 0;
var temperature = $('#temp').val();
var relativeTemperatureRetention = $('#retention').val();
var interval = null;

/**
 * Generate initial order [0, 1, ..., len - 1]
 */
function getInitialSolution() {
    return [...Array(distanceMatrix.length).keys()]
}

/**
 * Get cost for traversal.
 * @param {Array[int]} list 
 */
function computeCost(list) {
    var sum = 0;
    for(var i = 1; i < list.length; i++) {
        sum += distanceMatrix[list[i-1]][list[i]];
    }
    sum += distanceMatrix[list[0]][list[list.length - 1]];
    return sum;
}

/**
 * (Re)Initialize report infrastructure and loop the annealing operation
 * until stop flag is set to logical (coercion) true.
 */
function optimize() {
    currentSolution = getInitialSolution();
    notifyOverlayCanvas(currentSolution);
    iterationCount = 0;
    interval = setInterval(anneal, 10);
}

/**
 * Anneal function, swaps to edges if solution is better or acceptance is true.
 * Logs changes into the report infrastructure.
 * 
 * Acceptance rate and tolerance to cost increases drops with the temperature (drops in time; per iteration).
 */
function anneal() {
    let currentCost = computeCost(currentSolution);
    let candidate = swapRandom(currentSolution.slice());
    let candidateCost = computeCost(candidate);
    
    let delta = candidateCost - currentCost;
    let acceptDecrease = acceptance(delta);
    if (delta < 0 || (acceptDecrease && delta !== 0)) {
        currentSolution = candidate;
        currentCost = candidateCost;
    }
    
    // update user interface, by no means vital to the algorithm
    notifyOverlayCanvas(currentSolution);
    notifyChart(currentCost, temperature)

    temperature *= relativeTemperatureRetention;
}

/**
 * Swaps to elements of a list (never swaps first element).
 * @param {Array[any]} list 
 */
function swapRandom(list) {
    let index1 = getRandomIntegerInInterval(0, list.length);
    let index2 = getRandomIntegerInInterval(0, list.length);
    let aux = list[index1];
    list[index1] = list[index2]
    list[index2] = aux;
    return list;
}

/**
 * Generated a random integer in the interval [min, max).
 * @param {int} min 
 * @param {int} max 
 */
function getRandomIntegerInInterval(min, max) {
    var rnd = Math.random() * (max - min) + min;
    return Math.floor(rnd);
}

/**
 * Computes the acceptance based on the delta and the current pseudo-temperature.
 * @param {float} delta 
 */
function acceptance(delta) {
    var rnd = Math.random();
    var annealingCoeff = Math.exp(-delta/temperature);
    return rnd <= annealingCoeff;
}