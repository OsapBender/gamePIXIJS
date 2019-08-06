let Application = PIXI.Application
loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

let app = new Application({
  width: 480,
  height: 720
});

document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xADD8E6;
app.renderer.view.style.display = "block";
app.renderer.view.style.margin = '0 auto';

// Наш объект, игровое окно, здесь прописываются основные его параметры
const game = {

  ctx: undefined,
  endGame: false,
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
  level: 5
}

// загружаю спрайты кубиков
loader
  .add([
    'res/stone_E-07.png',
    'res/stone_Q-07.png',
    'res/stone_R-07.png',
    'res/stone_W-07.png'
  ])
  .load(setup);

let block, state;

function setup() {
  block = new Sprite(resources['res/stone_E-07.png'].texture);
  block.x = app.screen.width / 2;
  block.y = app.screen.height / 2;
  block.anchor.set(0.5);
  block.vx = 0;
  block.vy = 0;
  app.stage.addChild(block);

  let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

  //Left arrow key `press` method
  left.press = () => {
    //Change the block's velocity when the key is pressed
    block.vx = -5;
    block.vy = 0;
  };

  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the block isn't moving vertically:
    //Stop the block
    if (!right.isDown && block.vy === 0) {
      block.vx = 0;
    }
  };

  //Up
  up.press = () => {
    block.vy = -5;
    block.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && block.vx === 0) {
      block.vy = 0;
    }
  };

  //Right
  right.press = () => {
    block.vx = 5;
    block.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && block.vy === 0) {
      block.vx = 0;
    }
  };

  //Down
  down.press = () => {
    block.vy = 5;
    block.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && block.vx === 0) {
      block.vy = 0;
    }
  };



  // устанавливаем состояние игры
  state = play;

  // вызываем функцию обновления 60 кадров в сек,
  // а в ней вызываем игровой цикл, а он в свою очередь
  // ссылается на функцию state, которая в функции setup
  // приравнивается к функции play
  app.ticker.add(delta => gameLoop(delta));
}

// функция игрового цикла, название может быть любым
// The delta value represents the amount of fractional lag between frames.
// You can optionally add it to the block's position,
// to make the block's animation independent of the frame rate.
// Here's how: block.x += 1 + delta;
function gameLoop(delta) {
  // ссылаемся на функцию state
  state(delta);
}

function play(delta) {
  // это свойство скорости у блока
  block.x += block.vx;
  block.y += block.vy;
  // свойство вращения
  block.rotation += 0.1;
}

// функция управление спрайтами при помощи клавиатуры
function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}
