const nomens = [
    "Σιμων Ανδρειδης",
    "𐍃𐌴𐌹𐌼𐍉𐌽 𐍆𐌹𐌻𐌻𐌴𐌹𐌽𐌰𐌷𐌹𐌻𐌳𐌹𐌲𐌰𐌹𐍃",
    "莱德希尔格西蒙",
    "Симонъ Андрѣевичъ",
    "시몬 레더힐거"
];
const nomen = nomens[Math.floor(Math.random()*nomens.length)];
document.getElementById("site-title").textContent = nomen;
