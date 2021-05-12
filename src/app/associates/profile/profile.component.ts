import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'app/models/user-profile';
import { NavChangeService } from 'app/services/nav-change.service';
import { AssociateDataService } from '../../services/associate-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfile!: UserProfile;
  errorMessage: string = '';

  constructor(private associateData: AssociateDataService, private nav: NavChangeService) {
    console.log("persisting navbar state"); 

    associateData.getEmployeeProfile().subscribe((data)=>
      this.userProfile=data, 
      ()=>this.errorMessage="No User Profile",
      ()=>console.log(this.userProfile)
    );
    
  }

  ngOnInit(): void {
  }



}
