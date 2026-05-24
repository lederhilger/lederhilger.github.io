const ε = 1e-9;

function subtract(a, b) {
    return {x:a.x-b.x, y:a.y-b.y};
}

function wedge(a, b) {
    return a.x*b.y - a.y*b.x;
}

function orient(a, b, c){
    return wedge(subtract(b, a), subtract(c, a));
}

function length(vector) {
    return Math.hypot(vector.x, vector.y);
}

function normalize(vector) {
    const norm = length(vector);
    if (norm <= ε) {
	return {x:0, y:0};
    }
    return {x:vector.x/norm, y:vector.y/norm}
}

function signedArea(points) {
    let sum = 0;
    for (let i = 0; i < points.length; i += 1) {
	const j = (i+1)%points.length;
	const a = points[i];
	const b = points[j];
	sum += a.x*b.y - b.x*a.y;
    }
    return sum/2;
}

function isReflex(points, i) {
    const previous = points[(i-1+points.length)%points.length];
    const current = points[i];
    const next = points[(i+1)%points.length];
    const turn = orient(previous, current, next);
    return turn < 0;
}

function onSegment(point, a, b) {
    const collinear = Math.abs(orient(a, b, point)) <= ε;
    const insideX = Math.min(a.x, b.x) - ε <= point.x && point.x <= Math.max(a.x, b.x) + ε;
    const insideY = Math.min(a.y, b.y) - ε <= point.y && point.y <= Math.max(a.y, b.y) + ε;
    return collinear && insideX && insideY;
}

function segmentsIntersect(a, b, c, d) {
    const o1 = orient(a, b, c);
    const o2 = orient(a, b, d);
    const o3 = orient(c, d, a);
    const o4 = orient(c, d, b);
    const crossesProperly = ((o1 > ε && o2 < -ε) || (o1 < -ε && o2 > ε)) && ((o3 > ε && o4 < -ε) || (o3 < -ε && o4 > ε));
    if (crossesProperly) {
	return true;
    }
    return onSegment(c, a, b) || onSegment(d, a, b) || onSegment(a, c, d) || onSegment(b, c, d);
}

function edgesAreAdjacent(i, j, n) {
    return i===j || (i+1)%n===j || (j+1)%n===i;
}

function polygonIsSimple(points) {
    const n = points.length;
    for (let i = 0; i < n; i += 1) {
	const a = points[i];
	const b = points[(i+1)%n];
	for (let j = i+1; j < n; j += 1){
	    if (edgesAreAdjacent(i, j, n)) {
		continue;
	    }
	    const c = points[j];
	    const d = points[(j+1)%n];
	    if (segmentsIntersect(a, b, c, d)) {
		return false;
	    }
	}
    }
    return true;
}

function pointInTriangle(point, a, b, c) {
    const o1 = orient(a, b, point);
    const o2 = orient(b, c, point);
    const o3 = orient(c, a, point);
    const hasNegative = o1 < -ε || o2 < -ε || o3 < -ε;
    const hasPositive = o1 > ε || o2 > ε || o3 > ε;

    return !(hasNegative && hasPositive);
}

function pointInPolygon(point, points) {
    let inside = false;
    for (let i = 0; i < points.length; i += 1) {
	const a = points[i];
	const b = points[(i+1)%points.length];
	if (onSegment(point, a, b)) {
	    return "boundary";
	}
	const crossesRay = (a.y > point.y) !== (b.y > point.y);
	if (crossesRay) {
	    const xCrossing = a.x + (point.y - a.y)*(b.x - a.x)/(b.y - a.y);
	    if (point.x < xCrossing) {
		inside = !inside;
	    }
	}
    }
    return inside ? "inside" : "outside";
}

function drawPolygon(context, points) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
	context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
    context.stroke();
}

function labelPosition(points, i, distance) {
    const previous = points[(i-1+points.length)%points.length];
    const point = points[i];
    const next = points[(i+1)%points.length];
    const toPrevious = normalize(subtract(previous, point));
    const toNext = normalize(subtract(next, point));
    let direction = normalize({
	x:toPrevious.x + toNext.x,
	y:toPrevious.y + toNext.y
    });
    let label = {
	x:point.x + distance*direction.x,
	y:point.y + distance*direction.y
    };
    if (pointInPolygon(label, points) !== "outside") {
	label = {
	    x:point.x - distance*direction.x,
	    y:point.y - distance*direction.y
	};
    }
    return label
}

function drawVertices(context, points){
    for (let i = 0; i < points.length; i += 1) {
	const point = points[i];
	context.beginPath();
	context.arc(point.x, point.y, 4, 0, 2*Math.PI);
	context.fill();
	const label = labelPosition(points, i, 16);
	context.textAlign = label.x < point.x ? "right" : "left";
	context.textBaseline = label.y < point.y ? "bottom" : "top";
	context.fillText(i, label.x, label.y);
    }
}

const canvas = document.querySelector("#delone-canvas");
const context = canvas.getContext("2d");
context.strokeStyle = "#0d0d0b";
context.fillStyle = "#0d0d0b";

const polygon = [
    {x:90, y:243},
    {x:52, y:205},
    {x:66, y:131},
    {x:154, y:40},
    {x:242, y:73},
    {x:251, y:124},
    {x:417, y:168},
    {x:404, y:244},
    {x:341, y:300},
    {x:372, y:355},
    {x:180, y:438},
    {x:119, y:399},
    {x:119, y:338},
    {x:210, y:330},
    {x:209, y:262},
    {x:172, y:216}
];

drawPolygon(context, polygon);
drawVertices(context, polygon);

