import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid-menu',
  templateUrl: './grid-menu.component.html',
  styleUrls: ['./grid-menu.component.css']
})
export class GridMenuComponent implements OnInit {

  public action : string = "Select action";
  public algo : string = "Select algorithm";
  public menuDisabled: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  updateAction(type: number): void {
    switch(type) {
      case 1:
        this.action = "Add walls";
        break;
      case 2:
        this.action = "Remove walls";
        break;
      case 3:
        this.action = "Change start node";
        break;
      case 4:
        this.action = "Change start node";
        break;
    }
  }

  updateAlgo(type: number): void {
    switch(type) {
        case 1:
          this.algo = "A*";
          break;
        case 2:
          this.algo = "Dijkstra";
          break;
        case 3:
          this.algo = "Breadth-first search";
          break;
        }
  }

}
