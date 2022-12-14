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
  public header3= "Choosing an action!";
  public content3 = "Using this dropdown you can toogle between drawing & removing walls, changing the position of starting & ending node";
  public image3 = "../../assets/actions.JPG";
  public class3 = "pic3";
   public header4= "Choosing an algorithm!";
  public image4 = "../../assets/algos.JPG";
  public class4 = "pic4";
  public header5 = "Visualizing and more";
  public content5 = `You can clear the entire board, and adjust the visualization speed, all from the navbar.You can see how well you algorithm performed and play around with sample or random mazes. If you want to access this tutorial again, click on "Tutorial" option on the menu bar.`;
  public image5 = "../../assets/more.JPG"
  public class5 = "pic5";
  public image55 = "../../assets/moree.JPG"
  public header6 = "Enjoy!";
  public content6 = "I hope you have just as much fun playing around with this visualization tool as I had building it!"
  public image6 = "https://e7.pngegg.com/pngimages/298/636/png-clipart-computer-keyboard-typing-typing-s-furniture-hand.png";
  public class6 = "pic6";
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
    let final:any = {};
    switch(page) {
      case 1:
        final.header = this.header1;
        final.content = this.content1;
        final.image = this.image1;
        final.class = this.class1;
        break;
      case 2:
        final.header = this.header2;
        final.content = this.content2;
        final.image = this.image2;
        final.class = this.class2;
        break;
      case 3:
        final.header = this.header3;
        final.content = this.content3;
        final.image = this.image3;
        final.class = this.class3;
        break;
      case 4:
        final.header = this.header4;
        final.hasDetails = true
        final.image = this.image4;
        final.class = this.class4;
        break;
      case 5:
        final.header = this.header5;
        final.content = this.content5;
        final.image = this.image5;
        final.imagee = this.image55
        final.class = this.class5
        final.twoPics = true;
        break;
      case 6:
        final.header = this.header6;
        final.content = this.content6;
        final.image = this.image6;
        final.class = this.class6;
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
