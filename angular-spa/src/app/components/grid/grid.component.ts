import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Chain } from 'src/app/models/Chain';
import { GridMenuService } from 'src/app/services/grid-menu.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  public startNodeColor: string = "#42f56c";
  public endNodeColor: string = "#cc4129";
  public dimension: number = 13;
  public animationDelay: number = 15;
  public lineWidth: number = 0.10;
  public canvas: any;
  public ctx: any;
  public shape: any[] = new Array(95);
  public startImg: any = new Image();
  public endImg: any = new Image();

  constructor(private GridMenuSvc: GridMenuService, private toastr: ToastrService) {}

  ngOnInit(): void {
    for (let i=0; i<this.shape.length;i++) {
          this.shape[i] = new Array(40);
    }
    this.canvas = <HTMLCanvasElement>document.getElementById('pathfindingCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.height = 520;
    this.ctx.canvas.width = 1235;
    this.ctx.canvas.style.imageRendering = 'auto';
    this.ctx.imageSmoothingEnabled = false;

    this.startImg.onload = () => {console.log("start img loaded")}
    this.endImg.onload = () => {console.log("end img loaded22")}
    this.startImg.src = "../../../assets/place.svg"
    this.endImg.src = "../../../assets/flag.svg"
    this.resetGrid();

    let temp = this;
    this.canvas.addEventListener('mousemove',  function(event: any) {
      const rectangle = temp.canvas.getBoundingClientRect();
      let cx = event.clientX - rectangle.left;
      let cy = event.clientY - rectangle.top;
      temp.manipulateWall(event, cx, cy)
    }.bind(temp))

    this.canvas.addEventListener('mousedown', function(event: any){
      const rectangle = temp.canvas.getBoundingClientRect();
      let cx = event.clientX - rectangle.left;
      let cy = event.clientY - rectangle.top;

      if(temp.GridMenuSvc.getAction() == 'Change start node') {
          temp.changeStart(cx, cy)
      }
      else if(temp.GridMenuSvc.getAction() == 'Change end node') {
         temp.changeEnd(cx,cy)
      }
      
    }.bind(temp))

    //event emitters subscription
  this.GridMenuSvc.clearBoardEmmiter.subscribe(() => {
    this.resetGrid();
    console.log("Board cleared")
    });

  this.GridMenuSvc.generateRandomWallsEmitter.subscribe(() => {
    this.generateRandomWalls();
  })

  this.GridMenuSvc.loadSampleMazeEmitter.subscribe((data:any) => {
    this.loadSampleMaze(data)
  })

  this.GridMenuSvc.visualizeAlgoEmmiter.subscribe((data: string) => {
    this.visualizeAlgo(data);
  })

  }

  resetGrid(): void {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.fillStyle = "000000";

    for(let i=0;i<this.shape.length;i++) {
      for(let j=0; j<this.shape[i].length;j++) {
        let x = i * this.dimension;
        let y = j * this.dimension;
        let type = "";
        let visited = false;
        let cameFrom = undefined;
        let neighbors = new Array();
        let F = 100000;
        let G = 100000;
        let H = 100000;
        if(i == 4 && j == 4) {
          this.ctx.fillStyle = this.startNodeColor;
          this.ctx.fillRect(x,y,this.dimension,this.dimension);
          type = "Start"
          
        }
         else if (i == (this.canvas.width / this.dimension - 5) && j == (this.canvas.height / this.dimension - 5)) {
         
            this.ctx.fillStyle = this.endNodeColor;
            this.ctx.fillRect(x,y,this.dimension,this.dimension);
            type="End"
            
        }
        else {
          this.ctx.strokeRect(x,y, this.dimension, this.dimension)
          this.ctx.fillStyle = "#000000"
          type = ""
           
        }
       
         this.shape[i][j] = {x, y, i, j, type, F, G, H, neighbors, cameFrom, visited};
      }
    } 
   
  }

  async manipulateWall(event: any, cx:any, cy: any) {
   
    if(!event.which || this.GridMenuSvc.isMenuDisabled()) {
        return;
    }
    
    for (let i=0; i<this.shape.length; i++) {
      for (let j=0; j<this.shape[i].length; j++) {
   
         if ((cx < (this.shape[i][j].x + 12) && (cx > this.shape[i][j].x) && (cy < (this.shape[i][j].y + 12)) && cy > (this.shape[i][j].y))) {
         if ( this.GridMenuSvc.getAction() == 'Add walls' && this.shape[i][j].type != "Wall" && this.shape[i][j].type != "Start" && this.shape[i][j].type != "End") {
              this.ctx.lineWidth = this.lineWidth;
              this.ctx.fillStyle = "#000000";
              this.shape[i][j].type = "Wall";

              let x = this.dimension / 2;
              let y = this.dimension / 2;
              let dx = 0;
              let dy = 0;
              for (let k = this.dimension / 2; k > 0; k--) {
                 await new Promise<void>(resolve =>
                  setTimeout(() => {
                    resolve();
                  }, this.animationDelay)
                );
                this.ctx.fillRect(this.shape[i][j].x + x, this.shape[i][j].y + y, dx - 0.1, dy - 0.1);

                x--;
                y--;
                dx += 2;
                dy += 2;

              }
            }
             if (this.GridMenuSvc.getAction() == 'Remove walls' && this.shape[i][j].type == "Wall") {
              this.ctx.lineWidth = this.lineWidth;
              this.ctx.fillStyle = "#FFFFFF";

              this.shape[i][j].type = "";

              this.ctx.clearRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
              this.ctx.strokeRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);

            }
          }
      }
    }
  }

  changeStart(cx:any, cy: any) {
     if(this.GridMenuSvc.isMenuDisabled()) {
        return;
    }
    for (let i=0; i< this.shape.length; i++) {
      for (let j=0; j<this.shape[i].length; j++) {
           if ((cx < (this.shape[i][j].x + this.dimension) && (cx > this.shape[i][j].x) && (cy < (this.shape[i][j].y + this.dimension)) && cy > (this.shape[i][j].y))) {
            if (this.shape[i][j].type != "Start" && this.shape[i][j].type != "End") {
              for (let m = 0; m < this.shape.length; m++) {
                for (let n = 0; n < this.shape[m].length; n++) {
                  if (this.shape[m][n].type == "Start") {
                  this.ctx.lineWidth = this.lineWidth;

                  this.ctx.fillStyle = "#FFFFFF";
                  this.ctx.clearRect(this.shape[m][n].x - 0.5, this.shape[m][n].y - 0.5, this.dimension + 0.6, this.dimension + 0.5);
                  this.ctx.strokeRect(this.shape[m][n].x, this.shape[m][n].y, this.dimension, this.dimension);
                  this.shape[m][n].type = "";
                }
                }
              }
                 this.ctx.fillStyle = this.startNodeColor;
            this.shape[i][j].type = "Start";

            this.ctx.fillRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
            }
           }
      }
    }
  }

  changeEnd(cx: any, cy: any) {
      if(this.GridMenuSvc.isMenuDisabled()) {
        return;
    }
    for (let i=0; i< this.shape.length; i++) {
      for (let j=0; j<this.shape[i].length; j++) {
           if ((cx < (this.shape[i][j].x + this.dimension) && (cx > this.shape[i][j].x) && (cy < (this.shape[i][j].y + this.dimension)) && cy > (this.shape[i][j].y))) {
            if (this.shape[i][j].type != "Start" && this.shape[i][j].type != "End") {
              for (let m = 0; m < this.shape.length; m++) {
                for (let n = 0; n < this.shape[m].length; n++) {
                  if (this.shape[m][n].type == "End") {
                  this.ctx.lineWidth = this.lineWidth;

                  this.ctx.fillStyle = "#FFFFFF";
                  this.ctx.clearRect(this.shape[m][n].x - 0.5, this.shape[m][n].y - 0.5, this.dimension + 0.6, this.dimension + 0.5);
                  this.ctx.strokeRect(this.shape[m][n].x, this.shape[m][n].y, this.dimension, this.dimension);
                  this.shape[m][n].type = "";
                }
                }
              }
                 this.ctx.fillStyle = this.endNodeColor;
            this.shape[i][j].type = "End";

            this.ctx.fillRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
            }
           }
      }
    }
  }

  async generateRandomWalls() {
    let start;
    let end;
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (this.shape[i][j].type == "Start") {
          start = this.shape[i][j];
        }
        else if (this.shape[i][j].type == "End") {
          end = this.shape[i][j];
        }
        else {
          this.shape[i][j].type = "";
        }

      }
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //restore grid
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        this.ctx.strokeRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
      }
    }
    //restore start and end
    // this.ctx.fillStyle = "#FF3600";
    this.ctx.fillStyle = "#00AB5C";
    this.ctx.fillRect(start.x, start.y, this.dimension - 1, this.dimension - 1);
    // this.ctx.fillStyle = "#00AB5C";
    this.ctx.fillStyle = "#FF3600";
    this.ctx.fillRect(end.x, end.y, this.dimension - 1, this.dimension - 1);


    //random walls
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {

        if (this.shape[i][j].type != "Start" && this.shape[i][j].type != "End") {
          let rand = Math.random();

          if (rand < 0.35) {
            this.shape[i][j].type == "Wall"
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.fillStyle = "#000000";
            this.shape[i][j].type = "Wall";

            this.ctx.fillRect(this.shape[i][j].x + 0.5, this.shape[i][j].y + 0.5, this.dimension - 1, this.dimension - 1);

          }
        }


      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, this.animationDelay)
      );
    }
  }

  async loadSampleMaze(data: any) {
    data = data + "";
    data.trim();

    let dataNew = data.split('\n');

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.GridMenuSvc.setMenu(true)

    for (let i = 0; i < 95; i++) {
      for (let j = 0; j < 40; j++) {
        if (dataNew[j][i] == "1") {
          this.ctx.lineWidth = this.lineWidth;
          this.ctx.fillStyle = "#000000";
          this.shape[i][j].type = "Wall";

          this.ctx.fillRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension - 0.1, this.dimension - 0.1);
        }
        if (dataNew[j][i] == "0") {
          this.shape[i][j].type = "";
          this.ctx.fillStyle = "#FFFFFF"
          //draw it
          this.ctx.strokeRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
        }
        if (dataNew[j][i] == "2") {
          this.shape[i][j].type = "Start";
          //draw it
          this.ctx.strokeRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);

          this.ctx.fillStyle = this.startNodeColor;

          this.ctx.fillRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
        }
        if (dataNew[j][i] == "3") {
          this.ctx.fillStyle = this.endNodeColor;

          this.shape[i][j].type = "End";
          //draw it
          this.ctx.strokeRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
          this.ctx.fillRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
        }
      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, this.animationDelay)
      );
    }
     this.GridMenuSvc.setMenu(false)
  }

  visualizeAlgo(algo: string) {
      // todo: switch loop with cases for algos
      console.log("my algo: "+algo)
      switch(algo) {
        case "A*":
          this.aStarAlgo();
          break;
        case "Dijkstra":
          this.dijkstraAlgo();
          break;
        case "BFS":
          this.bfsAlgo();
      }
  }

  pickSpeed(): number {
    let temp = this.GridMenuSvc.getSpeed();
    switch(temp) {
      case "Slow":
        console.log("temp1 is:"+temp)
        return 35;
      case "Normal":
        console.log("temp2 is:"+temp)
        return 15;
      case "Fast":
        console.log("temp3 is:"+temp)
        return 7;
    }
    return 10;

  }

 async aStarAlgo() {
    this.GridMenuSvc.setMenu(true);
    this.clearPath();
    // get the speed user chooses
    let delaySpeed = this.pickSpeed();
    let openSet = [];
    let closedSet = [];
    let start = null;
    let end = null;
    let path = [];

    this.findNeighbors();

     for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (this.shape[i][j].type == "Start") {
          start = this.shape[i][j];
        }
        if (this.shape[i][j].type == "End") {
          end = this.shape[i][j];
        }
      }
    }

    openSet.push(start);

    //change here begins

    while (openSet.length > 0) {

      let lowestIndex = 0;
      //find lowest index
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].F < openSet[lowestIndex].F)
          lowestIndex = i;
        else if (openSet[i].F === openSet[lowestIndex].F) {
          if (openSet[i].H < openSet[lowestIndex].H) {
            lowestIndex = i;
          }
        }
      }
      //current node
      let current: any = openSet[lowestIndex];

      //if reached the end
      if (openSet[lowestIndex] === end) {

        path = [];
        let temp = current;
        path.push(temp);
        while (temp.cameFrom) {
          path.push(temp.cameFrom);
          temp = temp.cameFrom;
        }
        this.toastr.success("Shortest path found!","Done!")
        console.log("Done!"); // DONE
        //draw path
        for (let i = path.length - 1; i >= 0; i--) {
          let isImg = false;
          let resultColor = "";
          if(path[i].type == "Start") {
            resultColor = this.startImg;
            isImg = true;
          } 
          else if(path[i].type == "End") {
            resultColor = this.endImg;
            isImg = true;
          }
          else {
            resultColor= "#ffff00"
          }
          this.ctx.lineWidth = this.lineWidth;
          // this.ctx.fillStyle = resultColor;
          this.drawNode(path[i].x, path[i].y, resultColor, delaySpeed, isImg)
          await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve();
            }, delaySpeed) // BACK IT
          );
        }
         this.GridMenuSvc.setMenu(false)
        break;
      }

      this.removeFromArray(openSet, current);
      closedSet.push(current);

      let my_neighbors = current.neighbors;
      for (let i = 0; i < my_neighbors.length; i++) {
        var neighbor = my_neighbors[i];

        if (!closedSet.includes(neighbor) && neighbor.type != "Wall") {
          let tempG = current.G + 1;

          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.G) {
              neighbor.G = tempG;
              newPath = true;
            }
          } else {
            neighbor.G = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          if (newPath) {
            neighbor.H = this.calculateHeuristic(neighbor, end);
            neighbor.F = neighbor.G + neighbor.H;
            neighbor.cameFrom = current;
          }

        }
      }


      //draw
      this.ctx.lineWidth = this.lineWidth;
      for (let i = 0; i < closedSet.length; i++) { //BLUE
        this.ctx.fillStyle = "#4287f5";
        this.ctx.fillRect(closedSet[i].x + 0.5, closedSet[i].y + 0.5, this.dimension - 1, this.dimension - 1);
        //this.drawNode(closedSet[i].x, closedSet[i].y, "#4287f5", delaySpeed);
      }
      for (let i = 0; i < openSet.length; i++) { //GREEN
        this.ctx.fillStyle = "#00c48d";
        this.ctx.fillRect(openSet[i].x + 0.5, openSet[i].y + 0.5, this.dimension - 1, this.dimension - 1);
        //this.drawNode(closedSet[i].x, closedSet[i].y, "#00c48d", delaySpeed);

      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, delaySpeed) // BACK IT
      );
    }
    if (openSet.length <= 0) {
      //no solution
      console.log("no path")
      this.toastr.error("Shortest path not found!","Done!")
       this.GridMenuSvc.setMenu(false)
    }

    //change here ends
    
  }

  async dijkstraAlgo() {

    this.clearPath();
    this.GridMenuSvc.setMenu(true)
    // get the speed user chooses
    let delaySpeed = this.pickSpeed();
    let openSet = [];
    let closedSet = [];
    let start, end;
    let path = [];


    this.findNeighbors();


    //shapes is a 2d array of squares... a grid
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (this.shape[i][j].type == "Start") {
          start = this.shape[i][j];
        }
        if (this.shape[i][j].type == "End") {
          end = this.shape[i][j];
        }
      }
    }

    openSet.push(start);


    while (openSet.length > 0) {

      let lowestIndex = 0;
      //find lowest index
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].F < openSet[lowestIndex].F)
          lowestIndex = i;
      }
      //current node
      let current:any = openSet[lowestIndex];

      //if reached the end
      if (openSet[lowestIndex] === end) {

        path = [];
        let temp = current;
        path.push(temp);
        while (temp.cameFrom) {
          path.push(temp.cameFrom);
          temp = temp.cameFrom;
        }
        this.toastr.success("Shortest path found!","Done!")
        console.log("Done!");
        //draw path
        for (let i = path.length - 1; i >= 0; i--) {
          // this.ctx.fillStyle = "#ffff00";
           let isImg = false;
          let resultColor = "";
          if(path[i].type == "Start") {
            resultColor = this.startImg;
            isImg = true;
          } 
          else if(path[i].type == "End") {
            resultColor = this.endImg;
            isImg = true;
          }
          else {
            resultColor= "#ffff00"
          }
          this.ctx.lineWidth = this.lineWidth;
          this.drawNode(path[i].x, path[i].y, resultColor,delaySpeed, isImg)
          await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve();
            }, delaySpeed)
          );
        }
        this.GridMenuSvc.setMenu(false)
        break;
      }

      this.removeFromArray(openSet, current);
      closedSet.push(current);

      let my_neighbors = current.neighbors;
      for (let i = 0; i < my_neighbors.length; i++) {
        var neighbor = my_neighbors[i];

        if (!closedSet.includes(neighbor) && neighbor.type != "Wall") {
          let tempG = current.G + 1;

          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.G) {
              neighbor.G = tempG;
              newPath = true;
            }
          } else {
            neighbor.G = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          if (newPath) {
            neighbor.H = this.calculateHeuristic(neighbor, end);
            neighbor.G = neighbor.F + neighbor.H;
            neighbor.cameFrom = current;
          }

        }
      }


      //draw
      this.ctx.lineWidth = this.lineWidth;
      for (let i = 0; i < closedSet.length; i++) { //BLUE
        this.ctx.fillStyle = "#4287f5";
        this.ctx.fillRect(closedSet[i].x + 0.5, closedSet[i].y + 0.5, this.dimension - 1, this.dimension - 1);
      }
      for (let i = 0; i < openSet.length; i++) { //GREEN
        this.ctx.fillStyle = "#00c48d";
        this.ctx.fillRect(openSet[i].x + 0.5, openSet[i].y + 0.5, this.dimension - 1, this.dimension - 1);

      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, delaySpeed)
      );
    }
    if (openSet.length <= 0) {
      //no solution
      this.toastr.error("Shortest path not found!","Done!")
      this.GridMenuSvc.setMenu(false)
    }

  }

async bfsAlgo() {
    this.clearPath();
    let successFound = false;
    let delaySpeed = this.pickSpeed();
    this.GridMenuSvc.setMenu(true)

    let start;
    let end;
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (this.shape[i][j].type == "Start") {
          start = this.shape[i][j];
        }
        if (this.shape[i][j].type == "End") {
          end = this.shape[i][j];
        }
      }
    }
    console.log("end")
    console.log(end.i + " " + end.j);

    let queue = new Chain();
    queue.addElementToChain(start);

    while (!queue.isChainEmpty()) {
      let node = queue.removeElementFromChain();

      if (node == end) {
        console.log("found final node")
        successFound = true;
        let current = end;
        let path = new Array();
        while (current != start) {
          current = current.cameFrom;
          path.push(current);
        }
        this.drawNode(end.x, end.y, this.endImg, delaySpeed,true)
        for (let i = path.length - 1; i >= 0; i--) {
          // this.ctx.fillStyle = "#ffff00";
           let isImg = false;
          let resultColor = "";
          if(path[i].type == "Start") {
            resultColor = this.startImg;
            isImg = true;
          } 
          // else if(path[i].type == "End") {
          //   resultColor = this.endImg;
          //   isImg = true;
          // }
          else {
            resultColor= "#ffff00"
          }
          this.ctx.lineWidth = this.lineWidth;
          this.drawNode(path[i].x, path[i].y, resultColor, delaySpeed, isImg)
          await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve();
            }, delaySpeed)
          );
        }
        console.log("bfs done")
        this.GridMenuSvc.setMenu(false)
        break;
      }
      
      let neighbors = this.returnNeighbors(node);
      for (let i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].visited && neighbors[i].type != "Wall") {
          neighbors[i].visited = true;
          neighbors[i].cameFrom = node;
          queue.addElementToChain(neighbors[i]);
          this.ctx.fillStyle = "#4287f5";
          this.ctx.fillRect(neighbors[i].x + 0.5, neighbors[i].y + 0.5, this.dimension - 1, this.dimension - 1);
        }
      }
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, delaySpeed)
      );
    }

if(successFound) {
  this.toastr.success("Shortest path found!","Done!")
} else {
  this.toastr.error("Shortest path not found!","Done!")
  this.GridMenuSvc.setMenu(false)
}



  }

  returnNeighbors(node:any) {

    // depending on the node position, add it as a neighbor
    let neighbors = [];
    if (node.i > 0) {
      neighbors.push(this.shape[node.i - 1][node.j]);
    }
    if (node.i < this.shape.length - 1) [
      neighbors.push(this.shape[node.i + 1][node.j])
    ]
    if (node.j > 0) {
      neighbors.push(this.shape[node.i][node.j - 1]);
    }
    if (node.j < this.shape[0].length - 1) {
      neighbors.push(this.shape[node.i][node.j + 1]);
    }
    // this.ctx.fillStyle = "#00c48d";
    //       this.ctx.fillRect(neighbors[node.i].x + 0.5, neighbors[node.i].y + 0.5, this.dimension - 1, this.dimension - 1);
    return neighbors;
  }

  clearPath() {
    let wallPositions = [];
    let startPos;
    let endPos;
    //store info
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (this.shape[i][j].type == "Wall") {
          let x = this.shape[i][j].x;
          let y = this.shape[i][j].y;
          wallPositions.push({ x, y });
        }
        if (this.shape[i][j].type == "Start") {
          startPos = this.shape[i][j];
        }
        if (this.shape[i][j].type == "End") {
          endPos = this.shape[i][j];
        }
        this.shape[i][j].visited = false;
        this.shape[i][j].cameFrom = undefined;
      }
    }
    //clear grid
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //restore stuff
    //grid
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        this.shape[i][j].F = 0;
        this.shape[i][j].G = 0;
        this.shape[i][j].H = 0;
        this.ctx.strokeRect(this.shape[i][j].x, this.shape[i][j].y, this.dimension, this.dimension);
      }
    }


    for (let i = 0; i < wallPositions.length; i++) {
      this.ctx.fillStyle = "#000000"
      this.ctx.fillRect(wallPositions[i].x + 0.5, wallPositions[i].y + 0.5, this.dimension - 1, this.dimension - 1);
    }
    this.ctx.fillStyle = "#FF3600";
    this.ctx.fillRect(startPos.x, startPos.y, this.dimension - 1, this.dimension - 1);
    // this.ctx.fillStyle = "#00AB5C";
    this.ctx.fillStyle = "#CC4141";
    this.ctx.fillRect(endPos.x, endPos.y, this.dimension - 1, this.dimension - 1);

  }

  findNeighbors() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (i < this.shape.length - 1) {
          this.shape[i][j].neighbors.push(this.shape[i + 1][j]);
        }
        if (i > 0) {
          this.shape[i][j].neighbors.push(this.shape[i - 1][j]);
        }
        if (j < this.shape[0].length - 1) {
          this.shape[i][j].neighbors.push(this.shape[i][j + 1]);
        }
        if (j > 0) {
          this.shape[i][j].neighbors.push(this.shape[i][j - 1]);
        }

      }
    }
  }

  async drawNode(xPos:any, yPos:any, color:any, delaySpeed: number, isImg: boolean) {
    let x = this.dimension / 2;
    let y = this.dimension / 2;
    let dx = 0;
    let dy = 0;

    for (let k = this.dimension + 1; k > 0; k--) {
      await new Promise<void>(resolve =>
        setTimeout(() => {
          resolve();
        }, delaySpeed) //  BACK IT
      );
      if(!isImg) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(xPos + x, yPos + y, dx, dy);
      }
      else {
        this.ctx.drawImage(color, xPos + x, yPos + y, dx, dy)
      }

      x -= 0.5;
      y -= 0.5;
      dx += 1;
      dy += 1;

    }
  }

  calculateHeuristic(a:any, b:any) {
    let d = (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    //let d = (Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    return d;
  }

  removeFromArray(arr:any, element:any) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == element) {
        arr.splice(i, 1);
      }
    }
  }

}

 // private mouseTest() {
  //   this.canvas.addEventListener('mousemove', this.onMouseTest);
  // }

  // private onMouseTest : EventListener = (event: any) => {
  //   const rectangle = this.canvas.getBoundingClientRect();
  //      let cx = event.clientX - rectangle.left;
  //      let cy = event.clientY - rectangle.top;
  //      this.manipulateWall(event, cx, cy)
  // }
