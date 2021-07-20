
CANVAS_WIDTH = 1050;
CANVAS_HEIGHT = 500;
// Направление движения
LEFT = 37;
UP = 38;
RIGHT = 39;
DOWN = 40;
// Координата X части тела змеи в текстуре
TAIL_LEFT = 0; // хвост смотрит влево
TAIL_UP = 100; // хвост смотрит вверх
TAIL_RIGHT = 200; // хвост смотрит вправо
TAIL_DOWN = 300; // хвост смотрит вниз
BODY = 400; // тело
HEAD_LEFT = 500; // голова смотрит влево
HEAD_UP = 600; // голова смотрит вверх
HEAD_RIGHT = 700; // голова смотрит вправо
HEAD_DOWN = 800; // голова смотрит вниз
// Координата X в текстуре
BRICK = 0 // кирпич
MUSHROOM = 100; // мухомор
NITRO = 200; // ускорение
BERRY1 = 300; // ягода 1
BERRY2 = 400; // ягода 2
BERRY3 = 500; // ягода 3

MAX_LEVEL = 3;
MAX_SNAKE_LENGTH = 10;
GAME_OVER = -1;
NEXT_LEVEL = -2;

var Model = function () {}

Model.prototype.init = function() {
    this.level = 1;
    this.reset();
    this.failSound = document.querySelector('.fail');
    this.successSound = document.querySelector('.success');
}

Model.prototype.reset = function(isNewGame) {
    if (isNewGame) this.level = 1;
    this.isDirectionChanged = false;
    this.direction = RIGHT;
    this.snake = [];
    this.snake.push({x: 450, y: 300, imgX: HEAD_RIGHT}); // голова
    this.snake.push({x: 400, y: 300, imgX: TAIL_LEFT}); // хвост 
    // ИЩЕМ ТРИ СВОБОДНЫЕ ЯЧЕЙКИ НА ИГРОВОМ ПОЛЕ
    cells = epmty_cells(this.snake, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.items = [];
    this.items.push({x: cells[0][0]*50, y: cells[0][1]*50, imgX: randomInteger(3, 5)*100});
}

Model.prototype.changeDirection = function(direction) {
    if (this.isDirectionChanged)
        return;
    // НЕЛЬЗЯ ДВИГАТЬСЯ СРАЗУ В ОБРАТНОМ НАПРАВЛЕНИИ
    if ((this.direction + direction == LEFT + RIGHT) || (this.direction + direction == UP + DOWN))
        return
    if (this.direction != direction) {
        this.direction = direction;
        this.isDirectionChanged = true;
    }
}

Model.prototype.move = function() {
    if (this.snake.length >= MAX_SNAKE_LENGTH) {
        ++this.level;
        this.reset();
        if (this.level > MAX_LEVEL) {
            this.level = 1;
            return GAME_OVER;
        }
        return NEXT_LEVEL;
    } 

    SNAKE_LENGTH = this.snake.length;
    // ЗАПОМИНАЕМ ХВОСТ
    tailX = this.snake[SNAKE_LENGTH-1].x;
    tailY = this.snake[SNAKE_LENGTH-1].y;
    tailImgX = this.snake[SNAKE_LENGTH-1].imgX;
    // ТЕЛО БЕЗ ГОЛОВЫ
    for (i = SNAKE_LENGTH-1; i > 0 ; --i) {
        this.snake[i].x = this.snake[i-1].x;
        this.snake[i].y = this.snake[i-1].y;
    }
    // ГОЛОВА
    switch (this.direction) {
        case LEFT:
            this.snake[0].x -= 50;
            if (this.isDirectionChanged)
                this.snake[0].imgX = HEAD_LEFT; 
            // ЕСЛИ ВЫШЛИ ЗА ГРАНИЦУ
            if (this.snake[0].x < 0)    
                this.snake[0].x = CANVAS_WIDTH - 50;
            // ХВОСТ
            if (this.snake[SNAKE_LENGTH-1].y < this.snake[SNAKE_LENGTH-2].y)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_UP;
            else if (this.snake[SNAKE_LENGTH-1].y > this.snake[SNAKE_LENGTH-2].y)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_DOWN;
            else {
                if (this.snake[SNAKE_LENGTH-1].x < this.snake[SNAKE_LENGTH-2].x)
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_LEFT;
                else  
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_RIGHT;
            }
            break;
        case UP:
            this.snake[0].y -= 50;
            if (this.isDirectionChanged)
                this.snake[0].imgX = HEAD_UP;
            // ЕСЛИ ВЫШЛИ ЗА ГРАНИЦУ
            if (this.snake[0].y < 0)
                this.snake[0].y = CANVAS_HEIGHT - 50;
            // ХВОСТ
            if (this.snake[SNAKE_LENGTH-1].x < this.snake[SNAKE_LENGTH-2].x)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_LEFT;
            else if (this.snake[SNAKE_LENGTH-1].x > this.snake[SNAKE_LENGTH-2].x)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_RIGHT;
            else {
                if (this.snake[SNAKE_LENGTH-1].y < this.snake[SNAKE_LENGTH-2].y)
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_UP;
                else  
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_DOWN;
            }
            break;
        case RIGHT: 
            this.snake[0].x += 50;
            if (this.isDirectionChanged)
                this.snake[0].imgX = HEAD_RIGHT;
            // ЕСЛИ ВЫШЛИ ЗА ГРАНИЦУ
            if (this.snake[0].x >= CANVAS_WIDTH)
                this.snake[0].x = 0;
            // ХВОСТ
            if (this.snake[SNAKE_LENGTH-1].y < this.snake[SNAKE_LENGTH-2].y)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_UP;
            else if (this.snake[SNAKE_LENGTH-1].y > this.snake[SNAKE_LENGTH-2].y)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_DOWN;
            else {
                if (this.snake[SNAKE_LENGTH-1].x < this.snake[SNAKE_LENGTH-2].x)
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_LEFT;
                else  
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_RIGHT;
            }
            break;
        case DOWN:
            this.snake[0].y += 50;
            if (this.isDirectionChanged) 
                this.snake[0].imgX = HEAD_DOWN;
            // ЕСЛИ ВЫШЛИ ЗА ГРАНИЦУ
            if (this.snake[0].y >= CANVAS_HEIGHT)
                this.snake[0].y = 0;
            // ХВОСТ
            if (this.snake[SNAKE_LENGTH-1].x < this.snake[SNAKE_LENGTH-2].x)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_LEFT;
            else if (this.snake[SNAKE_LENGTH-1].x > this.snake[SNAKE_LENGTH-2].x)
                this.snake[SNAKE_LENGTH-1].imgX = TAIL_RIGHT;
            else {
                if (this.snake[SNAKE_LENGTH-1].y < this.snake[SNAKE_LENGTH-2].y)
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_UP;
                else  
                    this.snake[SNAKE_LENGTH-1].imgX = TAIL_DOWN;
            }
            break; 
    }
    // ЕСЛИ ЗМЕЯ ПЫТАЕТСЯ СЪЕСТЬ СЕБЯ
    for (i = 1; i < SNAKE_LENGTH ; ++i) {
        if ((this.snake[0].x == this.snake[i].x) && (this.snake[0].y == this.snake[i].y)) {
            this.failSound.play();
            return GAME_OVER;
        }
    }
    // ЕСЛИ ЗМЕЯ ЧТО-ТО СЪЕЛА
    for (q = 0; q < this.items.length; ++q) {
        if ((this.snake[0].x == this.items[q].x) && (this.snake[0].y == this.items[q].y)) {
            // ИЩЕМ ТРИ СВОБОДНЫЕ ЯЧЕЙКИ НА ИГРОВОМ ПОЛЕ
            cells = epmty_cells(this.snake, CANVAS_WIDTH, CANVAS_HEIGHT);
            // СЪЕЛА ЯГОДУ
            if ([BERRY1, BERRY2, BERRY3].includes(this.items[q].imgX)) {
                this.successSound.play();
                this.items = [];
                // ХВОСТ УДЛИННЯЕМ
                this.snake.push({x: tailX, y: tailY, imgX: tailImgX});
                this.snake[this.snake.length-2].imgX = BODY;
                // ГЕНЕРИРУЕМ ЯГОДУ
                this.items.push({x: cells[0][0]*50, y: cells[0][1]*50, imgX: randomInteger(3, 5)*100});
                if (this.level > 1) {
                    // ГЕНЕРИРУЕМ ГРИБ
                    if (this.snake.length % 3 != 0) {
                        this.items.push({x: cells[1][0]*50, y: cells[1][1]*50, imgX: MUSHROOM});
                    }
                    // ГЕНЕРИРУЕМ НИТРО
                    else {
                        this.items.push({x: cells[1][0]*50, y: cells[1][1]*50, imgX: NITRO});
                    }
                    if (this.level == 3) {
                        // ГЕНЕРИРУЕМ КИРПИЧ
                        this.items.push({x: cells[2][0]*50, y: cells[2][1]*50, imgX: BRICK});
                    }
                }
                return true;
            }
            // СЪЕЛА ГРИБ
            else if (this.items[q].imgX == MUSHROOM) {
                if (this.snake.length == 2) { 
                    this.failSound.play();
                    return GAME_OVER;
                }
                this.successSound.play();
                this.items = [];
                // УКОРАЧИВАЕМ ХВОСТ
                tail = this.snake.pop(); 
                this.snake[this.snake.length-1].imgX = tail.imgX;
                // ГЕНЕРИРУЕМ ЯГОДУ
                this.items.push({x: cells[0][0]*50, y: cells[0][1]*50, imgX: randomInteger(3, 5)*100});
                // ЕСЛИ ГРИБ СЪЕЛИ, ГЕНЕРИРУЕМ ГРИБ СНОВА
                this.items.push({x: cells[1][0]*50, y: cells[1][1]*50, imgX: MUSHROOM});
                if (this.level == 3) {
                    // ГЕНЕРИРУЕМ КИРПИЧ
                    this.items.push({x: cells[2][0]*50, y: cells[2][1]*50, imgX: BRICK});
                }
                return true;
            }
            else if (this.items[q].imgX == NITRO) {
                this.successSound.play();
                this.items = [];
                // ГЕНЕРИРУЕМ ЯГОДУ
                this.items.push({x: cells[0][0]*50, y: cells[0][1]*50, imgX: randomInteger(3, 5)*100});
                // ГЕНЕРИРУЕМ ГРИБ
                if (this.snake.length % 3 != 0) {
                    this.items.push({x: cells[1][0]*50, y: cells[1][1]*50, imgX: MUSHROOM});
                }
                if (this.level == 3) {
                    // ГЕНЕРИРУЕМ КИРПИЧ
                    this.items.push({x: cells[2][0]*50, y: cells[2][1]*50, imgX: BRICK});
                }
                return NITRO;
            }
            else if (this.items[q].imgX == BRICK) {
                this.failSound.play();
                return GAME_OVER;
            }
        }
    }
    this.isDirectionChanged = false;
}

Model.prototype.getLevel = function() { return this.level; }
Model.prototype.getDirection = function() { return this.direction; }
Model.prototype.getSnake = function() { return this.snake; }
Model.prototype.getItems = function() { return this.items; }
Model.prototype.loadGame = function(level, direction, snake, items) {
    this.level = level;
    this.direction = direction;
    this.snake = snake;
    this.items = items;
}


let gameModel = new Model();