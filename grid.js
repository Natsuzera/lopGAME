function drawGrid() {
    for (let i = 540; i < tela_width; i += 75) {
        for (let j = 0; j < tela_height; j += 75) {
            square(i, j, 75);
        }
    }
}