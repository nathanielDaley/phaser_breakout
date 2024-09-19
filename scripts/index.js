const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload,
  create,
  update,
});

let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo;

function preload() {
  //Scale the canvas while respecting aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.stage.backgroundColor = "#eee";

  game.load.image("ball", "./images/ball.png");
  game.load.image("paddle", "./images/paddle.png");
  game.load.image("brick", "./images/brick.png");
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //set position and sprite of objects
  ball = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 25,
    "ball"
  );
  paddle = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 5,
    "paddle"
  );

  //set the point from which the objects are drawn
  ball.anchor.set(0.5);
  paddle.anchor.set(0.5, 1);

  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);

  //make ball collide with edge of the canvas
  ball.body.collideWorldBounds = true;

  //make the ball bounce off the bounds of the canvas when it hits them...
  ball.body.bounce.set(1);
  //...except the bottom bound
  game.physics.arcade.checkCollision.down = false;

  ball.body.velocity.set(150, -150);

  //if the ball exists the canvas end the game
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(() => {
    alert("Game over!");
    location.reload();
  }, this);

  //Prevent the ball from pushing the paddle
  paddle.body.immovable = true;

  initBricks();
}
function update() {
  //Make the ball bounce off the paddle
  game.physics.arcade.collide(ball, paddle);

  //ball can hit bricks and when it does calls ballHitBrick
  //passes ball and brick to ballHitBrick
  game.physics.arcade.collide(ball, bricks, ballHitBrick);

  //move the paddle to the middle of the screen or the mouse's x position if it is inside the canvas
  paddle.x = game.input.x || game.world.width * 0.5;
}

const initBricks = () => {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      col: 7,
    },
    offset: {
      top: 50,
      left: 60,
    },
    padding: 10,
  };

  bricks = game.add.group();
  for (let c = 0; c < brickInfo.count.col; c++) {
    for (let r = 0; r < brickInfo.count.row; r++) {
      let brickX =
        c * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      let brickY =
        r * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;

      newBrick = game.add.sprite(brickX, brickY, "brick");
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
};

const ballHitBrick = (ball, brick) => {
  brick.kill();
};
