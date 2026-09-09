const nox = document.querySelector(".vesper");
function vesper() {
    const dark = document.documentElement.dataset.theme === "dark";
    nox.textContent = dark ? "LUX" : "NOX";
    nox.setAttribute("aria-pressed", String(dark));
}
nox.addEventListener("click", ()=> {
    const dark = document.documentElement.dataset.theme === "dark";
    if (dark) {
	document.documentElement.removeAttribute("data-theme");
	localStorage.setItem("theme", "light");
    } else {
	document.documentElement.dataset.theme = "dark";
	localStorage.setItem("theme", "dark");
    }
    vesper();
    window.dispatchEvent(new Event("themechange"));
});
vesper()
