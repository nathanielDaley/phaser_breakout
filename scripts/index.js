const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload,
  create,
  update,
});

// to assign phaser objects to
let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo;
let scoreText;
let livesText;
let lifeLostText;
let startButton;

let score = 0;
let lives = 3;
let playing = false;

const textStyle = { font: "18px Arial", fill: "#0095DD" };

function preload() {
  //Scale the canvas while respecting aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.stage.backgroundColor = "#eee";

  game.load.image("paddle", "../images/paddle.png");
  game.load.image("brick", "../images/brick.png");
  game.load.spritesheet("ball", "../images/wobble.png", 20, 20);
  game.load.spritesheet("button", "../images/button.png", 120, 40);
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //set position and sprite and animations of objects
  ball = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 25,
    "ball"
  );
  ball.animations.add("wobble", [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
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

  //if the ball exists the canvas end the game
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  //Prevent the ball from pushing the paddle
  paddle.body.immovable = true;

  initBricks();

  scoreText = game.add.text(5, 5, "Points: 0", textStyle);

  livesText = game.add.text(
    game.world.width - 5,
    5,
    `Lives: ${lives}`,
    textStyle
  );
  livesText.anchor.set(1, 0);

  lifeLostText = game.add.text(
    game.world.width * 0.5,
    game.world.height * 0.5,
    "Life lost, click to continue",
    textStyle
  );
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;

  startButton = game.add.button(
    game.world.width * 0.5,
    game.world.height * 0.5,
    "button",
    startGame,
    this,
    1,
    0,
    2
  );
  startButton.anchor.set(0.5);
}
function update() {
  //Make the ball bounce off the paddle
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);

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
  ball.animations.play("wobble");

  const killTween = game.add.tween(brick.scale);
  killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);
  killTween.onComplete.addOnce(() => {
    brick.kill();
  }, this);
  killTween.start();

  score += 10;
  scoreText.setText(`Points: ${score}`);

  let count_alive = 0;

  //count how many bricks still exist
  for (let i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive) {
      count_alive++;
    }
  }

  //if the are no bricks left win the game
  if (count_alive === 0) {
    alert("You won the game, congratulations!");
    location.reload();
  }
};

const ballLeaveScreen = () => {
  lives--;

  if (lives) {
    livesText.setText(`Lives: ${lives}`);
    lifeLostText.visible = true;
    ball.reset(game.world.width * 0.5, game.world.height - 25);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);
    game.input.onDown.addOnce(() => {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert("You lost, game over!");
    location.reload();
  }
};

const ballHitPaddle = (ball, paddle) => {
  ball.animations.play("wobble");
  ball.body.velocity.x = -5 * (paddle.x - ball.x);
};

const startGame = () => {
  startButton.destroy();
  ball.body.velocity.set(150, -150);
};
