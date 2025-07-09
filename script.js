// Elementos
const canvas = document.getElementById("pintar");
const ctx = canvas.getContext("2d");
let currentTool = "pin";
let drawing = false;
let startX = 0;
let startY = 0;
let currentColor = "#000000";
let strokeWidth = 2;

// === EVENTOS DE BOTONES ===

// Selección de herramienta
document.querySelectorAll(".toolbar button").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id === "limpiar") return; // no es herramienta
        if (btn.classList.contains("color")) return; // no es herramienta
        currentTool = btn.id;
        setActiveButton(btn);
    });
});

// Selección de color
document.querySelectorAll(".color").forEach(btn => {
    btn.addEventListener("click", () => {
        currentColor = btn.getAttribute("data-color");
        setActiveColor(btn);
    });
});

// Botón limpiar
document.getElementById("limpiar").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Botón guardar
document.getElementById("guardar").addEventListener("click", () => {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Fondo blanco
    tempCtx.fillStyle = "#ffffff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Dibujo encima
    tempCtx.drawImage(canvas, 0, 0);

    const imageURI = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURI;
    link.download = "mi_dibujo.png";
    link.click();
});

// === FUNCIONES AUXILIARES ===

// Activar visualmente el botón de herramienta
function setActiveButton(activeBtn) {
    document.querySelectorAll(".toolbar button").forEach(btn => {
        if (!btn.classList.contains("color")) {
            btn.classList.remove("active");
        }
    });
    activeBtn.classList.add("active");
}

// Activar visualmente el color
function setActiveColor(activeColor) {
    document.querySelectorAll(".color").forEach(btn => btn.classList.remove("active"));
    activeColor.classList.add("active");
}

// === EVENTOS DEL CANVAS ===

canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;

    if (currentTool === "pin" || currentTool === "bor") {
        drawDot(startX, startY);
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    if (currentTool === "pin") {
        drawLine(startX, startY, x, y, currentColor, 2);
        startX = x;
        startY = y;
    } else if (currentTool === "bor") {
        drawLine(startX, startY, x, y, "#ffffff", 20);
        startX = x;
        startY = y;
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (!drawing) return;
    drawing = false;

    const endX = e.offsetX;
    const endY = e.offsetY;

    if (currentTool === "lin") {
        drawLine(startX, startY, endX, endY, currentColor, 2);
    } else if (currentTool === "rect") {
        drawRect(startX, startY, endX - startX, endY - startY, currentColor, 2);
    } else if (currentTool === "cir") {
        drawCircle(startX, startY, endX, endY, currentColor, 2);
    }
});

// === FUNCIONES DE DIBUJO ===

function drawLine(x1, y1, x2, y2, color, width) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawRect(x, y, w, h, color, width) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.rect(x, y, w, h);
    ctx.stroke();
}

function drawCircle(x1, y1, x2, y2, color, width) {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.arc(x1, y1, radius, 0, Math.PI * 2);
    ctx.stroke();
}

function drawDot(x, y) {
    drawLine(x, y, x + 1, y + 1, currentColor, 2);
}
