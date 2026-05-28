import {ε, p2e, pinpoly} from "./geometry.js";
import {elementMap, nearestElement} from "./elements.js";

function sampleGrid(points, elements, resolution) {
    const xs = points.map(point => point.x);
    const ys = points.map(point => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const originX = minX;
    const originY = minY;
    const cols = Math.floor((maxX - minX)/resolution)+1;
    const rows = Math.floor((maxY - minY)/resolution)+1;
    const samples = [];
    for (let row = 0; row < rows; row += 1) {
	for (let col = 0; col < cols; col += 1) {
	    const point = {
		x: originX + col*resolution, y: originY + row*resolution
	    };
	    const relation = pinpoly(point, points);
	    const inside = relation === "inside";
	    if (!inside) {
		samples.push({
		    ...point,
		    row:row,
		    col:col,
		    relation:relation,
		    inside:false,
		    nearestId:null,
		    distance:null,
		    malcolmIDs:[]
		});
		continue
	    }
	    samples.push({
		...point,
		row:row,
		col:col,
		relation:relation,
		inside:true,
		...nearestElement(point, elements)
	    });
	}
    }
    return {
	originX:originX,
	originY:originY,
	resolution:resolution,
	cols:cols,
	rows:rows,
	samples:samples
    };
}

function sampleAt(grid, row, col) {
    if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) {
	return null;
    }
    return grid.samples[row*grid.cols + col];
}

function nearestElementIDs(sample) {
    if (sample === null || !sample.inside) {
	return [];
    }
    return sample.malcolmIDs;
}

function uniquesort(ids) {
    return [...new Set(ids)].sort();
}

function twins(a, b) {
    if (a.length !== b.length) {
	return false;
    }
    return a.every((id, i) => id === b[i]);
}

function crossKey(row, col, side) {
    return `${row}:${col}:${side}`;
}

function rawVoronojCrossings(grid, elements) {
    const crossings = [];
    const elementID = elementMap(elements);
    for (let row = 0; row < grid.rows; row += 1) {
	for (let col = 0; col < grid.cols; col += 1) {
	    const sample = sampleAt(grid, row, col)
	    if (sample === null || !sample.inside) {
		continue;
	    }
	    const neighbors = [
		{sample:sampleAt(grid,row,col+1), side:"right"},
		{sample:sampleAt(grid,row+1,col), side:"bottom"}
	    ];
	    for (const entry of neighbors) {
		const neighbor = entry.sample;
		if (neighbor === null || !neighbor.inside) {
		    continue;
		}
		const idsA = nearestElementIDs(sample);
		const idsB = nearestElementIDs(neighbor);
		if (twins(idsA, idsB)) {
		    continue;
		}
		let point = {
		    x:(sample.x+neighbor.x)/2, y:(sample.y+neighbor.y)/2
		};
		const elementIds = uniquesort([...idsA, ...idsB]);
		if (elementIds.length === 2) {
		    point = estimateMalcolm(
			sample, neighbor,
			elementID.get(elementIds[0]),
			elementID.get(elementIds[1])
		    );
		}
		crossings.push({
		    a:sample,
		    b:neighbor,
		    row,
		    col,
		    side:entry.side,
		    point,
		    elementIds
		});
	    }
	}
    }
    return crossings;
}

function rawVoronojSegments(grid, crossings) {
    const crossingByKey = new Map();
    for (const crossing of crossings) {
	crossingByKey.set(crossKey(crossing.row, crossing.col, crossing.side), crossing);
    }
    const segments = [];
    for (let row = 0; row < grid.rows-1; row += 1) {
	for (let col = 0; col < grid.cols-1; col += 1) {
	    const cellCrossings = [
		crossingByKey.get(crossKey(row,col,"right")),
		crossingByKey.get(crossKey(row,col,"bottom")),
		crossingByKey.get(crossKey(row+1,col,"right")),
		crossingByKey.get(crossKey(row,col+1,"bottom"))
	    ].filter(crossing => crossing !== undefined);
	    if (cellCrossings.length !== 2) {
		continue;
	    }
	    const ids = uniquesort([
		...cellCrossings[0].elementIds,
		...cellCrossings[1].elementIds
	    ]);
	    segments.push({
		a:cellCrossings[0].point,
		b:cellCrossings[1].point,
		elementIds:ids
	    });
	}
    }
    return segments;
}



function interpolate(a, b, t) {
    return {x: a.x + (b.x - a.x)*t, y: a.y + (b.y - a.y)* t};
}

function distanceDifference(point, elementA, elementB) {
    return p2e(point, elementA) - p2e(point, elementB);
}

function estimateMalcolm(a, b, elementA, elementB) {
    let low = 0;
    let high = 1;
    let fLow = distanceDifference(a, elementA, elementB);
    let fHigh = distanceDifference(b, elementA, elementB);
    if (Math.abs(fLow) <= ε) {
	return {x:a.x, y:a.y};
    }
    if (Math.abs(fHigh) <= ε) {
	return {x:b.x, y:b.y};
    }
    if (fLow*fHigh > 0){
	return interpolate(a, b, 0.5);
    }
    for (let i = 0; i < 16; i += 1) {
	const mid = (low+high)/2;
	const point = interpolate(a,b,mid);
	const fMid = distanceDifference(point, elementA, elementB);
	if (Math.abs(fMid) <= ε) {
	    return point;
	}
	if (fLow*fMid <= 0) {
	    high = mid;
	    fHigh = fMid;
	} else {
	    low = mid;
	    fLow = fMid;
	}
    }
    return interpolate(a, b, (low+high)/2);
}

export {
    sampleGrid,
    rawVoronojCrossings,
    rawVoronojSegments,
    uniquesort
};
