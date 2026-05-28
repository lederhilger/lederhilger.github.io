import {ε, p2e, reflex, signedArea} from "./geometry.js";

function buildBEs(points) {
    const polygonIsCounterclockwise = signedArea(points) > 0;
    const elements = [];
    for (let i = 0; i < points.length; i += 1) {
	const j = (i+1)%points.length;
	elements.push({
	    id: `e${i}`,
	    kind: "edge",
	    startIndex: i,
	    endIndex: j,
	    a: points[i],
	    b: points[j]
	});
    }
    for (let i = 0; i < points.length; i += 1) {
	if (reflex(points, i, polygonIsCounterclockwise)) {
	    elements.push({
		id: `r${i}`,
		kind: "reflex",
		vertexIndex: i,
		p: points[i]
	    });
	}
    }
    return elements;
}

function elementMap(elements) {
    const map = new Map();
    for (const element of elements) {
	map.set(element.id, element);
    }
    return map;
}

function nearestElement(point, elements) {
    let best = null;
    let malcolm = [];
    for (const element of elements) {
	const distance = p2e(point, element);
	if (best === null || distance < best.distance - ε) {
	    best = {nearestId:element.id, distance:distance};
	    malcolm = [element.id];
	    continue;
	}
	if (Math.abs(distance - best.distance) <= ε) {
	    malcolm.push(element.id);
	    malcolm.sort();
	    best.nearestId = malcolm[0];
	}
    }
    return {
	nearestId: best.nearestId, distance: best.distance, malcolmIDs: malcolm
    }
}

export {
    buildBEs,
    elementMap,
    nearestElement
};
