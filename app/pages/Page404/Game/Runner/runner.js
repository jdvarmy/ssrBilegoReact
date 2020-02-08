import React from 'react';
import CloudManager from './CloudManager';
import DistanceMeter from './DistanceMeter';
import getImg, { loadImages } from './GetImage';
import GroundManager from './GroundManager';
import Trex from './Trex';

import gameoverTextImg from './images/gameover_text.png';
import restartButtonImg from './images/restart_button.png';

export const STATUS = {
  START: Symbol('START'),
  RUNNING: Symbol('RUNNING'),
  CRASH: Symbol('CRASH'),
};

class Runner extends React.Component {
  outerContainerEl;
  canvas;
  canvasCtx;
  cloudManager;
  groundManager;
  distanceMeter;
  tRex;
  currentSpeed = 0;
  reqId = 0;
  time = 0;
  accelerationTime = 0;
  status = STATUS.START;
  distanceRan = 0;
  restartLock = -1;

  config = {
    ID: '',
    WIDTH: 600,
    HEIGHT: 150,
    BG_COLOR: '',
    INIT_SPEED: 300,
    ACCELERATION: 7,
    ACCELERATION_INTERVAL: 1,
    MAX_SPEED: 800,
    KEYCODE_JUMP: 'Space',
    RESTART_BUTTON_SRC: restartButtonImg,
    GAMEOVER_TEXT_SRC: gameoverTextImg
  };

  container;
  options;
  updatePending;

  constructor(container, options) {
    super(container, options);
    this.outerContainerEl = container;
    this.config = {
      ...this.config,
      ...options,
    }
  }

  init = async () => {
    try {
      await loadImages()
    } catch (err) {
      console.error('Cannot load Images')
    }

    const { ID, WIDTH, HEIGHT, INIT_SPEED } = this.config;
    this.canvas = document.createElement('canvas');
    // ID && (this.canvas.id = ID)

    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.canvasCtx = this.canvas.getContext('2d');
    this.currentSpeed = INIT_SPEED;


    this.drawBackGround();

    this.cloudManager = new CloudManager(this.canvas);
    this.groundManager = new GroundManager(this.canvas);
    this.distanceMeter = new DistanceMeter(this.canvas);

    this.tRex = new Trex(this.canvas);
    this.tRex.draw();

    this.outerContainerEl.appendChild(this.canvas);
    this.startListening()
  };

  startListening() {
    document.addEventListener('keydown', e => this.onKeyDown(e))
    this.canvas.addEventListener('click', e => this.onClick(e))
  }

  onKeyDown(e) {
    const { code } = e;
    switch (code) {
      case this.config.KEYCODE_JUMP:
        if (
          this.status !== STATUS.RUNNING &&
          performance.now() - this.restartLock > 500
        ) {
          this.restart()
        }
        this.tRex.jump();
        break;
      default:
        break;
    }
    e.preventDefault()
  }

  onKeyUp(e) {
    e.preventDefault()
  }

  onClick(e) {
    if (this.status === STATUS.CRASH) {
      this.restart()
    }
    e.preventDefault()
  }

  update() {
    this.updatePending = false;

    const now = performance.now() / 1000;
    const deltaTime = now - (this.time || now);
    this.time = now;

    if (this.status === STATUS.RUNNING) {
      this.canvasCtx.clearRect(
        0,
        0,
        this.config.WIDTH,
        this.config.HEIGHT
      );

      // draw
      this.drawBackGround();
      this.cloudManager.update(deltaTime, this.currentSpeed);
      this.groundManager.update(deltaTime, this.currentSpeed);
      // check collision
      if (this.checkCollision()) {
        this.gameOver();
        this.tRex.draw();
        return
      }
      this.distanceMeter.update(this.distanceRan);
      this.tRex.update(deltaTime);
      // distance update
      this.distanceRan += this.currentSpeed * deltaTime;
      // speed update
      this.accelerationTime += deltaTime;
      if (
        this.currentSpeed < this.config.MAX_SPEED &&
        this.accelerationTime >= this.config.ACCELERATION_INTERVAL
      ) {
        this.currentSpeed +=
          this.config.ACCELERATION *
          (this.accelerationTime / this.config.ACCELERATION_INTERVAL);
        this.accelerationTime = 0;
        if (this.currentSpeed > this.config.MAX_SPEED) {
          this.currentSpeed = this.config.MAX_SPEED
        }
      }
    }

    if (!this.updatePending) {
      this.updatePending = true;
      this.reqId = requestAnimationFrame(this.update.bind(this))
    }
  }

  checkCollision() {
    return this.groundManager.obstacleList.some(obstacle =>
      obstacle.isOverlap(this.tRex)
    )
  }

  restart() {
    this.distanceRan = 0;
    this.currentSpeed = this.config.INIT_SPEED;
    this.time = performance.now() / 1000;
    this.accelerationTime = 0;

    // reset
    if (this.status === STATUS.CRASH) {
      this.tRex.start()
    }
    this.cloudManager.reset();
    this.groundManager.reset();
    this.status = STATUS.RUNNING;
    this.update()
  }

  gameOver() {
    this.tRex.crash();
    this.restartLock = performance.now();
    this.status = STATUS.CRASH;
    this.distanceMeter.updateHighScore();
    this.drawGameOverPanel()
  }

  drawBackGround() {
    const { BG_COLOR, WIDTH, HEIGHT } = this.config;
    if (BG_COLOR) {
      this.canvasCtx.fillStyle = BG_COLOR;
      this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
    }
  }

  drawGameOverPanel() {
    const textImg = getImg(this.config.GAMEOVER_TEXT_SRC);
    const buttonImg = getImg(this.config.RESTART_BUTTON_SRC);

    this.canvasCtx.save();
    this.canvasCtx.drawImage(
      textImg,
      this.canvas.width / 2 - textImg.width / 2,
      (this.canvas.height * 2) / 5 - textImg.height / 2
    );
    this.canvasCtx.drawImage(
      buttonImg,
      this.canvas.width / 2 - buttonImg.width / 2,
      (this.canvas.height * 3) / 5 - buttonImg.height / 2
    );
    this.canvasCtx.restore()
  }
}

export default Runner;
