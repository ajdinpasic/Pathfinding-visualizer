import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  //menu options
  public menuDisabled : boolean = false; 
  public drawWalls: boolean = true;
  public removeWalls: boolean = false;
  public startNodeFree: boolean = false;
  public endNodeFree: boolean = false;
  public startNodeColor: string = "#42f56c";
  public endNodeColor: string = "#cc4129";
  public dimension: number = 13;
  public static readonly animationDelay: number = 15;
  public static readonly lineWidth: number = 0.05;
  public canvas: any;
  public ctx: any;
  public shape: any[] = new Array(95);


  constructor() { }

  ngOnInit(): void {
        
    }

}
