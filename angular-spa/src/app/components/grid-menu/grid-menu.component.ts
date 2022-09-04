import { Component, OnInit } from '@angular/core';
import { GridMenuService } from 'src/app/services/grid-menu.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grid-menu',
  templateUrl: './grid-menu.component.html',
  styleUrls: ['./grid-menu.component.css']
})
export class GridMenuComponent implements OnInit {

  public action : string = "";
  public algo : string = "";
  public menuDisabled: boolean = false;
  public modal : any = [];
  public page: number = 1;

  constructor(private GridMenuSvc: GridMenuService, private http: HttpClient) { }

  ngOnInit(): void {
    this.action = this.GridMenuSvc.getAction();
    this.algo = this.GridMenuSvc.getAlgo();
    this.menuDisabled = this.GridMenuSvc.isMenuDisabled();
    this.modal = this.GridMenuSvc.getModalContext(1);

    this.GridMenuSvc.menuChangedEmitter.subscribe(() => {
       this.menuDisabled = this.GridMenuSvc.isMenuDisabled();
    });
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
        this.action = "Change end node";
        break;
    }
    this.GridMenuSvc.setAction(this.action)
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
          this.algo = "BFS";
          break;
        }
    this.GridMenuSvc.setAction(this.algo)
  }

  clearBoard() {
    this.GridMenuSvc.clearBoard();
  }

  generateRandomWalls() {
    this.GridMenuSvc.generateRandomWalls();
  }

  generateSampleMaze(path: string) {
    this.http.get(path + "", { responseType: 'text' })
      .subscribe((data:any) => this.loadSampleMaze(data));
  }

  loadSampleMaze(data:any) {
    this.GridMenuSvc.loadSampleMaze(data)
  }

  nextPage() {
    this.page++;
    this.modal = this.GridMenuSvc.getModalContext(this.page);
  }

  previousPage() {
    this.page--;
     this.modal = this.GridMenuSvc.getModalContext(this.page);
  }


}
