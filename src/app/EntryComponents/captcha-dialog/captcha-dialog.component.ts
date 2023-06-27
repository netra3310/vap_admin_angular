import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { randomNumber } from 'src/app/Helper/randomNumber';
// import { NotificationService } from 'src/app/modules/shell/services/notification.service';
// import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { UserModel } from '../../Helper/models/UserModel';

@Component({
  selector: 'app-captcha-dialog',
  templateUrl: './captcha-dialog.component.html',
  styleUrls: ['./captcha-dialog.component.scss']
})
export class CaptchaDialogComponent implements OnInit {


  @Input() firstNumber: number;
  @Input() secondNumber: number;
  @Output() ReturnCall = new EventEmitter<{ IsDone: boolean }>();


  SumOfTwoNo:Number;
  usermodel: UserModel;


  constructor( private readonly toastService: ToastService    ) {
  }
  ngOnInit(): void {
  }
  SubmitSum() // Create InternalOrder Method To Communicate API
  {

    if(Number(this.SumOfTwoNo) && ((Number(this.firstNumber)+Number(this.secondNumber))===Number(this.SumOfTwoNo)))
    {
      this.ReturnCall.emit({ IsDone: true });
    }
    else
    {
      // this.notificationService.notify(
      //   NotificationEnum.ERROR,
      //   "Error","please enter correct sum"
      //   );
        this.toastService.showErrorToast('Error', 'Please enter correct sum');
        this.firstNumber = randomNumber.generate(1);
        this.secondNumber = randomNumber.generate(1);
    }

    
  }
}
