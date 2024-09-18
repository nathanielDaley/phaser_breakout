const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload,
  create,
  update,
});

let ball;

function preload() {
  //Scale the canvas while respecting aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.stage.backgroundColor = "#eee";

  game.load.image("ball", "./images/ball.png");
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //set the ball size and sprite to the ball image set above
  ball = game.add.sprite(50, 50, "ball");

  game.physics.enable(ball, Phaser.Physics.ARCADE);

  //make ball collide with edge of the canvas
  ball.body.collideWorldBounds = true;

  //make the ball bounce off the bounds of the canvas when it hits them
  ball.body.bounce.set(1);

  ball.body.velocity.set(150, 150);
}
function update() {}
