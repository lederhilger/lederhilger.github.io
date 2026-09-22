(() => {
    "use strict";
    const nav = document.querySelector('nav[aria-label="Primary navigation"]');
    if (!nav) return;

    function projectsURL(anchor) {
	try {
	    const url = new URL(anchor.href, location.href);
	    if (url.origin === location.origin && url.pathname === "/projects/") {
		return url;
	    }
	} catch {}
	return null;
    }

    const link = Array.from(nav.querySelectorAll("a[href]")).find(projectsURL);
    if (!link) return;

    const cell = 4;
    const ditherBand = 24;
    const duration = 1250;
    const bayer = [
	[0, 48, 12, 60, 3, 51, 15, 63],
	[32, 16, 44, 28, 35, 19, 47, 31],
	[8, 56, 4, 52, 11, 59, 7, 55],
	[40, 24, 36, 20, 43, 27, 39, 23],
	[2, 50, 14, 62, 1, 49, 13, 61],
	[34, 18, 46, 30, 33, 17, 45, 29],
	[10, 58, 6, 54, 9, 57, 5, 53],
	[42, 26, 38, 22, 41, 25, 37, 21]
    ];
    const visualViewport = window.visualViewport;
    let running = false;
    let canvas = null;
    let frameID = 0;
    let resizeHandler = null;

    function stopWatching() {
	if (!resizeHandler) return;
	window.removeEventListener("resize", resizeHandler);
	if (visualViewport) visualViewport.removeEventListener("resize", resizeHandler);
	resizeHandler = null;
    }

    function removeOverlay() {
	if (frameID) cancelAnimationFrame(frameID);
	frameID = 0;
	stopWatching();
	if (canvas) canvas.remove();
	canvas = null;
	running = false;
    }

    window.addEventListener("pageshow", (event) => {
	if (event.persisted) removeOverlay();
    });

    link.addEventListener("click", (event) => {
	if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute("download") || link.hasAttribute("target")) return;
	const destination = projectsURL(link);
	if (!destination || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	if (running) {
	    event.preventDefault();
	    return;
	}

	let context;
	let columns;
	let rows;
	let activated;

	function sizeCanvas() {
	    const width = Math.max(1, window.innerWidth);
	    const height = Math.max(1, window.innerHeight);
	    const ratio = Math.max(1, window.devicePixelRatio || 1);
	    canvas.style.width = `${width}px`;
	    canvas.style.height = `${height}px`;
	    canvas.width = Math.ceil(width * ratio);
	    canvas.height = Math.ceil(height * ratio);
	    context.setTransform(ratio, 0, 0, ratio, 0, 0);
	    context.imageSmoothingEnabled = false;
	    context.fillStyle = "#000000";
	    columns = Math.ceil(width / cell);
	    rows = Math.ceil(height / cell);
	    activated = new Uint8Array(rows * columns);
	}

	try {
	    canvas = document.createElement("canvas");
	    canvas.setAttribute("aria-hidden", "true");
	    canvas.style.cssText = `
		position: fixed;
		inset: 0;
		z-index: 9999;
		pointer-events: none;
		display: block;
	    `;
	    context = canvas.getContext("2d");
	    if (!context) throw new Error("2d canvas unavailable");
	    sizeCanvas();
	    document.body.appendChild(canvas);
	} catch {
	    removeOverlay();
	    return;
	}

	event.preventDefault();
	running = true;

	try {
	    const startedAt = performance.now();
	    function ditherThreshold(column, row) {
		let x = column % 8;
		let y = row % 8;
		const tileColumn = Math.floor(column / 8);
		const tileRow = Math.floor(row / 8);
		const variant = (tileColumn * 3 + tileRow * 5) % 8;
		if (variant >= 4) [x, y] = [y, x];
		if (variant % 2) x = 7 - x;
		if (variant % 4 >= 2) y = 7 - y;
		return bayer[y][x] / 63;
	    }

	    function activation(column, row) {
		const threshold = ditherThreshold(column, row);
		const contour = Math.sin((column + .5) / Math.E) * .55 + Math.sin((column + .5) / (2 * Math.PI * Math.E) + 1.618) * .35;
		return row + (threshold - .5) * ditherBand + contour;
	    }

	    function draw(progress) {
		const first = -ditherBand / 2 - 1;
		const last = rows + ditherBand / 2 - 1;
		const front = first + (last - first) * progress;
		for (let row = 0; row < rows; row += 1) {
		    for (let column = 0; column < columns; column += 1) {
			const index = row * columns + column;
			const boundary = activation(column, row);
			if (!activated[index] && boundary <= front) {
			    context.fillRect(column * cell, row * cell, cell, cell);
			    activated[index] = 1;
			}
		    }
		}
	    }

	    function progress() {
		return Math.min(1, Math.max(0, (performance.now() - startedAt) / duration));
	    }

	    function fail() {
		removeOverlay();
		location.assign(destination.href);
	    }

	    function frame() {
		try {
		    const current = progress();
		    draw(current);
		    if (current === 1) {
			context.fillRect(0, 0, columns * cell, rows * cell);
			stopWatching();
			frameID = 0;
			location.assign(destination.href);
		    } else {
			frameID = requestAnimationFrame(frame);
		    }
		} catch {
		    fail();
		}
	    }

	    resizeHandler = () => {
		try {
		    sizeCanvas();
		    draw(progress());
		} catch { fail(); }
	    };
	    window.addEventListener("resize", resizeHandler);
	    if (visualViewport) visualViewport.addEventListener("resize", resizeHandler);
	    draw(0);
	    frameID = requestAnimationFrame(frame);
	} catch {
	    removeOverlay();
	    location.assign(destination.href);
	}
    });
})();
