import {drawPolygon, drawVertices, drawVoronoj} from "./drawing.js";
import {sd7032, airfoil,airfoilSubset} from "./shapes.js";
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

const canvas = document.querySelector("#airfoil-canvas");
const context = canvas.getContext("2d");
const pointInput = document.querySelector("#airfoil-points");
const resolution = 1;

function drawAirfoil() {
    const count = Number(pointInput.value);
    const foilPoints = airfoilSubset(sd7032, count);
    const margin = 10;
    const chord = canvas.width - 2*margin;
    const yOffset = canvas.height/2;
    const points = airfoil(foilPoints, chord, margin, yOffset);
    const elements = buildBEs(points);
    const grid = sampleGrid(points, elements, resolution);
    const crossings = rawVoronojCrossings(grid, elements);
    const segments = rawVoronojSegments(grid, crossings);
    const components = traceVoroedges(segments);
    const medial = medialAxis(components, elements, points, grid.resolution);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#0D0D0B";
    context.fillStyle = "#0D0D0B";

    drawVoronoj(context, componentSegments(medial.kept));
    drawPolygon(context, points);
    drawVertices(context, points, {labels:false});
}

drawAirfoil();
pointInput.addEventListener("input", drawAirfoil);
