/// <reference path="../phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";

// main game configuration
const config: GameConfig = {
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio - 20,
  type: Phaser.AUTO,
  parent: "viewer",
  resolution: window.devicePixelRatio,
  scene: MainScene
};

// game class
export class Game extends Phaser.Game {

  private selectedButton: HTMLElement = null;
  public currentAction: string;

  constructor(config: GameConfig) {
    super(config);

    //this.initUI();
  }

  private initUI():void {
    let btn = document.getElementById("panButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("pan"));
    // default to pan being selected
    this.clickMenuButton("pan");
    btn = document.getElementById("moveTokenButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("move"));
    btn = document.getElementById("showButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("show"));
    btn = document.getElementById("hideButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("hide"));
    btn = document.getElementById("mapButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("map"));
  }

  public clickMenuButton(action:string):void {
    if(this.selectedButton != null) {
      this.selectedButton.classList.remove('selected');
    }

    // Doing this due to inconsistency with the element in event target
    let button:HTMLElement = null;
    if(action == "pan") {
      button = document.getElementById("panButton");
    }
    else if (action == "move") {
      button = document.getElementById("moveTokenButton");
    }
    else if (action == "show") {
      button = document.getElementById("showButton");
    }
    else if (action == "hide") {
      button = document.getElementById("hideButton");
    }
    else if (action == "map") {
      button = document.getElementById("mapButton");
    }

    if(button != null) {
      button.classList.add('selected');
      this.selectedButton = button;
      this.currentAction = action;
    }
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
