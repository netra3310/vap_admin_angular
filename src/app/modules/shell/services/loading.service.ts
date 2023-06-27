import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = false;

  constructor() {}

  show(): void {
    this.loading = true;
  }

  hide(): void {
    this.loading = false;
  }

  get isLoading(): boolean {
    return this.loading;
  }
}
