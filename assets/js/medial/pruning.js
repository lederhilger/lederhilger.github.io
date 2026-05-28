import {p2s} from "./geometry.js";

function incidents(vertexIndex, vertexCount) {
    return [
	`e${(vertexIndex-1+vertexCount)%vertexCount}`,
	`e${vertexIndex}`
    ];
}

function componentNearPoint(component, point, radius) {
    return component.segments.some(segment =>
	p2s(point, segment.a, segment.b) <= radius
    );
}

function withered(component, reflexElement, points, spacing) {
    const ids = new Set(component.elementIds);
    if (!ids.has(reflexElement.id)) {
	return false;
    }
    const incidentIDs = incidents(reflexElement.vertexIndex, points.length);
    if (!incidentIDs.every(id => ids.has(id))) {
	return false;
    }
    return componentNearPoint(
	component,
	points[reflexElement.vertexIndex],
	spacing*3
    );
}

function medialAxis(components, elements, points, spacing) {
    const reflexElements = elements.filter(element => element.kind === "reflex");
    const kept = [];
    const removed = [];
    for (const component of components) {
	const shouldPrune = reflexElements.some(reflexElement => withered(component, reflexElement, points, spacing));
	if (shouldPrune) {
	    removed.push(component);
	} else {
	    kept.push(component);
	}
    }
    return {kept, removed};
}

export {
    medialAxis
};
