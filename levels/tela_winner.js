tela_winner = {
    draw: function(){
        background(200);
        
       
        
        textSize(50);
        textAlign(CENTER, CENTER);
        text('Parabéns, você chegou ao tesouro!', 700, 400);

        // Desenhar os botões diretamente no canvas
        textSize(20);
        drawButton(1150, 830, 100, 50, "Avançar");
        drawButton(100, 830, 100, 50, "Voltar");
        
    },
    mouseClicked: function(){
        this.ButtonClicks();
    },
    ButtonClicks: function(){
        if (isClickInside(1150, 830, 100, 50)) {
            console.log("avanço de tela");
        } else if (isClickInside(100, 830, 100, 50)){
            mudanca_tela(fase1);
        }
    }
}