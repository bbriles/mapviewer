/// <reference path="../phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";
import * as friendlyJson from "../assets/tokens/friendly.json";

// main game configuration
const config: GameConfig = {
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio - 20,
  type: Phaser.AUTO,
  parent: "viewer",
  resolution: window.devicePixelRatio,
  scene: MainScene
};

// viewer class
export class Viewer extends Phaser.Game {

  private selectedButton: HTMLElement = null;
  public currentAction: string;

  constructor(config: GameConfig) {
    super(config);

    this.initUI();
  }

  private initUI():void {
    //let btn = document.getElementById("panButton");
    //btn.addEventListener("click", (e:Event) => this.clickMenuButton("pan"));
    let btn = document.getElementById("moveButton");
    this.clickMenuButton("move");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("move"));
    btn = document.getElementById("showButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("show"));
    btn = document.getElementById("hideButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("hide"));
    btn = document.getElementById("mapButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("map"));
    btn = document.getElementById("friendlyButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("friendly"));
    btn = document.getElementById("enemyButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("enemy"));
    btn = document.getElementById("killButton");
    btn.addEventListener("click", (e:Event) => this.clickMenuButton("kill"));
  }

  public clickMenuButton(action:string):void {
    if(this.selectedButton != null) {
      this.selectedButton.classList.remove("selected");
    }

    // Doing this due to inconsistency with the element in event target
    let button = document.getElementById(action + "Button");
    
    if(button != null) {
      button.classList.add("selected");
      this.selectedButton = button;
      this.currentAction = action;

      let listMenu = document.getElementById("listMenu");
      // handle sub-menu
      if(action == "friendly" || action == "enemy") {
        listMenu.classList.remove("hidden");
        let list = document.getElementById("optionList");
        while (list.firstChild) {
          list.removeChild(list.firstChild);
        }
        if(action == "friendly") {
          for (var i in friendlyJson.tokens) {
            let option = document.createElement("option");
            option.value= friendlyJson.tokens[i].frame.toString();
            option.text = friendlyJson.tokens[i].id;
            list.append(option);
          }
        }
        else if(action == "enemy") {
          let option = document.createElement("option");
          option.value= "enemy";
          option.text = "ENEMY!";
          list.append(option);
        }
      }
      else if (!listMenu.classList.contains("hidden")) {
        listMenu.classList.add("hidden");
      }
    }
  }

  public getSelectedOption():string {
    let list = document.getElementById("optionList") as HTMLSelectElement;
    return list.value;
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Viewer(config);
};
