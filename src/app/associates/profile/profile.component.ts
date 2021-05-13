import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../models/user-profile';
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
      this.userProfile=new UserProfile(data.employee.id, data.employee.role, data.employee.name, data.employee.email, data.employee.phoneNumber, data.employee.address, data.employee.pictureUrl), 
      ()=>this.errorMessage="No User Profile",
      ()=>console.log("profile retrieved successfully")
    );
    
  }

  ngOnInit(): void {
  }

  updateProfile(){
    console.log("updating user profile");
    this.associateData.updateUserProfile(this.userProfile).subscribe((res)=>console.log(res), (err)=>console.log(err), ()=>console.log('successful'));
  }



}
