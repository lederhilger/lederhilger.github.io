import {normalize, pinpoly, subtract} from "./geometry.js";
import {elementMap} from "./elements.js";

function drawPolygon(context, points) {
    context.lineWidth = 2;
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
    if (pinpoly(label, points) !== "outside") {
	label = {
	    x:point.x - distance*direction.x,
	    y:point.y - distance*direction.y
	};
    }
    return label
}

function drawVertices(context, points, options = {}){
    const labels = options.labels ?? true;
    for (let i = 0; i < points.length; i += 1) {
	const point = points[i];
	context.beginPath();
	context.arc(point.x, point.y, 2, 0, 2*Math.PI);
	context.fill();
	if (!labels) {
	    continue;
	}
	const label = labelPosition(points, i, 16);
	context.textAlign = label.x < point.x ? "right" : "left";
	context.textBaseline = label.y < point.y ? "bottom" : "top";
	context.fillText(i, label.x, label.y);
    }
}

function drawVoronoj(context, segments) {
    context.strokeStyle = "#0D0D0B";
    context.lineWidth = 1;
    for (const segment of segments) {
	context.beginPath();
	context.moveTo(segment.a.x, segment.a.y);
	context.lineTo(segment.b.x, segment.b.y);
	context.stroke();
    }
}

function coloroj(sample, elementID) {
    for (const id of sample.malcolmIDs) {
	const element = elementID.get(id);
	if (element?.kind === "reflex") {
	    return "#F2DCB3";
	}
    }
    return "#BFA380";
}

function drawReflex(context, grid, elements) {
    const elementID = elementMap(elements);
    for (const sample of grid.samples) {
	if (!sample.inside) {
	    continue;
	}
	context.fillStyle = coloroj(sample, elementID);
	context.fillRect(
	    sample.x - grid.resolution/2,
	    sample.y - grid.resolution/2,
	    grid.resolution,
	    grid.resolution
	);
    }
}

export {
    drawPolygon,
    drawVertices,
    drawVoronoj,
    drawReflex
};
