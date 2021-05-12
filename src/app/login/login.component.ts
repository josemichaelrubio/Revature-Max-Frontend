import { LoginResponse } from './../models/login-response';
import { AuthService } from './../services/auth.service';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NavChangeService } from 'app/services/nav-change.service';
import { AssociateDataService } from 'app/services/associate-data.service';
import { UserProfile } from 'app/models/user-profile';
import { User } from 'app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string= "";
  message: string = "";
  response!: LoginResponse;
  token!: string;
  empId: string = sessionStorage.getItem("userId") || '0';
  userProfile!: UserProfile;
  userBatchId!: string;
  user!: User;

  loggedIn!: boolean;

  constructor(private authService: AuthService, private router: Router, private nav: NavChangeService) { } //for all of our services, we want to do dependency injection

  login(){

    console.log("getting JWT and userId");

    this.authService.attemptLogin(this.email,this.password).subscribe(
      (res)=>{
        this.message = "Successful login";
        console.log(res);
        this.token = res.headers.get("Authorization") || 'uh-oh';
        this.empId = res.headers.get("EmployeeID") || '0';
        
    },
    (res)=>{this.message = res.error.title;
    },
    ()=>{

      sessionStorage.setItem("token",this.token);
      sessionStorage.setItem("userId", this.empId);
      console.log(this.empId);
      console.log("got token and ID, moving to get the user model from employee service");

      this.authService.getEmployeeProfile(this.empId, this.token).subscribe((data)=>{
        console.log(data);
        this.user=new User(this.empId, data.employee.email, data.employee.name, data.employee.role);
      }, 
        (err)=>this.message="error retrieving profile", 
        ()=>
        {
          console.log(this.user);
          sessionStorage.setItem("user", JSON.stringify(this.user));
          console.log("user model retrieved and moving to find user's assigned batch");

          this.authService.getBatch(this.empId, this.token).subscribe((data)=>{
            console.log(data);
            this.userBatchId = data;
          }, (err)=>{
            this.message="No batch assigned, redirecting to user profile";
            this.router.navigateByUrl("associates");
            console.log("changing navbar state");
            this.nav.setNavbarState(true);
          },
          ()=>{
            sessionStorage.setItem("userBatchId", this.userBatchId);
            console.log("changing navbar state");
            this.nav.setNavbarState(true);
            if(this.user.role == "INSTRUCTOR"){
              this.router.navigateByUrl("trainers");
            }else{
              this.router.navigateByUrl("batch");
            }
          });
        }
      );
    });

  

  }

  ngOnInit(): void {
  }


}
