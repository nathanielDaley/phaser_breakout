const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload,
  create,
  update,
});

let ball;
let paddle;

function preload() {
  //Scale the canvas while respecting aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.stage.backgroundColor = "#eee";

  game.load.image("ball", "./images/ball.png");
  game.load.image("paddle", "./images/paddle.png");
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  ball = game.add.sprite(50, 50, "ball");
  paddle = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 5,
    "paddle"
  );

  paddle.anchor.set(0.5, 1);

  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);

  //make ball collide with edge of the canvas
  ball.body.collideWorldBounds = true;

  //make the ball bounce off the bounds of the canvas when it hits them
  ball.body.bounce.set(1);

  ball.body.velocity.set(150, 150);

  //Prevent the ball from pushing the paddle
  paddle.body.immovable = true;
}
function update() {
  //Make the ball bounce off the paddle
  game.physics.arcade.collide(ball, paddle);
}
