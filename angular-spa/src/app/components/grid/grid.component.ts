import { Component, OnInit } from '@angular/core';
import { GridMenuService } from 'src/app/services/grid-menu.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  //menu options
  // public menuDisabled : boolean = false; 
  // public drawWalls: boolean = true;
  // public removeWalls: boolean = false;
  // public startNodeFree: boolean = false;
  // public endNodeFree: boolean = false;
  public startNodeColor: string = "#42f56c";
  public endNodeColor: string = "#cc4129";
  public dimension: number = 13;
  public animationDelay: number = 15;
  public lineWidth: number = 0.10;
  public canvas: any;
  public ctx: any;
  public shape: any[] = new Array(95);

  constructor(private GridMenuSvc: GridMenuService) {}

  // private mouseTest() {
  //   this.canvas.addEventListener('mousemove', this.onMouseTest);
  // }

  // private onMouseTest : EventListener = (event: any) => {
  //   const rectangle = this.canvas.getBoundingClientRect();
  //      let cx = event.clientX - rectangle.left;
  //      let cy = event.clientY - rectangle.top;
  //      this.manipulateWall(event, cx, cy)
  // }

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

    //TODO: images
    this.resetGrid();

    let temp = this;
    this.canvas.addEventListener('mousemove',  function(event: any) {
      const rectangle = temp.canvas.getBoundingClientRect();
      let cx = event.clientX - rectangle.left;
      let cy = event.clientY - rectangle.top;
      // console.log("event:"+JSON.stringify(event))
      // console.log("rect:"+JSON.stringify(rectangle))
      // console.log("eventx:"+event.clientX)
      // console.log("eventy:"+event.clientY)
      temp.manipulateWall(event, cx, cy)
    }.bind(temp))

    this.canvas.addEventListener('mousedown', function(event: any){
      const rectangle = temp.canvas.getBoundingClientRect();
      let cx = event.clientX - rectangle.left;
      let cy = event.clientY - rectangle.top;
      // console.log("event:"+JSON.stringify(event))
      // console.log("rect:"+JSON.stringify(rectangle))
      // console.log("eventx:"+event.clientX)
      // console.log("eventy:"+event.clientY)

      if(temp.GridMenuSvc.getAction() == 'Change start node') {
        console.log(11)
      temp.changeStart(cx, cy)
      }
      else if(temp.GridMenuSvc.getAction() == 'Change end node') {
              console.log(2)
         temp.changeEnd(cx,cy)
      }
      
    })


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
        //TODO: A* info
        let origin = undefined;
        let neighbors = new Array();
        if(i == 4 && j == 4) {
          this.ctx.fillStyle = this.startNodeColor;
          this.ctx.fillRect(x,y,this.dimension,this.dimension);
          // let tt = new Image();
          // tt.src = '/assets/location.jpg'
          // this.ctx.drawImage(tt,x,y,this.dimension,this.dimension)
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
       
         this.shape[i][j] = {x,y,i,j,type,neighbors, origin, visited};
        
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
              this.ctx.lineWidth = this.lineWidth;

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
        }, 10)
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
        }, 10)
      );
    }
     this.GridMenuSvc.setMenu(false)
  }

}
