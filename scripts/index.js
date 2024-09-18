const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload,
  create,
  update,
});

function preload() {
  //Scale the canvas while respecting aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.stage.backgroundColor = "#eee";
}
function create() {}
function update() {}
