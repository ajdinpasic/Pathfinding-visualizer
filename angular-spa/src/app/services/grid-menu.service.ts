import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridMenuService {
  @Output() updateActionEmitter: EventEmitter<string> = new EventEmitter();
  public action: string = "Select action";
  public algo : string = "Select algorithm";
  public menuDisabled: boolean = false;
  @Output() clearBoardEmmiter: EventEmitter<null> = new EventEmitter();

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
  }

  clearBoard() {
    this.clearBoardEmmiter.emit();
  }

}
