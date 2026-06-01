function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) {
	return rgb;
    }
    return "#" + match.slice(0, 3).map(value => {
	return Number(value).toString(16).padStart(2, "0");
    }).join("").toUpperCase();
}
function switchSwatch() {
    document.querySelectorAll(".palette-row span").forEach(swatch => {
	const color = getComputedStyle(swatch).backgroundColor;
	swatch.title = rgbToHex(color);
    });
}
switchSwatch();
window.addEventListener("themechange", switchSwatch);
