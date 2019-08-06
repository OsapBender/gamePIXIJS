var endGameScreen = document.querySelector('.endgamescreen');
var activeblock;


var game = {

    // Наш объект, игровое окно, здесь прописываются основные его параметры
    ctx: undefined,
    endGame: false,
    width: 480,
    height: 720,
    columns: 8,
    //число одинаковых блоков, для того чтобы они сгорели
    comboCount: 5,
    //Размеры одного блока
    blockHeight: 60,
    blockWidth: 60,
    canCreateBlock: true,
    activeBlocks: [],
    //Мап, куда попадают неподвижные блоки, после того, как под ними сгорают блоки, и начинают движение
    bufferBlocks: new Map(),
    //Мап с неподвижными блоками
    blocks: new Map(),
    level: 5,
    sprites: {
        blueblock: undefined,
        grayblock: undefined,
        redblock: undefined,
        greenblock: undefined,
    },

    // Самая первая функция, выполняющаяся в нашем скрипте, задает объект, скоторым мы работаем,
    // здесь я тестировал что получалось

    init: function () {
        var canvas = document.getElementById("gamescreen");
        this.ctx = canvas.getContext("2d");

        window.addEventListener('keydown', function (e) {
            if (e.keyCode === 84 && game.canCreateBlock) {
                game.activeBlocks.push({
                    x: Math.floor(Math.floor(Math.random() * (game.width)) / game.blockWidth) * game.blockWidth,
                    y: 0,
                    width: game.blockWidth,
                    height: game.blockHeight,
                    speed: game.level,
                    blockType: (Math.floor(Math.random() * (4))),
                });
                game.canCreateBlock = false;
            }

            //Пробел - кнопка просмотра состояния переменных
            if (e.keyCode === 32) {
                console.log(game.bufferBlocks.size);
                console.log(game.blocks.size);
            }
            if (e.keyCode === 81 && game.activeBlocks && activeblock === 0) {
                game.deleteActiveBlock();
            } else if (e.keyCode === 87 && game.activeBlocks && activeblock === 1) {
                game.deleteActiveBlock();
            } else if (e.keyCode === 82 && game.activeBlocks && activeblock === 2) {
                game.deleteActiveBlock();
            } else if (e.keyCode === 69 && game.activeBlocks && activeblock === 3) {
                game.deleteActiveBlock();
            }
        });
    },


    // Функция, подгрудающая спрайты из массива спрайтов
    load: function () {
        for (var key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "res/" + key + ".png";
        }
    },

    //Функция, инициализирующая игру.

    start: function () {
        this.init();
        this.load();
        this.run();
    },

    // Функция отрисовки, так же вызывается постоянно, после функции апдейта.
    render: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // отрисовка активного блока
        this.activeBlocks.forEach(function (element) {
            if (element.blockType === 0) {
                this.ctx.drawImage(this.sprites.blueblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 1) {
                this.ctx.drawImage(this.sprites.grayblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 2) {
                this.ctx.drawImage(this.sprites.redblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 3) {
                this.ctx.drawImage(this.sprites.greenblock, element.x, element.y, element.width, element.height)
            }
            activeblock = element.blockType;

        }, this);

        // отрисовка бывших неподвижными блоков
        for (let element of this.bufferBlocks.values()) {
            if (element.blockType === 0) {
                this.ctx.drawImage(this.sprites.blueblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 1) {
                this.ctx.drawImage(this.sprites.grayblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 2) {
                this.ctx.drawImage(this.sprites.redblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 3) {
                this.ctx.drawImage(this.sprites.greenblock, element.x, element.y, element.width, element.height)
            }
        }

        // отрисовка неподвижных блоков
        for (let element of this.blocks.values()) {
            if (element.blockType === 0) {
                this.ctx.drawImage(this.sprites.blueblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 1) {
                this.ctx.drawImage(this.sprites.grayblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 2) {
                this.ctx.drawImage(this.sprites.redblock, element.x, element.y, element.width, element.height)
            }
            if (element.blockType === 3) {
                this.ctx.drawImage(this.sprites.greenblock, element.x, element.y, element.width, element.height)
            }
        }
    },


    // Функция, содержащая игровую логику, содержит те величины, что должны постоянно
    // вычисляться. Большинство всех ваших функций игровой логики придется вызывать здесь, можно сказать это наш движок
    update: function () {
        // в начале каждого цикла проверяем на наличие комбо блоков и сжигаем их если что
        game.burnBlocks();

        // апдейт активного блока
        for (var i = 0; i < game.activeBlocks.length; i++) {
            game.activeBlocks[i].y += game.activeBlocks[i].speed;
            // его столкновение с краем экрана
            if (game.activeBlocks[i].y + game.activeBlocks[i].height >= game.height) {
                game.addStableBlock(game.activeBlocks[i]);
                game.deleteActiveBlock();
            }

            // его столкновение с неподвижными блоками
            for (let block of game.blocks.values()) {
                if (block !== undefined) {
                    if (block.x === game.activeBlocks[i].x) {
                        if (game.activeBlocks[i].y + game.activeBlocks[i].height >= block.y) {
                            if (game.activeBlocks[i].blockType > 3) {
                                game.activeBlocks[i].blockType = game.activeBlocks[i].blockType - 4;
                            }
                            game.addStableBlock(game.activeBlocks[i]);
                            game.deleteActiveBlock();
                        }
                    }
                }
            }

        }

        //апдейт блоков, которые пришли в движение
        for (let bufferBlock of game.bufferBlocks.entries()) {
            let index = bufferBlock[0];
            let value = bufferBlock[1];
            value.y += value.speed;
            // их столкновение с краем экрана
            if(value.y + value.height >= game.height){
                game.addStableBlock(value);
                game.deleteBufferBlock(index);
            }
            // их столкновение с неподвижными
            for (let block of game.blocks.values()) {
                if (block !== undefined) {
                    if (block.x === value.x) {
                        if (value.y + value.height >= block.y) {
                            game.addStableBlock(value);
                            game.deleteBufferBlock(index);
                        }
                    }
                }
            }
        }

        //апдейт неподвижных блоков на наличие под ними пустот и перевод их в статус подвижных блоков
        for (let block of game.blocks.entries()) {
            var index = block[0];
            var value = block[1];
            if (!game.blocks.has(index - game.columns) && index > game.columns) {
                console.log('под блоком ' + index + ' пусто!');
                game.blocks.delete(index);
                game.bufferBlocks.set(index,{
                    x: value.x,
                    y: value.y,
                    width: value.width,
                    height: value.height,
                    blockType: value.blockType,
                    speed: game.level + 1,
                })
            }
        }
    },

    //Функция, вызывающая сама себя, и вызывающая постоянное обновление игры
    run: function () {
        if (!game.endGame) {
            this.update();
            this.render();
            window.requestAnimationFrame(function () {
                game.run();
            })
        } else {
            // endGameScreen.style.display = 'block';
        }

    },

    // Функция, добавляющая в конец массива статичных блоков очередной блок
    // тут мы им даем их координату, порядковый номер в соответствии с ней
    addStableBlock: function (block) {
        var xCoor;
        var yCoor;
        if (block.x !== 0) {
            xCoor = block.x / block.width + 1;
        } else {
            xCoor = 1;
        }
        if (block.y === 0) {
            game.endGame = true;
        } else {
            yCoor = game.height / block.height - block.y / block.height;
        }

        var number = (yCoor - 1) * 8 + xCoor;

        // добавляем в наш Мап объект блока под номером
        game.blocks.set(number, {
            x: block.x,
            y: block.y - block.y % game.blockHeight,
            width: block.width,
            height: block.height,
            blockType: block.blockType
        })
    },

    //функция, добавляющая в конец массива падающих блоков очередной блок
    addActiveBlock: function () {
        game.activeBlocks.push({
            x: Math.floor(Math.floor(Math.random() * (game.width)) / game.blockWidth) * game.blockWidth,
            y: 0,
            width: game.blockWidth,
            height: game.blockHeight,
            speed: game.level + 1,
            blockType: (Math.floor(Math.random() * (4))),
        });
        game.canCreateBlock = false;
    },

    deleteActiveBlock: function () {
        game.activeBlocks.pop();
        game.canCreateBlock = true;
        game.addActiveBlock();
    },

    deleteBufferBlock: function (index) {
        game.bufferBlocks.delete(index);
    },

    // Здесь проверяем на наличие нужного числа блоков подряд
    burnBlocks: function () {
        // если у нас есть необходимое для сгорания количество блоков в массиве
        if (game.blocks.size >= game.comboCount) {
            // то получим их ключи
            for (let block of game.blocks.keys()) {
                var i = block;
                // здесь проверка по горизонтали
                // проверяем от текущего блока сразу в обе стороны, поэтому надо чтобы он остоял от края на 2 клетки
                if(i % game.columns >= 3 && i % game.columns <= 6){
                    //и если блоки в обе стороны от него существуют
                    if (game.blocks.get(i - 2) !== undefined && game.blocks.get(i - 1) !== undefined  &&
                        game.blocks.get(i + 1) !== undefined && game.blocks.get(i + 2) !== undefined) {
                        var equality = 0;
                        var type = game.blocks.get(i - 2).blockType;
                        //за каждое совпадение по типу блока плюсуем эквивалентность
                        for (var j = i - 2; j < i + 3; j++) {
                            if (type === game.blocks.get(j).blockType) {
                                equality++;
                            }
                        }
                        //если набрали нужное число
                        if (equality === game.comboCount) {
                            console.log('equal');
                            //вызываем функцию удаления блока
                            game.removeBlocks(i - 2);
                            return;
                        }
                    }
                }
                // Проверка по вертикали, логика та же, но просто проверяем этажи над блоком и под блоком
                if (game.blocks.get(i - game.columns * 2) !== undefined && game.blocks.get(i - game.columns) !== undefined  &&
                    game.blocks.get(i + game.columns) !== undefined && game.blocks.get(i + game.columns * 2) !== undefined) {
                    let equality = 0;
                    let type = game.blocks.get(i - game.columns * 2).blockType;
                    for (let j = - 2; j < 3; j++) {
                        if (type === game.blocks.get(i + (game.columns * j)).blockType) {
                            equality++;
                        }
                    }
                    if (equality === 5) {
                        console.log('equal');
                        game.removeVerticalBlocks(i - game.columns * 2);
                        return;
                    }
                }
            }
        }

    },

    //функция удаления блоков по горизонтали
    removeBlocks: function (number) {
        for (var i = 0; i < game.comboCount; i++) {
            game.blocks.delete(number + i);
        }
    },

    //функция удаления блоков по вертикали
    removeVerticalBlocks: function (number) {
        for (var i = 0; i < game.comboCount; i++) {
            game.blocks.delete(number + i * game.columns);
        }
    }


};

//инициализируем игру после загрузки страницы
window.addEventListener("load", function () {
    game.start();
});
