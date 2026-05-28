import {uniquesort} from "./voronoj.js";

function pointKey(point) {
    return `${Math.round(point.x*1000)}:${Math.round(point.y*1000)}`;
}

function addVoronode(nodeByKey, point) {
    const key = pointKey(point);
    if (!nodeByKey.has(key)) {
	nodeByKey.set(key, {
	    key,
	    point:{x:point.x, y:point.y},
	    edgeIndices:[]
	});
    }
    return nodeByKey.get(key);
}

function buildVorograph(segments) {
    const node = new Map();
    const edges = [];
    for (let i = 0; i < segments.length; i += 1) {
	const segment = segments[i];
	const aNode = addVoronode(node, segment.a);
	const bNode = addVoronode(node, segment.b);
	const edge = {
	    index:i,
	    aKey:aNode.key,
	    bKey:bNode.key,
	    segment
	};
	edges.push(edge);
	aNode.edgeIndices.push(i);
	bNode.edgeIndices.push(i);
    }
    return {node, edges}
}

function voronodeKey(edge, key) {
    return edge.aKey === key ? edge.bKey:edge.aKey;
}

function walkVoroedge(startEdgeIndex, startKey, graph, used) {
    const edgeIndices = [];
    let edgeIndex = startEdgeIndex;
    let currentKey = startKey;
    while (edgeIndex !== undefined && !used.has(edgeIndex)) {
	const edge = graph.edges[edgeIndex];
	used.add(edgeIndex);
	edgeIndices.push(edgeIndex);
	const nextKey = voronodeKey(edge, currentKey);
	const nextNode = graph.node.get(nextKey);
	if (nextNode.edgeIndices.length !== 2) {
	    break;
	}
	const nextEdgeIndex = nextNode.edgeIndices.find(index => index !== edgeIndex && !used.has(index));
	currentKey = nextKey;
	edgeIndex = nextEdgeIndex;
    }
    return edgeIndices;
}

function buildVoroedge(edgeIndices, graph) {
    const componentIndexSet = new Set(edgeIndices);
    const segments = edgeIndices.map(index => graph.edges[index].segment);
    const nodeKeys = new Set();
    const elementIds = [];
    for (const edgeIndex of edgeIndices) {
	const edge = graph.edges[edgeIndex];
	nodeKeys.add(edge.aKey);
	nodeKeys.add(edge.bKey);
	elementIds.push(...edge.segment.elementIds);
    }
    const endpoints = [];
    for (const key of nodeKeys) {
	const node = graph.node.get(key);
	const degree = node.edgeIndices.filter(index => componentIndexSet.has(index)).length;
	if (degree !== 2) {
	    endpoints.push(node.point);
	}
    }
    return {
	segments,
	elementIds:uniquesort(elementIds),
	endpoints
    };
}

function traceVoroedges(segments) {
    const graph = buildVorograph(segments);
    const used = new Set();
    const components = [];
    for (const edge of graph.edges) {
	if (used.has(edge.index)) {
	    continue;
	}
	const aDegree = graph.node.get(edge.aKey).edgeIndices.length;
	const bDegree = graph.node.get(edge.bKey).edgeIndices.length;
	if (aDegree === 2 && bDegree === 2) {
	    continue;
	}
	const startKey = aDegree !== 2 ? edge.aKey:edge.bKey;
	const edgeIndices = walkVoroedge(edge.index, startKey, graph, used);
	components.push(buildVoroedge(edgeIndices, graph));
    }
    for (const edge of graph.edges) {
	if (!used.has(edge.index)) {
	    const edgeIndices = walkVoroedge(edge.index, edge.aKey, graph, used);
	    components.push(buildVoroedge(edgeIndices, graph));
	}
    }
    return components;
}

function componentSegments(components) {
    return components.flatMap(components => components.segments);
}

export {
    traceVoroedges,
    componentSegments
};
