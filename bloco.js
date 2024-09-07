class bloco {
    constructor(x, y, w, h, text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
    }

    display() {
        rect(this.x, this.y, this.w, this.h);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.text, this.x + this.w/2, this.y + this.h/2);
    }

    isInside(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
    }
}

class blocoManager {
    constructor() {
       this.blocos = {
            "Forward": [],
            "Rot 90h": [],
            "Rot 90ah": []
        };
        this.tiposBlocos = ["Forward", "Rot 90h", "Rot 90ah"];
        this.blocoAtual = null;
        this.sequence = [];
        this.inicializacao = false;
        this.movements = [];
    }

    addbloco(x, y, w, h, text) {
        if(this.tiposBlocos.includes(text)){
            this.blocos[text].push(new bloco(x, y, w, h, text));
            if(this.inicializacao){
                this.sequence.push(text);
            }
        }
        
    }

    displayblocos() {
        for(let tipo of this.tiposBlocos){
            for(let bloco of this.blocos[tipo]){
                bloco.display();
            }
        }
    }

    Arrastar(x, y) {
        for(let tipo of this.tiposBlocos){
            if(this.blocos[tipo][0] && this.blocos[tipo][0].isInside(x, y)){
                this.blocoAtual = tipo;
                return true;
            }
            
        }
        return false;
    }

    previewbloco(x, y) {
        if(this.blocoAtual){
            rect(x, y, 150, 80);
            textSize(30);
            textAlign(CENTER, CENTER);
            text(this.blocoAtual, x + 150/2, y + 80/2);
        }
    }

    addblocoAtPosition(x, y) {
        if (y > 225 && x < 540 - 150 && this.blocoAtual) {
            this.addbloco(x, y, 150, 80, this.blocoAtual);
        }
    }

    concluirInicializacao(){
        this.inicializacao = true;
    }

    clear() {
        for(let tipo of this.tiposBlocos){
            this.blocos[tipo] = [];
        }
        this.blocoAtual = null;
        this.sequence = [];
        this.movements = [];
    }

    getMovementSequence(){
        this.movements = [];
        let forwardCount = 0;

        for(let action of this.sequence){
            if(action == "Forward"){
                forwardCount++;
            } else {
                if(forwardCount > 0){
                    this.movements.push({type: "move", steps: forwardCount});
                    forwardCount = 0;
                }
                this.movements.push({type: "rotate", direction: action === "Rot 90h" ? "clockwise" : "counterclockwise"});
            }

        }

        if(forwardCount > 0){
            this.movements.push({type: "move", steps: forwardCount});
        }

        return this.movements;
    }
    
}