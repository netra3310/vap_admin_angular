import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from './modules/shell/services/logging.service';
import { ErrorService } from './modules/shell/services/error.service';
// import { NotificationService } from './services/notification.service';
import { ToastService } from './modules/shell/services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }
  
  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const toast = this.injector.get(ToastService);

    let message;
    let stackTrace = "error handler logs";
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = errorService.getServerErrorMessage(error);
      // toast.showErrorToast("Error", message);
    } else {
      // Client Error
      message = errorService.getClientErrorMessage(error);
      // toast.showErrorToast("Error", message);
    }
    // Always log errors
    // logger.logError(message, stackTrace);
    // console.error(error);
  }
}