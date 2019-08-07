let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  Container = PIXI.Container;

let app = new Application({
  width: 480,
  height: 720
});

document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xADD8E6;
app.renderer.view.style.display = "block";
app.renderer.view.style.margin = '4% auto';

// загружаю спрайты кубиков
loader
  .add('res/blocks.json')
  .load(setup);

let block, state, blocks;

blocks = [
  blockQ = new Sprite(resources['res/blocks.json'].textures['stone_Q-07.png']),
  blockW = new Sprite(resources['res/blocks.json'].textures['stone_W-07.png']),
  blockE = new Sprite(resources['res/blocks.json'].textures['stone_E-07.png']),
  blockR = new Sprite(resources['res/blocks.json'].textures['stone_R-07.png']),
];
