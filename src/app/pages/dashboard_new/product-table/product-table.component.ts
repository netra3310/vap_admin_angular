import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  @Input() data : any;
  @Input() isLoading : boolean;
  @Input() title : string;
  @Output() eventSelDate = new EventEmitter();
  selectValue: any = 'Today';
  dateArray: any = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
    "Custom Range"
  ]
  products : Array<{ product_name: any, quantity: any, price: any, image: any }> = [];
  constructor() { }

  ngOnInit(): void {
    this.setProducts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.data || changes.isLoading) {
      this.setProducts();
    }
  }

  handleDropEvent(event: any) {
    if(Number(event) < 6)
      this.selectValue = this.dateArray[event];
    else {
      this.selectValue = "Custom Range";
    }
    
    this.eventSelDate.emit(event);
  }

  setProducts() {
    this.products = [];
    if(this.data.labels.length < 1) {
      return;
    }
    const labels = this.data?.labels;
    const quantity = this.data?.datasets[0]?.data;
    const prices = this.data?.prices;
    const images = this.data?.images;
    if(this.data.labels.length > 0) {
      for(let i : number = 0; i < labels.length; i++) {
        this.products.push({product_name: labels[i], quantity: quantity[i], price: prices[i], image: images[i].split("|")[0]})
      }
    } 
    
  }

}
//http://85.215.230.111:543/Content/All/Apple/For_iPad/iPad_6_2018__A1893_A1954_/iPad-6-2018-Power-Flex-Cable.jpg