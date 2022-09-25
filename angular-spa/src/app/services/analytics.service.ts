import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  public analyticsData: any[] = [];
  public time: any = 0;
  public mins: any = "";
  public secs: any = "";
  public reading: string = "";
  public running: boolean = false;
  public bell: boolean = false;
  @Output() deleteAnalyticsEmitter: EventEmitter<null> = new EventEmitter();
  @Output() updateBell: EventEmitter<any> = new EventEmitter();

  constructor() { }

  getContent() {
    return this.analyticsData;
  }

  deleteAnalytics() {
    this.analyticsData = [];
    this.deleteAnalyticsEmitter.emit();
  }

  startTimer(algo: string, speed: string) {
    let temp = this
    if(!this.getRunning()) {
      this.analyticsData.push({"Algorithm":algo,"Speed":speed,"Time":temp.reading})
      temp.time = 0;
      temp.mins = 0;
      temp.secs = 0;
      temp.reading = "";
      return;
    }
    setTimeout(function() {
      console.log("timeer")
            temp.time++;
            temp.mins = Math.floor(temp.time/10/60);
            temp.secs = Math.floor(temp.time/10 % 60);
            var tenths = temp.time % 10;
            if (temp.mins < 10) {
              temp.mins = "0" + temp.mins;
            }
            if (temp.secs < 10) {
              temp.secs = "0" + temp.secs;
            }
            temp.reading = `${temp.mins} : ${temp.secs} : 0${tenths}`
            temp.startTimer(algo,speed);
        },100);
  } 

  setRunning(value: boolean) {
    this.running = value;
  }

  getRunning() {
    return this.running;
  }

  getBell() {
    return this.bell;
  }

  setBell(value: boolean) {
    this.bell = value;
    this.updateBell.emit(this.getBell())
  }
}
