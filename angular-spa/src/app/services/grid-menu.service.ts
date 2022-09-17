import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridMenuService {
  @Output() updateActionEmitter: EventEmitter<string> = new EventEmitter();
  public action: string = "Select action";
  public algo : string = "Select algorithm";
  public speed : string = "Normal";
  public menuDisabled: boolean = false;
  public header1 = "Welcome to Pathfinding Visualizer!"
  public content1 = "This short tutorial will walk you through all of the features of this application.If you want to dive right in, feel free to skip the tutorial. Otherwise, press 'Next'!"
  public image1 = "https://bengavrilov.github.io/Path-Finding-Visualizer/slide2pic.png"
  public class1 = "pic1";
  public header2 = "What is pathfinding algorithm?"
  public content2 = "According to the Google, pathfinding is the plotting, by a computer application, of the shortest route between two points, thereat avoiding all obstacles on its path! All of the algorithms on this application are adapted for a 2D grid and movements from a node to another have a 'cost' of 1."
  public image2 = "https://miro.medium.com/max/987/1*gcvqH8fv5CRYtYbkx0JRuQ.png"
  public class2 = "pic2";
  @Output() clearBoardEmmiter: EventEmitter<null> = new EventEmitter();
  @Output() generateRandomWallsEmitter: EventEmitter<null> = new EventEmitter();
  @Output() loadSampleMazeEmitter: EventEmitter<any> = new EventEmitter();
  @Output() menuChangedEmitter: EventEmitter<null> = new EventEmitter();
  @Output() visualizeAlgoEmmiter: EventEmitter<string> = new EventEmitter();

  constructor() { }

  getAction() {
    return this.action;
  }

  setAction(action: string) {
    this.action = action;
  }

  getAlgo() {
    return this.algo;
  }

  setAlgo(algo: string) {
    this.algo = algo;
  }

  isMenuDisabled() {
    return this.menuDisabled;
  }

  setMenu(menu: boolean) {
    this.menuDisabled = menu;
    this.menuChangedEmitter.emit();
  }

  clearBoard() {
    this.clearBoardEmmiter.emit();
  }

  generateRandomWalls() {
    this.generateRandomWallsEmitter.emit();
  }

  getModalContext(page: number): any {
    let final = [];
    switch(page) {
      case 1:
        final[0] = this.header1;
        final[1] = this.content1;
        final[2] = this.image1;
        final[3] = this.class1;
        break;
      case 2:
        final[0] = this.header2;
        final[1] = this.content2;
        final[2] = this.image2;
        final[3] = this.class2;
        break;
    }
    return final;
  }

  loadSampleMaze(data: any) {
    this.loadSampleMazeEmitter.emit(data)
  }

  visualizeAlgo(algo: string) {
    this.visualizeAlgoEmmiter.emit(algo)
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed: string) {
    this.speed = speed;
  }

}
