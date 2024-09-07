let robot;
let blocos;
let isDrawing = false;
let tela_width = 1440;
let tela_height = 900;
habilitarMov = false;
let bau;

function preload() {
    robotImage = loadImage('images/robo.png');
    bau = loadImage('images/bau.png');
}

function setup() {
    let cnv = createCanvas(tela_width, tela_height);
    cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    window.onresize = () => {
        cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    };

    robot = new Robot(575, 25, 75);
    blocos = new blocoManager();
    blocos.addbloco(20, 30, 150, 80, "Forward");
    blocos.addbloco(210, 30, 150, 80, "Rot 90h");
    blocos.addbloco(20, 130, 150, 80, "Rot 90ah");

    blocos.concluirInicializacao();
}

function draw() {
    background(200);
    drawGrid();
    robot.display();
    image(bau, 1025, 485, 75, 70);
    blocos.displayblocos();
    displayUI();

    if (isDrawing) {
        blocos.previewbloco(mouseX, mouseY);
    }

    if (robot.isMoving) {
        robot.move();
    }

}

function keyPressed() {
    robot.KeyPress();
    if (keyCode === ESCAPE) {
        isDrawing = false;
    }
}

function mouseClicked() {
    ButtonClicks(); //verifica que botão foi clicado
}

function mousePressed() {
    isDrawing = blocos.Arrastar(mouseX, mouseY); //retorna valor booleano para determinar criação de bloco provisorio;
}

function mouseReleased() {
    if (isDrawing) {
        blocos.addblocoAtPosition(mouseX, mouseY);
        isDrawing = false;
    }
}

function displayUI() {
    textSize(20);
    text(`x: ${mouseX}, y: ${mouseY}`, 800, 20);
    text(`isDrawing: ${isDrawing}`, 10, 20);
    text(`tam: ${robot.targetPosition}`, 300, 150);
    text(`move: ${robot.isMoving}`, 300, 200);

    strokeWeight(3);
    line(0, 225, 539, 225);
    strokeWeight(2);

    drawButton(350, 830, 100, 50, "Executar");
    drawButton(50, 830, 100, 50, "Limpar");
}

function ButtonClicks() {
    //verifica se o click foi dentro do botão limpar
    if (isClickInside(50, 830, 100, 50)) {
        blocos.clear();
        blocoPadrao();
    }
    //verifica se o click foi dentro do botão executar
    if (isClickInside(350, 830, 100, 50)) {
        habilitarMovimento();
    }
}

function blocoPadrao(){
    blocos.addbloco(20, 30, 150, 80, "Forward");
    blocos.addbloco(210, 30, 150, 80, "Rot 90h");
    blocos.addbloco(20, 130, 150, 80, "Rot 90ah");
}

function habilitarMovimento(){
    let sequenciaDeMovimentos = blocos.getMovementSequence();
    executeMovementSequence(sequenciaDeMovimentos);
}

function executeMovementSequence(sequenciaDeMovimentos) {
    if (sequenciaDeMovimentos.length == 0) {
        //sequencia completa ou vazia.
        blocos.inicializacao = false;
        blocos.clear();     
        blocoPadrao();
        blocos.concluirInicializacao();
        return;
    }

    let movimento = sequenciaDeMovimentos.shift();
    if (movimento.type == "move") {
        robot.moverPara(movimento.steps);
        //espera o movimento terminar para passar para o proximo
        setTimeout(() => {
            executeMovementSequence(sequenciaDeMovimentos);
        }, 1400*movimento.steps); // talvez necessario ajustar o delay?
    } else if (movimento.type == "rotate") {
        robot.rotacionar(movimento.direction);
        //espera a rotação terminar para passsar para a proxima
        setTimeout(() => {
            executeMovementSequence(sequenciaDeMovimentos);
        }, 500); // talvez necessario ajustar o delay?
    }
}