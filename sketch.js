let cartas = [];
let selecionadas = [];
let acertadas = 0;
let totalCartas = 16;
let colunas = 4;
let linhas = 4;
let larguraCarta = 70;
let alturaCarta = 90;
let espacoX = 20;
let espacoY = 20;
let icones = ["🏡", "🌽", "🚜", "🌆", "🌻", "🛣️", "🚧", "🛺"];
let offsetX, offsetY;

function setup() {
  createCanvas(400, 500);
  textFont('Arial');
  calcularOffset();
  iniciarJogo();
}

function calcularOffset() {
  offsetX = (width - (colunas * larguraCarta + (colunas - 1) * espacoX)) / 2;
  offsetY = (height - (linhas * alturaCarta + (linhas - 1) * espacoY)) / 2;
}

function iniciarJogo() {
  cartas = [];
  selecionadas = [];
  acertadas = 0;

  let valores = shuffle(icones.concat(icones));
  for (let i = 0; i < totalCartas; i++) {
    let col = i % colunas;
    let lin = floor(i / colunas);
    let x = offsetX + col * (larguraCarta + espacoX);
    let y = offsetY + lin * (alturaCarta + espacoY);
    cartas.push({
      valor: valores[i],
      x,
      y,
      revelada: false,
      acertada: false,
      anim: 0
    });
  }
}

function draw() {
  background(225, 245, 255);
  drawCartas();

  if (acertadas === totalCartas) {
    fill(0, 180);
    rect(0, height / 2 - 30, width, 60);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("🏁 Tudo certo! Pressione R para reiniciar", width / 2, height / 2);
  }
}

function drawCartas() {
  for (let carta of cartas) {
    let w = larguraCarta;
    let h = alturaCarta;
    let cx = carta.x + w / 2;
    let cy = carta.y + h / 2;

    push();
    translate(cx, cy);

    // Animação de flip
    if (carta.revelada || carta.acertada) {
      carta.anim = min(carta.anim + 0.1, 1);
    } else {
      carta.anim = max(carta.anim - 0.1, 0);
    }

    scale(cos(carta.anim * PI), 1);

    // Sombra leve
    noStroke();
    fill(0, 25);
    rectMode(CENTER);
    rect(5, 5, w, h, 10);

    // Frente ou verso
    stroke(80);
    strokeWeight(1.2);
    if (carta.anim > 0.5 || carta.acertada) {
      fill(255);
    } else {
      let grad = drawingContext.createLinearGradient(-w/2, -h/2, w/2, h/2);
      grad.addColorStop(0, "#A5D6A7");
      grad.addColorStop(1, "#90CAF9");
      drawingContext.fillStyle = grad;
    }

    rect(0, 0, w, h, 10);

    // Emoji
    if (carta.anim > 0.5 || carta.acertada) {
      fill(30);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(32);
      text(carta.valor, 0, 0);
    }

    pop();
  }
}

function mousePressed() {
  if (selecionadas.length < 2 && acertadas < totalCartas) {
    for (let carta of cartas) {
      if (
        !carta.revelada &&
        !carta.acertada &&
        mouseX > carta.x &&
        mouseX < carta.x + larguraCarta &&
        mouseY > carta.y &&
        mouseY < carta.y + alturaCarta
      ) {
        carta.revelada = true;
        selecionadas.push(carta);
        break;
      }
    }

    if (selecionadas.length === 2) {
      setTimeout(verificarPar, 700);
    }
  }
}

function verificarPar() {
  let [c1, c2] = selecionadas;
  if (c1.valor === c2.valor) {
    c1.acertada = true;
    c2.acertada = true;
    acertadas += 2;
  } else {
    c1.revelada = false;
    c2.revelada = false;
  }
  selecionadas = [];
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    iniciarJogo();
  }
}
