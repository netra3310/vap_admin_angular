import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { SearchPipe } from '../../pipes/search-pipe';

@Component({
  selector: 'app-custom-picklist',
  templateUrl: './custom-picklist.component.html',
  styleUrls: ['./custom-picklist.component.scss']
})
export class CustomPicklistComponent implements OnInit {

  @Input() source: any;
  @Input() target: any;
  @Input() responsive: boolean = false;
  @Input() sourceStyle: any;
  @Input() targetStyle: any;
  @Input() sourceHeader: any;
  @Input() targetHeader: any;
  @Input() dragdrop: any;
  @Input() filterBy: any = 'name';
  @Input() sourceFilterPlaceholder: any;
  @Input() targetFilterPlaceholder: any;

  viewSource: any;
  viewTarget: any;

  keySource: any;
  keyTarget: any;
  selectedSourceItem: any;
  selectedTargetItem: any;

  @Output() emitChangeTarget = new EventEmitter();

  constructor(
    private cdr: ChangeDetectorRef
  ) { 
    
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes : SimpleChanges) {
    if(changes.source) {
      // console.log("this.filterby is ", this.filterBy);
      // console.log("this.source is ", this.source);
      // console.log("this.target is ", this.target);
      // this.source = [
      //                 {Name: "adfav", value: "aaaa"}, 
      //                 {Name: "zxcvzcvzxcv", value: "aaaa"}, 
      //                 {Name: "zbzxcbzxcvzxcv", value: "aaaa"}, 
      //                 {Name: "ssss", value: "aaaa"},
      //                 {Name: "zxcvz", value: "aaaa"}, 
      //                 {Name: "gfhj", value: "aaaa"}, 
      //                 {Name: "fgjfgj", value: "aaaa"}, 
      //                 {Name: "ssfgjfhjss", value: "aaaa"},
      //                 {Name: "fgh", value: "aaaa"}, 
      //                 {Name: "sqwerqwersss", value: "aaaa"}, 
      //                 {Name: "sfqwergfgjfhsss", value: "aaaa"}, 
      //                 {Name: "ssfgjfgjss", value: "aaaa"},
      //                 {Name: "fgfgssss", value: "aaaa"}, 
      //                 {Name: "ssss", value: "aaaa"}, 
      //                 {Name: "sssfgfjhs", value: "aaaa"}, 
      //                 {Name: "ssss", value: "aaaa"},
      //                 {Name: "ssfgetyeryss", value: "aaaa"}, 
      //                 {Name: "ssss", value: "aaaa"}, 
      //                 {Name: "setywertsss", value: "aaaa"}, 
      //                 {Name: "ssasdfadfss", value: "aaaa"}
      //               ];
      
    }
  }

  // filterSource(event: any) {
  //   console.log(event.target.value);
  //   let searchResult = new SearchPipe().transform(this.source, ['Name'], event.target.value);
  //   this.viewSource = searchResult;
  //   console.log(this.viewSource);
  // }
  addTarget(item: any) {
    this.removeSource(item);
    this.target.push(item);

    this.refreshLists();

    this.emitChangeTarget.emit(this.target);
  }

  removeTarget(item: any) {
    const index = this.target.findIndex((element: any) => element === item);
    if (index !== -1) {
      this.target.splice(index, 1);
    }
    this.cdr.detectChanges();
  }
  refreshLists() {
    if(this.keyTarget !== '' || this.keySource !== '') {
      const tmpKeyTarget = this.keyTarget;
      this.keyTarget = "";
      this.cdr.detectChanges();
      this.keyTarget = tmpKeyTarget;
      const tmpKeySource = this.keySource;
      this.keySource = "";
      this.cdr.detectChanges();
      this.keySource = tmpKeySource;
    }
  }
  addSource(item: any) {
    this.removeTarget(item);
    this.source.push(item);

    this.refreshLists();

    this.emitChangeTarget.emit(this.target);
  }

  removeSource(item: any) {
    const index = this.source.findIndex((element: any) => element === item);
    if (index !== -1) {
      this.source.splice(index, 1);
    }
  }

  selectToSource() {
    if(this.selectedTargetItem) {
      this.addSource(this.selectedTargetItem);
      this.selectedTargetItem = null;
    }
  }

  selectToTarget() {
    if(this.selectedSourceItem) {
      this.addTarget(this.selectedSourceItem);
      this.selectedSourceItem = null;
    }
  }

  allToTarget() {
    this.target.concat(this.source);
    this.source.forEach((element: any) => {
      this.target.push(element);
    });
    this.source = [];
    this.selectedSourceItem = null;
    this.selectedTargetItem = null;
    this.refreshLists();
    this.emitChangeTarget.emit(this.target);
  }

  allToSource() {
    this.source.concat(this.target);
    this.target.forEach((element: any) => {
      this.source.push(element);
    });
    this.target = [];
    this.selectedSourceItem = null;
    this.selectedTargetItem = null;
    this.refreshLists();
    this.emitChangeTarget.emit(this.target);
  }

}
