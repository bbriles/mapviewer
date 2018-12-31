export class MainScene extends Phaser.Scene {
  public currentAction:string = "none";
  private mapSprite: Phaser.GameObjects.Sprite;
  private tokens: Phaser.GameObjects.Group;

  public GridWidth:integer;
  public GridHeight:integer;
  public GridOffsetX:integer;
  public GridOffsetY:integer;

  protected controls: Phaser.Cameras.Controls.SmoothedKeyControl;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image("map", "./assets/maps/grid.png");
    this.load.image("token", "./assets/tokens/token_red.png");
  }

  create(): void {
    // load map
    this.GridWidth = 60;
    this.GridHeight = 60;
    this.GridOffsetX = 0;
    this.GridOffsetY = 0;

    this.mapSprite = this.add.sprite(0, 0, "map").setOrigin(0, 0);

    this.addTokens();


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

    let self = this;
    this.input.on('drag', function(pointer, gameObject, dragX, dragY):void {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', function(pointer, gameObject):void {
      let xOffset = self.GridOffsetX + self.GridWidth /2;
      let yOffset = self.GridOffsetY + self.GridHeight /2;

      gameObject.x = Math.round((gameObject.x - xOffset) / self.GridWidth)  * self.GridWidth + xOffset;
      gameObject.y = Math.round((gameObject.y - yOffset) / self.GridHeight) * self.GridHeight + yOffset;
    });

  }

  update(time, delta):void
  {
      this.controls.update(delta);
  }

  private addTokens() {
    this.tokens = this.add.group();

    this.tokens.add(this.addToken(3, 3,0));
    this.tokens.add(this.addToken(0, 2,0));
  }

  private addToken(gridX:integer, gridY:integer, frame:integer):Phaser.GameObjects.Image {
    let token = this.add.image(gridX * this.GridWidth + this.GridWidth / 2 + this.GridOffsetX, 
      gridY * this.GridHeight + this.GridHeight / 2 + this.GridOffsetY , 'token');
    let scaleX = this.GridWidth / token.width;
    let scaleY = this.GridHeight / token.height;
    token.setScale(scaleX,scaleY);
    token.setInteractive();
    this.input.setDraggable(token);
    
    return token;
  }
}
