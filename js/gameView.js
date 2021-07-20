

//IMG_SNAKE = new Image(); // ТЕКСТУРА ЗМЕИ
//IMG_ITEMS = new Image(); // ТЕКСТУРА С ЕДОЙ, КИРПИЧОМ, НИТРО

let View = function() {
    this.onKeyDownEvent = null;
    this.intervalID = null;
    this.onIntervalEvent = null;
    this.onTimeoutEvent = null;
    this.onClickNewGameEvent = null;
    this.onClickSaveGameEvent = null;
    this.onClickLoadGameEvent = null;
    this.btnNewGame = document.getElementById("btn-new-game");
    this.btnSaveGame = document.getElementById("btn-save-game");
    this.btnLoadGame = document.getElementById("btn-load-game");
    this.level = document.getElementById("level");
    this.canvas = document.getElementById("canvas");
    this.IMG_SNAKE = new Image();
    this.IMG_ITEMS = new Image();
    this.IMG_SNAKE.src = '../assets/img/snake.png';
    this.IMG_ITEMS.src = '../assets/img/items.png';
}

View.prototype.init = function () {
    this.btnNewGame.addEventListener("click", this.onClickNewGameEvent);
    this.btnSaveGame.addEventListener("click", this.onClickSaveGameEvent);
    this.btnLoadGame.addEventListener("click", this.onClickLoadGameEvent);
    document.addEventListener('keydown', this.onKeyDownEvent);
    // ЗАДАЕМ ШИРИНУ И ВЫСОТУ ДЛЯ ИГРОВОГО ПОЛЯ
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.width = CANVAS_WIDTH;
};

View.prototype.reset = function() {
    this.level.innerText = "Level: 1";
}
View.prototype.setLevel = function(level) {
    this.level.innerText = "Level: " + level;
}

View.prototype.render = function(state, snake, items) {
    if (state == NEXT_LEVEL)
        this.level.innerText = "Level: " + (parseInt(this.level.innerText[7]) + 1);

    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //РАМКА и СЕТКА
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineWidth = 0.3;
    for (i = 0; i < CANVAS_WIDTH; i += 50) {
        for (j = 0; j < CANVAS_HEIGHT; j += 50) {
            ctx.strokeRect(i, j, 50, 50);
        }
    }
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    // Первый параметр указывает на изображение
    // sx, sy, sWidth, sHeight указывают параметры фрагмента на изображение-источнике
    // dx, dy, dWidth, dHeight ответственны за координаты отрисовки фрагмента на холсте
    for (i = 0; i < snake.length; ++i) {
        ctx.drawImage(this.IMG_SNAKE, snake[i].imgX, 0, 100, 100, snake[i].x, snake[i].y, 50, 50);
    }
    for (i = 0; i < items.length; ++i) {
        ctx.drawImage(this.IMG_ITEMS, items[i].imgX, 0, 100, 100, items[i].x, items[i].y, 50, 50);
    } 
}


let gameView = new View();