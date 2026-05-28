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

const sd7032 = [
    {x:1.000000, y:0.000000},
    {x:0.996740, y:0.000480},
    {x:0.987120, y:0.002040},
    {x:0.971550, y:0.004850},
    {x:0.950540, y:0.008940},
    {x:0.924640, y:0.014199},
    {x:0.894360, y:0.020409},
    {x:0.860210, y:0.027309},
    {x:0.822640, y:0.034599},
    {x:0.782080, y:0.041988},
    {x:0.738920, y:0.049248},
    {x:0.693560, y:0.056198},
    {x:0.646460, y:0.062698},
    {x:0.598120, y:0.068607},
    {x:0.549020, y:0.073807},
    {x:0.499670, y:0.078157},
    {x:0.450580, y:0.081537},
    {x:0.402220, y:0.083847},
    {x:0.355060, y:0.084997},
    {x:0.309530, y:0.084927},
    {x:0.266040, y:0.083587},
    {x:0.224990, y:0.080957},
    {x:0.186710, y:0.077027},
    {x:0.151460, y:0.071817},
    {x:0.119480, y:0.065478},
    {x:0.091050, y:0.058088},
    {x:0.066270, y:0.049758},
    {x:0.045240, y:0.040778},
    {x:0.028120, y:0.031449},
    {x:0.015020, y:0.022059},
    {x:0.006060, y:0.012929},
    {x:0.001150, y:0.004480},
    {x:0.000380, y:-0.002230},
    {x:0.005320, y:-0.007010},
    {x:0.016490, y:-0.010880},
    {x:0.033080, y:-0.014029},
    {x:0.054910, y:-0.016349},
    {x:0.081800, y:-0.017869},
    {x:0.113510, y:-0.018619},
    {x:0.149740, y:-0.018669},
    {x:0.190100, y:-0.018099},
    {x:0.234200, y:-0.016989},
    {x:0.281530, y:-0.015470},
    {x:0.331540, y:-0.013629},
    {x:0.383640, y:-0.011520},
    {x:0.437240, y:-0.009220},
    {x:0.491760, y:-0.006780},
    {x:0.546590, y:-0.004300},
    {x:0.601120, y:-0.001900},
    {x:0.654690, y:0.000300},
    {x:0.706640, y:0.002240},
    {x:0.756340, y:0.003790},
    {x:0.803130, y:0.004850},
    {x:0.846350, y:0.005350},
    {x:0.885340, y:0.005260},
    {x:0.919420, y:0.004580},
    {x:0.947970, y:0.003500},
    {x:0.970540, y:0.002260},
    {x:0.986840, y:0.001130},
    {x:0.996700, y:0.000300}
];

function copypoly(points) {
    return points.map(point => ({x:point.x, y:point.y}));
}

function airfoil(points, chord=380, xOffset=40, yOffset=80) {
    return points.map(point => ({
	x:xOffset+chord*point.x,
	y:yOffset-chord*point.y
    }));
}

function sampleList(points, count) {
    if (count >= points.length) {
	return copypoly(points);
    }
    const selected = [];
    for (let i = 0; i < count; i += 1) {
  	const index = Math.round(i*(points.length - 1)/(count - 1));
	selected.push({x:points[index].x, y:points[index].y});
    }
    return selected;
}

function airfoilSubset(points, count) {
    const leadingIndex = points.reduce((bestIndex, point, index) =>
	point.x < points[bestIndex].x ? index : bestIndex
    , 0);
    const trailing = points[0];
    const leading = points[leadingIndex];
    const suction = points.slice(1, leadingIndex);
    const pressure = points.slice(leadingIndex + 1);
    const sideCount = (count - 2)/2;
    return [
	{x:trailing.x, y:trailing.y},
	...sampleList(suction, sideCount),
	{x:leading.x, y:leading.y},
	...sampleList(pressure, sideCount)
    ];
}


export {
    polygon,
    sd7032,
    airfoil,
    airfoilSubset,
    copypoly
}
