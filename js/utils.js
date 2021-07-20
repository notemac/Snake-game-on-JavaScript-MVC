
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);    
    return Math.abs(rand);
}

function new_shuffle_array(elems) {
  _elems = elems.slice();
  let length = _elems.length;
  // While there are elements in the array
  while (length > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * length);
      --length;
      // And swap the last element with it
      let temp = _elems[length];
      _elems[length] = _elems[index];
      _elems[index] = temp;
  }
  return _elems;
}

// ИЩЕМ ДВЕ СВОБОДНЫЕ ЯЧЕЙКИ НА ИГРОВОМ ПОЛЕ
function epmty_cells(snake, width, height) {
  id = []
  cells = [];
  for (i = 0; i < width; i+=50) {
    id.push(i/50);
    cells[i/50] = [];
    for (j = 0; j < height; j+=50) {
      cells[i/50].push(j/50);
    }
  }
  for (i = 0; i < snake.length; ++i) {
    cells[snake[i].x/50].splice(cells[snake[i].x/50].indexOf(snake[i].y/50), 1);
  }

  // ПУСТЫЕ МАССИВЫ ПРОПУСКАЕМ
  len = cells.length;
  i = 0;
  while(i < len) {
    if (cells[i].length == 0) {
      id.splice(i, 1); 
      cells.splice(i, 1);
      len = cells.length;
    }
    else ++i;
  }

  i = randomInteger(0, id.length - 1);
  i1 = id[i];
  row = new_shuffle_array(cells[i]);
  j1 = row[randomInteger(0, row.length - 1)];

  // УДАЛЯЕМ ПЕРВУЮ ВЫБРАННУЮ ПУСТУЮ ЯЧЕЙКУ ПОД ЯГОДУ
  cells[i].splice(j1, 1);
  // ПУСТЫЕ МАССИВЫ ПРОПУСКАЕМ
  if (cells[i].length == 0) {
    id.splice(i, 1); 
    cells.splice(i, 1);
  }

  i = randomInteger(0, id.length - 1);
  i2 = id[i];
  row = new_shuffle_array(cells[i]);
  j2 = row[randomInteger(0, row.length - 1)];

  // УДАЛЯЕМ ПЕРВУЮ ВЫБРАННУЮ ПУСТУЮ ЯЧЕЙКУ ПОД ЯГОДУ
  cells[i].splice(j2, 1);
  // ПУСТЫЕ МАССИВЫ ПРОПУСКАЕМ
  if (cells[i].length == 0) {
    id.splice(i, 1); 
    cells.splice(i, 1);
  }

  i = randomInteger(0, id.length - 1);
  i3 = id[i];
  row = new_shuffle_array(cells[i]);
  j3 = row[randomInteger(0, row.length - 1)];

  return [[i1, j1], [i2, j2], [i3, j3]];
}