import { Component, OnInit } from '@angular/core';
import { ThemeModeService } from 'src/app/shared/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
  selector: 'app-custom-brand',
  templateUrl: './custom-brand.component.html',
  styleUrls: ['./custom-brand.component.scss']
})
export class CustomBrandComponent implements OnInit {
  brandPath: string;
  constructor(
    private modeService: ThemeModeService
  ) { 

  }

  ngOnInit(): void {
    if(this.modeService.mode.value === 'dark') {
      this.brandPath = "assets/layout/images/vaplogo.png";
    } else {
      this.brandPath = "assets/layout/images/VaPlong_Logo_Report.png";
    }
  }

}
