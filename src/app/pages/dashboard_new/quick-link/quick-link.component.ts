import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-link',
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.scss']
})
export class QuickLinkComponent implements OnInit {
  rows: Array<{ description: string }>;

  constructor() {}

  ngOnInit(): void {
    this.rows = [
      { description: 'Create Invoice' },
      { description: 'Customer Payment' },
      { description: 'BlackListed Customers' },
      { description: 'New External Incoming Orders' },
    ];
  }
}
