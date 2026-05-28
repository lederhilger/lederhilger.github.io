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

function reflex(points, i, polygonIsCounterclockwise) {
    const previous = points[(i-1+points.length)%points.length];
    const current = points[i];
    const next = points[(i+1)%points.length];
    const turn = orient(previous, current, next);
    return polygonIsCounterclockwise ? turn < -ε : turn > ε;
}

function unit(t) {
    return Math.max(0, Math.min(1, t));
}

function p2s(point, a, b) {
    const ab = subtract(b,a);
    const ap = subtract(point, a);
    const denominator= ab.x*ab.x + ab.y*ab.y;
    if (denominator <= ε) {
	return Math.hypot(point.x - a.x, point.y - a.y);
    }
    const t = unit((ap.x*ab.x + ap.y*ab.y)/denominator);
    const closest = {
	x: a.x + t*ab.x, y: a.y + t*ab.y
    };
    return Math.hypot(point.x - closest.x, point.y - closest.y);
}

function p2e(point, element) {
    if (element.kind === "edge") {
	return p2s(point, element.a, element.b);
    }
    return Math.hypot(point.x - element.p.x, point.y - element.p.y);
}

function p2p(a, b) {
    return Math.hypot(a.x-b.x, a.y-b.y);
}

function onSegment(point, a, b) {
    const collinear = Math.abs(orient(a, b, point)) <= ε;
    const insideX = Math.min(a.x, b.x) - ε <= point.x && point.x <= Math.max(a.x, b.x) + ε;
    const insideY = Math.min(a.y, b.y) - ε <= point.y && point.y <= Math.max(a.y, b.y) + ε;
    return collinear && insideX && insideY;
}

function intersection(a, b, c, d) {
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

function edgeAdjacency(i, j, n) {
    return i===j || (i+1)%n===j || (j+1)%n===i;
}

function simple(points) {
    const n = points.length;
    for (let i = 0; i < n; i += 1) {
	const a = points[i];
	const b = points[(i+1)%n];
	for (let j = i+1; j < n; j += 1){
	    if (edgeAdjacency(i, j, n)) {
		continue;
	    }
	    const c = points[j];
	    const d = points[(j+1)%n];
	    if (intersection(a, b, c, d)) {
		return false;
	    }
	}
    }
    return true;
}

function pinpoly(point, points) {
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

export {
    ε,
    subtract,
    normalize,
    signedArea,
    reflex,
    p2s,
    p2e,
    p2p,
    simple,
    pinpoly
};
