import { Component, OnInit } from '@angular/core';
import { NavChangeService } from 'app/services/nav-change.service';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {

  constructor(private nav: NavChangeService) {
    console.log("persisting navbar state");
   }

  ngOnInit(): void {
  }

  showCalendar = false;

  showBatch = false;

  showAverage = false;

  goClicked: boolean = false;

  tabOpened: boolean = false;

  clickGo(){
    this.goClicked=true;
  }

  openSideBar(){
    this.tabOpened=true;
  }
  closeSideBar(){
    this.tabOpened=false;
  }
}
