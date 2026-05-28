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

const state = {
    points:copypoly(polygon),
    resolution:3,
    geometry:null,
    layers: {
	regions:false,
	voronoj:false,
	medial:false
    },
    drag: {
	activeIndex:null,
	pointerId:null
    }
}

function recompute(points, resolution) {
    const elements = buildBEs(points);
    const grid = sampleGrid(points, elements, resolution);
    const crossings = rawVoronojCrossings(grid, elements);
    const segments = rawVoronojSegments(grid, crossings);
    const components = traceVoroedges(segments);
    const medial = medialAxis(components, elements, points, grid.resolution);
    return {elements, grid, crossings, segments, components, medial};
}

function drawScene() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (state.layers.regions) {
	drawReflex(context, state.geometry.grid, state.geometry.elements);
    }
    if (state.layers.voronoj) {
	drawVoronoj(context, state.geometry.segments);
    }
    if (state.layers.medial) {
	drawVoronoj(context, componentSegments(state.geometry.medial.kept));
    }
    context.strokeStyle = "#0D0D0B";
    context.fillStyle = "#0D0D0B";
    drawPolygon(context, state.points);
    drawVertices(context, state.points);
}

function recomputeRedraw() {
    state.geometry = recompute(state.points, state.resolution);
    drawScene();
}

document.querySelectorAll("#delone-controls input[data-layer]").forEach(input => {
    const layer = input.dataset.layer;
    input.checked = state.layers[layer];
    input.addEventListener("change", () => {
	state.layers[layer] = input.checked;
	drawScene();
    });
});

const resolutionInput = document.querySelector("#delone-resolution");
resolutionInput.addEventListener("input", () => {
    state.resolution = Number(resolutionInput.value);
    recomputeRedraw();
});

const resetButton = document.querySelector("#delone-reset");
resetButton.addEventListener("click", () => {
    state.points = copypoly(polygon);
    recomputeRedraw();
});

recomputeRedraw();

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

canvas.addEventListener("pointerdown", event => {
    const point = canvasPointFromEvent(canvas, event);
    const index = nearestVertexIndex(state.points, point, 12);
    if (index === null) {
	return;
    }
    state.drag.activeIndex = index;
    state.drag.pointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
});

function restrict(point, canvas) {
    return {
	x:Math.max(0, Math.min(canvas.width, point.x)),
	y:Math.max(0, Math.min(canvas.height, point.y))
    };
}

canvas.addEventListener("pointermove", event => {
    if (state.drag.pointerId !== event.pointerId || state.drag.activeIndex === null) {
	return;
    }
    const point = restrict(canvasPointFromEvent(canvas, event), canvas);
    const candidate = state.points.map(point => ({x:point.x, y:point.y}));
    candidate[state.drag.activeIndex] = point;
    if (!simple(candidate)) {
	return;
    }
    state.points = candidate;
    recomputeRedraw();
});

function stopDragging(event) {
    if (state.drag.pointerId !== event.pointerId) {
	return;
    }

    if (canvas.hasPointerCapture(event.pointerId)) {
	canvas.releasePointerCapture(event.pointerId);
    }
    
    state.drag.activeIndex = null;
    state.drag.pointerId = null;
}

canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);

