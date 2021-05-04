import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'app/models/user-profile';
import { AssociateDataService } from '../../services/associate-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfile!: UserProfile;
  errorMessage: string = '';

  constructor(private associateData: AssociateDataService) { 
    associateData.getEmployeeProfile().subscribe((data)=>this.userProfile=new UserProfile(data), 
      (err)=>this.errorMessage=err, 
      ()=>console.log("profile successfully retrieved")
    );
   }

  ngOnInit(): void {
  }



}
