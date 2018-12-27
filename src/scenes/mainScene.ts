export class MainScene extends Phaser.Scene {
  private mapSprite: Phaser.GameObjects.Sprite;

  protected controls: Phaser.Cameras.Controls.SmoothedKeyControl;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image("map", "./assets/maps/cragmaw_hideout.jpg");
  }

  create(): void {
    this.mapSprite = this.add.sprite(0, 0, "map").setOrigin(0, 0);

    this.cameras.main.setBounds(0, 0, this.mapSprite.width, this.mapSprite.height);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    var cam = this.cameras.main;
  }

  update(time, delta):void
  {
      this.controls.update(delta);
  }
}
