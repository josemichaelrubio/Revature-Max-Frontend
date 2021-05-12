
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-associates',
  templateUrl: './associates.component.html',
  styleUrls: ['./associates.component.css']
})
export class AssociatesComponent implements OnInit {
  constructor() {

  }



  ngOnInit(): void {
  }

  dashOpened: boolean = false;

  openDash(){
    this.dashOpened = true;
  }
}
