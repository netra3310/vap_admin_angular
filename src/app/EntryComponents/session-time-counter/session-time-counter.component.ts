import { Component,OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { Subscription,interval } from 'rxjs';

@Component({
  selector: 'app-session-time-counter',
  templateUrl: './session-time-counter.component.html',
  styleUrls: ['./session-time-counter.component.scss']
})
export class SessionTimeCounterComponent implements OnInit ,OnDestroy{

  private subscription: Subscription;
  
  public dateNow = new Date();
  public dDay = new Date();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference : any;
  public secondsToDday : any;
  public minutesToDday : any;
  public hoursToDday : any;
  public daysToDday : any;

  SessionStartTime:any;

  constructor(
    private storageService: StorageService,
    private toastService : ToastService,
    private cdr : ChangeDetectorRef
    ) {
      this.SessionStartTime = this.storageService.getItem('SessionStartTime');
      this.dDay = new Date(this.SessionStartTime);      
      
      const inc = (4*(1000 * 60 * 60)) - 600000;
      this.dDay = new Date(this.dDay.getTime()+inc)
  }
 


  private getTimeDifference () {
      this.timeDifference = this.dDay.getTime() - new  Date().getTime();
      this.allocateTimeUnits(this.timeDifference);
  }

private allocateTimeUnits (timeDifference : any) {
      this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
      this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
      this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
      this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
}
  
  ngOnInit() {
     this.subscription = interval(1000)
         .subscribe((x: any) => { this.getTimeDifference(); this.cdr.detectChanges();});
  }

 ngOnDestroy() {
    this.subscription.unsubscribe();
 }

}
