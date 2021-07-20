
var Controller = function(Model, View) {
    this.gameModel = Model;
    this.gameView = View;
    this.interval = 100;
}

Controller.prototype.init = function() {
    this.gameView.onClickNewGameEvent = this.onClickNewGameEvent.bind(this);
    this.gameView.onClickSaveGameEvent = this.onClickSaveGameEvent.bind(this);
    this.gameView.onClickLoadGameEvent = this.onClickLoadGameEvent.bind(this);
    this.gameView.onKeyDownEvent = this.onKeyDownEvent.bind(this);
    this.gameModel.init();
    this.gameView.init();
    this.gameView.onIntervalEvent = this.onIntervalEvent.bind(this);
    this.gameView.onTimeoutEvent = this.onTimeoutEvent.bind(this);
    this.gameView.intervalID = setInterval(this.gameView.onIntervalEvent, this.interval);
};

Controller.prototype.onIntervalEvent = function() {
    state = this.gameModel.move();
    if (state == NITRO) { // ЗАМЕДЛЕНИЕ НА 5 СЕКУНД
        clearInterval(this.gameView.intervalID);
        this.gameView.intervalID = setInterval(this.gameView.onIntervalEvent, this.interval*3);
        setTimeout(this.gameView.onTimeoutEvent, 5000);
    }
    else if (state == GAME_OVER)
        clearInterval(this.gameView.intervalID);
    this.gameView.render(state, this.gameModel.getSnake(), this.gameModel.getItems());
}

Controller.prototype.onClickLoadGameEvent = function() {
    level = 1
    direction = 1;
    snake = [];
    items = [];
    let idb_request;
    // request to open the specified database by name and version number
    // if version number changes, the database is updated
    idb_request = window.indexedDB.open("snake-db", 1);
    // if there is an error, tell the user
    idb_request.addEventListener("error", function(event) {
        alert("Could not open Indexed DB due to error: " + this.errorCode);
    });
    // if we successfully open the database use this callback function
    idb_request.addEventListener("success", function(event) {
        //now we are going to use some data from our database
        try {
            var transaction = this.result.transaction("data", "readwrite");
        } catch (e) {
            idb_request.result.close();
            indexedDB.deleteDatabase('snake-db');
            alert('No found saved game.');
            return;
        }
        let storage = transaction.objectStore("data");
        storage.getAll().addEventListener("success", function(event) { 
            gameController.gameModel.loadGame(this.result[0].level, this.result[0].direction, this.result[3], this.result[1]);
            gameController.gameView.setLevel(this.result[0].level);
            alert("Game loaded.");
        })
    });
}

Controller.prototype.onClickSaveGameEvent = function() {
    // Подготавливаем данные для сохранения
    _level = this.gameModel.getLevel();
    _direction = this.gameModel.getDirection();
    snake = this.gameModel.getSnake();
    items = this.gameModel.getItems();
    _snake = [];
    _items = [];
    for(i = 0; i < snake.length; ++i)
        _snake.push({x: snake[i].x, y: snake[i].y, imgX: snake[i].imgX});
    for(i = 0; i < items.length; ++i)
        _items.push({x: items[i].x, y: items[i].y, imgX: items[i].imgX});

    // request to open the specified database by name and version number
    // if version number changes, the database is updated
    idb_request = window.indexedDB.open("snake-db", 1);
    // if there is an error, tell the user
    idb_request.addEventListener("error", function(event) {
        alert("Could not open Indexed DB due to error: " + this.errorCode);
    });
    /* if the database we specified cannot be found or the version number is old,
        we will need an upgrade to create the new database scheme*/
    idb_request.addEventListener("upgradeneeded", function(event) {
        let storage = this.result.createObjectStore("data", {autoIncrement: true});
        storage.add({level: _level, direction: _direction}, "common_info");
        storage.add({snake_length: snake.length, items_length: items.length}, "objects_info");
        storage.add(_snake, "snake");
        storage.add(_items, "items");
    });
    // if we successfully open the database use this callback function
    idb_request.addEventListener("success", function(event) {
        //now we are going to use some data from our database
        var storage = this.result.transaction("data", "readwrite").objectStore("data");
        storage.get("common_info").addEventListener("success", function(event) {
            storage.put({level: _level, direction: _direction}, "common_info");
        });
        storage.get("objects_info").addEventListener("success", function(event) {
            storage.put({snake_length: snake.length, items_length: items.length}, "objects_info");
        });
        storage.get("snake").addEventListener("success", function(event) {
            storage.put(_snake, "snake");
        });
        storage.get("items").addEventListener("success", function(event) {
            storage.put(_items, "items");
        });
        alert("Game saved.");
    });
}

Controller.prototype.onClickNewGameEvent = function() {
    this.gameModel.reset(true);
    this.gameView.reset();
    clearInterval(this.gameView.intervalID);
    this.gameView.intervalID = setInterval(this.gameView.onIntervalEvent, this.interval);
}

Controller.prototype.onTimeoutEvent = function() {
    clearInterval(this.gameView.intervalID);
    this.gameView.intervalID = setInterval(this.gameView.onIntervalEvent, this.interval);
}


Controller.prototype.onKeyDownEvent = function(e) {
    switch (e.keyCode) {
        case LEFT: 
        case UP: 
        case RIGHT: 
        case DOWN:
            this.gameModel.changeDirection(e.keyCode);
            break; 
        default:
            break;
    }
}

var gameController = new Controller(gameModel, gameView);
gameController.init();