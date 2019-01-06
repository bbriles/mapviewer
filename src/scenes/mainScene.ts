import { MapManager } from "../mapManager";
import { Map } from "../map";
import { TokenPosition } from "../tokenPosition";

export class MainScene extends Phaser.Scene {
  public currentAction:string = "none";
  protected mapManager:MapManager;
  protected map:Map;
  private mapSprite: Phaser.GameObjects.Sprite;
  private tokens: Phaser.GameObjects.Group;
  protected controls: Phaser.Cameras.Controls.SmoothedKeyControl;
  protected hideGroup: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.mapManager = new MapManager();
    this.map = this.mapManager.loadMap("test");
    this.load.image(this.map.name, "./assets/maps/"+this.map.file);
    this.load.spritesheet("tokens", "./assets/tokens/tokens.png", { frameWidth: 120, frameHeight: 120 });
    this.load.image("hide", "./assets/hide_red.png");
    
  }

  create(): void {
    this.mapSprite = this.add.sprite(0, 0, this.map.name).setOrigin(0, 0);
    this.addTokens(this.map.tokenPositions);
    this.hideGroup = this.add.group();
    if(this.map.hidden) {
      this.hideMap();
    }

    this.cameras.main.setBounds(0, 0, this.mapSprite.width, this.mapSprite.height);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: cursors.space,
        zoomOut: cursors.shift,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    let self = this;
    this.input.on("drag", function(pointer, gameObject, dragX, dragY):void {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", function(pointer, gameObject):void {
      let xOffset = self.map.offsetX + self.map.width /2;
      let yOffset = self.map.offsetY + self.map.height /2;

      gameObject.x = Math.round((gameObject.x - xOffset) / self.map.width)  * self.map.width + xOffset;
      gameObject.y = Math.round((gameObject.y - yOffset) / self.map.height) * self.map.height + yOffset;
    });

  }

  update(time, delta):void
  {
      this.controls.update(delta);
  }

  private addTokens(tokenPositions?:TokenPosition[]) {
    this.tokens = this.add.group();
    if(tokenPositions) {
      for(var i in tokenPositions) {
        this.tokens.add(this.addToken(tokenPositions[i].x,tokenPositions[i].y, tokenPositions[i].frame));
      }
    }
  }

  private addToken(gridX:integer, gridY:integer, frame:integer):Phaser.GameObjects.Image {
    let token = this.add.image(gridX * this.map.width + this.map.width / 2 + this.map.offsetX, 
      gridY * this.map.height + this.map.height / 2 + this.map.offsetY , "tokens", frame);
    
    let scaleX = 1;
    let scaleY = 1;
    if(token.width >= this.map.width) {
      scaleX = this.map.width / token.width;
      scaleY = this.map.height / token.height;
    }
    token.setScale(scaleX,scaleY);
    token.setInteractive();
    this.input.setDraggable(token);
    
    return token;
  }

  private hideMap():void {
    let cols = Math.ceil((this.mapSprite.width-this.map.offsetX) / this.map.width);
    let rows = Math.ceil((this.mapSprite.height-this.map.offsetY) / this.map.height);

    let rt = this.add.renderTexture(0,0,this.mapSprite.width,this.mapSprite.height);
    let hider = this.add.image(0,0,"hide");
    hider.setScale(this.map.width / hider.width, this.map.height / hider.height);
    hider.setOrigin(0, 0);

    for(var row = 0; row < rows; row++) {
      for(var col = 0; col < cols; col++) {
        rt.draw(hider,this.map.offsetX + col * this.map.width, this.map.offsetX + row * this.map.height);
        //let img = this.add.image(this.map.offsetX + col * this.map.width, this.map.offsetX + row * this.map.height, "hide").setOrigin(0, 0);
        //this.hideGroup.add(img);
      }
    }
  }
}
