import { Component, Input } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  imports: [NgxSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent {
  public showLoader = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  constructor(private spinnerService: NgxSpinnerService) {}
  @Input() duration!: number;

  ngOnit() {
    this.spinnerService.show();
    if (this.duration) {
      this.setTimer();
    } else {
      this.showLoader = true;
    }
  }
  public setTimer() {
    this.showLoader = true;
    this.timer = timer(this.duration);
    this.subscription = this.timer.subscribe(() => {
      this.showLoader = false;
    });
  }
  ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }
}
