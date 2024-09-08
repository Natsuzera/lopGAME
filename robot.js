class Robot {
    #x;
    #y;
    constructor(x, y, size) {
        this.#x = x;
        this.#y = y;
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = robotImage;
        this.isMoving = false;
        this.targetPosition = 0;
        this.sentido = 0;
        this.speed = 1;
    }

    display() {
        imageMode(CENTER);
        image(this.image, this.x, this.y, 105, 80);
    }

    move(reset) {
        if ((this.isMoving && this.x <= 1440-(this.size/2) && this.x <= this.targetPosition) && this.sentido == 0) {
            this.x += this.speed;
        } else if((this.isMoving && this.x >= 540+(this.size/2) && this.x >= this.targetPosition) && (this.sentido == 180 || this.sentido == -180)) {
            this.x -= this.speed;
        } else if((this.isMoving && this.y <= 900-(this.size/2) && this.y <= this.targetPosition) && (this.sentido == 90 || this.sentido == -270)) {
            this.y += this.speed;
        } else if((this.isMoving && this.y >= 0+(this.size/2) && this.y >= this.targetPosition) && (this.sentido == 270 || this.sentido == -90)) {
            this.y -= this.speed;
        } else  if(reset == true){
            this.x = this.#x;
            this.y = this.#y;
            this.sentido = 0;
            this.isMoving = false;
        } else {
            this.isMoving = false;
        }
            
        
    }

    KeyPress() {
        if (keyCode === LEFT_ARROW && this.x - this.size >= 540) {
            this.x -= this.size;
        } else if (keyCode === RIGHT_ARROW && this.x + this.size <= 1440) {
            this.x += this.size;
        } else if (keyCode === UP_ARROW && this.y - this.size >= 0) {
            this.y -= this.size;
        } else if (keyCode === DOWN_ARROW && this.y + this.size < 900) {
            this.y += this.size;
        }
    }

    moverPara(blocoCount) {
        if(blocoCount > 0){
            console.log(blocoCount);
            if(this.sentido == 0){
                this.targetPosition = this.x + (blocoCount * this.size);
            } else if (this.sentido == 90 || this.sentido == -270){
                this.targetPosition = this.y + (blocoCount * this.size);
            } else if (this.sentido == 180 || this.sentido == -180){
                this.targetPosition = this.x - (blocoCount * this.size);
            } else if (this.sentido == 270 || this.sentido == -90){
                this.targetPosition = this.y - (blocoCount * this.size);
            }
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
    }

    rotacionar(sentido) {

        //lembrar que o plano cartesiano nesse caso é diferente do convencional, por isso a rotação é diferente
        //o eixo y é invertido e o sentido horario é positivo
        if(sentido == "clockwise"){
            this.sentido += 90 ;
        } else if(sentido == "counterclockwise"){
            this.sentido -= 90;
        }
        if(this.sentido == 360 || this.sentido == -360){
            this.sentido = 0;
        }
        console.log(this.sentido);
    }
}