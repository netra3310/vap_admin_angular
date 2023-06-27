import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss'],
})
export class SidebarFooterComponent implements OnInit {
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  appHelpUrl : string = environment.APP_HELP_URL;

  constructor() {}

  ngOnInit(): void {}
}