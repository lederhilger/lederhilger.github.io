import {p2p, simple} from "./geometry.js";
import {buildBEs} from "./elements.js";
import {
    sampleGrid,
    rawVoronojCrossings,
    rawVoronojSegments
} from "./voronoj.js";
import {
    traceVoroedges,
    componentSegments
} from "./components.js";
import {medialAxis} from "./pruning.js";
import {
    drawPolygon,
    drawVertices,
    drawVoronoj,
    drawReflex
} from "./drawing.js";
import {
    polygon,
    copypoly,
} from "./shapes.js";
const canvas = document.querySelector("#delone-canvas");
const context = canvas.getContext("2d");

function recompute(points, spacing) {
    const elements = buildBEs(points);
    const grid = sampleGrid(points, elements, spacing);
    const crossings = rawVoronojCrossings(grid, elements);
    const segments = rawVoronojSegments(grid, crossings);
    const components = traceVoroedges(segments);
    const medial = medialAxis(components, elements, points, grid.spacing);
    return {elements, grid, crossings, segments, components, medial};
}

function drawScene(context, points, geometry, layers) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (layers.regions) {
	drawReflex(context, geometry.grid, geometry.elements);
    }
    if (layers.voronoj) {
	drawVoronoj(context, geometry.segments);
    }
    if (layers.medial) {
	drawVoronoj(context, componentSegments(geometry.medial.kept));
    }
    context.strokeStyle = "#0D0D0B";
    context.fillStyle = "#0D0D0B";
    drawPolygon(context, points);
    drawVertices(context, points);
}

const layers = {
    regions:false,
    voronoj:false,
    medial:false
};

document.querySelectorAll("#delone-controls input[data-layer]").forEach(input => {
    const layer = input.dataset.layer;
    input.checked = layers[layer];
    input.addEventListener("change", () => {
	layers[layer] = input.checked;
	drawScene(context, points, geometry, layers);
    });
});

let points = copypoly(polygon);

let spacing = 3;
let geometry = recompute(points, spacing);
drawScene(context, points, geometry, layers);

const spacingInput = document.querySelector("#delone-spacing");
spacingInput.addEventListener("input", () => {
    spacing = Number(spacingInput.value);
    geometry = recompute(points, spacing);
    drawScene(context, points, geometry, layers);
});

const resetButton = document.querySelector("#delone-reset");
resetButton.addEventListener("click", () => {
    points = copypoly(polygon);
    geometry = recompute(points, spacing);
    drawScene(context, points, geometry, layers);
});

function nearestVertexIndex(points, point, radius) {
    let nearestIndex = null;
    let nearestDistance = radius;
    for (let i = 0; i < points.length; i += 1) {
	const distance = p2p(points[i], point);
	if (distance <= nearestDistance) {
	    nearestIndex = i;
	    nearestDistance = distance;
	}
    }
    return nearestIndex;
}

function canvasPointFromEvent(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {x:event.clientX-rect.left, y:event.clientY-rect.top};
}

const drag = {activeIndex:null, pointerId:null};

canvas.addEventListener("pointerdown", event => {
    const point = canvasPointFromEvent(canvas, event);
    const index = nearestVertexIndex(points, point, 12);
    if (index === null) {
	return;
    }
    drag.activeIndex = index;
    drag.pointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
});

function restrict(point, canvas) {
    return {
	x:Math.max(0, Math.min(canvas.width, point.x)),
	y:Math.max(0, Math.min(canvas.height, point.y))
    };
}

canvas.addEventListener("pointermove", event => {
    if (drag.pointerId !== event.pointerId || drag.activeIndex === null) {
	return;
    }
    const point = restrict(canvasPointFromEvent(canvas, event), canvas);
    const candidate = points.map(point => ({x:point.x, y:point.y}));
    candidate[drag.activeIndex] = point;
    if (!simple(candidate)) {
	return;
    }
    points = candidate;
    geometry = recompute(points, spacing);
    drawScene(context, points, geometry, layers);
});

function stopDragging(event) {
    if (drag.pointerId !== event.pointerId) {
	return;
    }

    if (canvas.hasPointerCapture(event.pointerId)) {
	canvas.releasePointerCapture(event.pointerId);
    }
    
    drag.activeIndex = null;
    drag.pointerId = null;
}

canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);

