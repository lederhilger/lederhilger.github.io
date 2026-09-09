const nomens = [
    "Σιμων Ανδρειδης",
    "𐍃𐌴𐌹𐌼𐍉𐌽 𐍆𐌹𐌻𐌻𐌰𐌷𐌿𐌻𐍅𐌾𐌰",
    "莱德希尔格西蒙",
    "Симонъ Андрѣевичъ",
    "레더힐거 시몬"
];
const nomen = nomens[Math.floor(Math.random()*nomens.length)];
document.getElementById("site-title").textContent = nomen;
