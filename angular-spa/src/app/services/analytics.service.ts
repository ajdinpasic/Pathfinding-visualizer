import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  public analyticsData: any[] = [];
  @Output() deleteAnalyticsEmitter: EventEmitter<null> = new EventEmitter();
  
  constructor() { }

  getContent() {
    return this.analyticsData;
  }

  deleteAnalytics() {
    this.analyticsData = [];
    this.deleteAnalyticsEmitter.emit();
  }
}
