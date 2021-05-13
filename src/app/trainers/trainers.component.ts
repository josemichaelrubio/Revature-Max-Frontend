import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavChangeService } from 'app/services/nav-change.service';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class TrainersComponent implements OnInit {

  constructor(private router: Router, private nav: NavChangeService) {
    console.log("persisting navbar state");
    if(!sessionStorage.getItem("token")){
      router.navigateByUrl("/login")
    }
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