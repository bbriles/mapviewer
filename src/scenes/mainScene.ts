import { Map } from "../map";
import { TokenPosition } from "../tokenPosition";
import { Viewer } from "../viewer";
import * as mapsJson from "../../assets/maps/maps.json";
import { Game } from "phaser";

export class MainScene extends Phaser.Scene {
  public currentAction:string = "none";
  protected map:Map;
  private mapSprite: Phaser.GameObjects.Sprite;
  private tokens: Phaser.GameObjects.Group;
  protected controls: Phaser.Cameras.Controls.SmoothedKeyControl;
  protected hideGroup: Phaser.GameObjects.Group;
  protected hideTiles: Phaser.GameObjects.GameObject[][];

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.hideGroup = this.add.group();
    this.hideTiles = new Array<Phaser.GameObjects.GameObject[]>();

    this.load.on('filecomplete', function(key, file) {
      if(key == "map") {
        this.mapSprite = this.add.image(0, 0, key).setOrigin(0,0);
        this.mapSprite.setInteractive();
        this.cameras.main.setBounds(0, 0, this.mapSprite.width, this.mapSprite.height);

        if(this.map.hidden) {
          this.hideMap();

          if(this.map.showStartX != null) {
            this.showMapSection(this.map.showStartX, this.map.showStartY, this.map.showEndX, this.map.showEndY);
          }
        }
      }
    }, this);

    this.loadMap("M02");
    this.load.spritesheet("tokens", "./assets/tokens/tokens.png", { frameWidth: 120, frameHeight: 120 });
    this.load.image("hide", "./assets/hide.png");
  }

  create(): void {
    this.tokens = this.add.group();
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
      let viewer = self.game as Viewer;

      if(viewer.currentAction == "move") {
        gameObject.x = pointer.worldX;
        gameObject.y = pointer.worldY;
      }
    });

    this.input.on("dragend", function(pointer, gameObject):void {
      let viewer = self.game as Viewer;

      if(viewer.currentAction == "move") {
        let xOffset = self.map.offsetX + self.map.width /2;
        let yOffset = self.map.offsetY + self.map.height /2;

        gameObject.x = Math.round((gameObject.x - xOffset) / self.map.width)  * self.map.width + xOffset;
        gameObject.y = Math.round((gameObject.y - yOffset) / self.map.height) * self.map.height + yOffset;
      }
    });

    this.input.on("pointermove", function(pointer, gameObject) {
      let viewer = self.game as Viewer;

      if(pointer.isDown && viewer.currentAction == "hide") {
        let col = Math.floor((pointer.worldX - self.map.offsetX) / self.map.width);
        let row = Math.floor((pointer.worldY - self.map.offsetY) / self.map.height);

        if(col >= 0 && row >= 0 && !self.hideTiles[row][col]) {
          self.addHideTile(row, col);
        }
      }
    });

    this.input.on("pointerdown", function(pointer) {
      let viewer = self.game as Viewer;

      let col = Math.floor((pointer.worldX - self.map.offsetX) / self.map.width);
      let row = Math.floor((pointer.worldY - self.map.offsetY) / self.map.height);

      if(viewer.currentAction == "friendly" || viewer.currentAction == "enemy") {
        self.addToken(col, row, +viewer.getSelectedOption());
      }
      else if(viewer.currentAction == "show") {
        self.hideTiles[row][col].destroy();
        self.hideTiles[row][col] = null;
      }
      else if(viewer.currentAction == "hide") {

      }
    });
  }

  update(time, delta):void
  {
      this.controls.update(delta);
  }

  private addTokens(tokenPositions?:TokenPosition[]) {
    if(tokenPositions) {
      for(var i in tokenPositions) {
        this.tokens.add(this.addToken(tokenPositions[i].x,tokenPositions[i].y, tokenPositions[i].frame));
      }
    }
  }

  private loadMap(mapName:string):void {
    // delete current map sprite if there is one
    this.map = null;
    if(this.mapSprite) {
      this.mapSprite.destroy();
      this.mapSprite = null;
    }
    
    // load map info from JSON
    for (var i in mapsJson.maps) {
      if (mapsJson.maps[i].name == mapName) {
          this.map = mapsJson.maps[i];
      }
    }

    if(this.map) {
      this.load.image("map", "./assets/maps/"+this.map.file);
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
    let self = this;
    token.on("pointerdown", function(pointer) {
      let viewer = self.game as Viewer;

      if(viewer.currentAction == "kill") {
        this.destroy();
      }
    });

    return token;
  }

  private hideMap():void {
    let cols = Math.ceil((this.mapSprite.width-this.map.offsetX) / this.map.width);
    let rows = Math.ceil((this.mapSprite.height-this.map.offsetY) / this.map.height);

    for(var row = 0; row < rows; row++) {
      this.hideTiles[row] = new Array<Phaser.GameObjects.GameObject>();
      for(var col = 0; col < cols; col++) {
        this.addHideTile(row, col);
      }
    }
  }

  private addHideTile(row, col) {
    let self = this;
    let img = this.add.image(this.map.offsetX + col * this.map.width, this.map.offsetX + row * this.map.height, "hide");
    img.setOrigin(0, 0);
    img.setScale(this.map.width / img.width, this.map.height / img.height);
    img.setInteractive();

    this.hideGroup.add(img);
    this.hideTiles[row][col] = img;

    img.on('pointerover', function (pointer) {
      let viewer = self.game as Viewer;
      
      if(pointer.isDown) {
        if (viewer.currentAction == "show") {
          this.destroy();
          let col = Math.floor((pointer.worldX - self.map.offsetX) / self.map.width);
          let row = Math.floor((pointer.worldY - self.map.offsetY) / self.map.height);
          self.hideTiles[row][col] = null;
        }
      } 

    });
  }

  private showMapSection(startX:integer, startY:integer, endX:integer, endY) {
    for(var row = startY; row <= endY; row++) {
      for(var col = startX; col <= endX; col++) {
        if(this.hideTiles[row][col]) {
          this.hideTiles[row][col].destroy();
          this.hideTiles[row][col] = null;
        }
      }
    }

  }

  public save():void {
    let tokens = this.getCurrentTokens();
  }

  private getCurrentTokens():Array<TokenPosition> {
    let tokenList = new Array<TokenPosition>();

    let xOffset = this.map.offsetX + this.map.width /2;
    let yOffset = this.map.offsetY + this.map.height /2;

    if(this.tokens) {
      for(let gameObj of this.tokens.getChildren()) {
          let token = gameObj as Phaser.GameObjects.Sprite;
          let tokenPos = new TokenPosition();
          tokenPos.x = Math.round((token.x - xOffset) / this.map.width);
          tokenPos.y = Math.round((token.y - yOffset) / this.map.height);
          tokenPos.frame = token.frame.sourceIndex;
          tokenList.push(new TokenPosition());
      }
    }

    return tokenList;
  }
}
