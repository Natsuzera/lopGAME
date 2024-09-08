let robot; 
let blocos;
let isDrawing = false; //variavel que serve para a criação de blocos provisorios
let tela_width = 1440;
let tela_height = 900;
let bau;
let tela_win; //tela de vitoria
let win_sound;
let somTocando = false;
let tolerancia = [3, 12];


function preload() {
    robotImage = loadImage('images/robo.png');
    bau = loadImage('images/bau.png');
    win_sound = loadSound('audio/winsound.wav');
}

function setup() {
    let cnv = createCanvas(tela_width, tela_height);
    cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    window.onresize = () => {
        cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    };
    
    //posição aleatória do robo
    roboX = Math.floor((Math.random() * 12))*75 + 35 + 540;
    roboY = Math.floor((Math.random() * 12))*75 + 35-9;
    robot = new Robot(roboX, roboY, 75);
    blocos = new blocoManager();
    blocos.addbloco(20, 30, 150, 80, "Forward");
    blocos.addbloco(210, 30, 150, 80, "Rot 90h");
    blocos.addbloco(20, 130, 150, 80, "Rot 90ah");

    blocos.concluirInicializacao();
   
    //posição aleatória do bau
    eixoX = Math.floor((Math.random() * 12))*75 + 540 + 35;
    eixoY = Math.floor((Math.random() * 12))*75 + 35;
}

function draw() {
    background(200);
    drawGrid();
    robot.display(); //função que exibe o robo
    image(bau, eixoX, eixoY, 75, 70); //exibe o bau
    blocos.displayblocos(); //função que exibe os blocos
    displayUI(); //função que exibe a interface do usuário

    if (isDrawing) {
        blocos.previewbloco(mouseX, mouseY);
    }

    if (robot.isMoving) {
        robot.move(false);
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
        reinitialize();
        //possivel mudança de nome para evitar confusões, o "true" não significa que o robô está se movendo e sim que está resetando a posição
        robot.move(true); 
    }
    //verifica se o click foi dentro do botão executar
    if (isClickInside(350, 830, 100, 50)) {
        habilitarMovimento();
        somTocando = false;
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
    //sequencia completa ou vazia
    if (sequenciaDeMovimentos.length == 0) {
        console.log(robot.x, robot.y);
        console.log(eixoX, eixoY);
        verificarVitoria();
        reinitialize();
        return;
    }

    let movimento = sequenciaDeMovimentos.shift();
    console.log(movimento);
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

function verificarVitoria(){
    if((Math.abs(robot.x - eixoX) <= tolerancia[0] && Math.abs(robot.y - eixoY) <= tolerancia[1]) && robot.isMoving == false){
        console.log("Chegou aqui");
        tela_vitoria();
    }    
}

function tela_vitoria(){
    if(!somTocando){
        win_sound.play();
        somTocando = true;
    }
    tela_win = createDiv('Parabéns, você chegou ao tesouro!');
    tela_win.position(500, 450);
    tela_win.style('font-size', '50px');
    tela_win.style('color', 'red');
    tela_win.style('font-weight', 'bold');
    
}

function reinitialize(){
    blocos.inicializacao = false; //para entender melhor o bloco de inicialização, ver bloco.js e o README
    blocos.clear();
    blocoPadrao();
    blocos.concluirInicializacao();
}