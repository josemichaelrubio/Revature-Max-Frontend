import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GroupDataService } from 'app/services/group-data.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  associates: User[] = [];
  rejectedUsers:User[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  loaded: boolean=false;

  emails: string[] = [];
  email: string = '';

  formData!: FormGroup;

  editorOpened: boolean = false;

  constructor(private groupData: GroupDataService) {
    groupData.getAllAssociates().subscribe((usersReturned)=> {
  		usersReturned.forEach((user)=>this.associates.push(user.employee));
      this.loaded=true;
  	},
    (err)=>{this.errorMessage = "Could not find any associates for your assigned batch!"});


   }

  ngOnInit(): void {
    this.formData = new FormGroup({
      email: new FormControl("employee@revature.net")
    });
  }

  onClickAddEmail(data: any){
    this.email = data.email;
    let hasEmail = false;
    for (let i = 0; i < this.emails.length; i++) {
      if (this.emails[i] == this.email) {
        hasEmail = true;
      }
    }
    if (hasEmail == false) {
      this.emails.push(this.email);
    }
  }

  onClickSubmit(){
    let addList=[];
   
    for(let e of this.emails){
      let t = {"email":e};      
      addList.push(t);
     
    }
    
    console.log(addList);
    this.groupData.addAssociates(addList).subscribe((empsReturned)=>{
      this.emails=[];
      empsReturned.forEach((user1)=>this.emails.push(user1.employee));      
      this.loaded=false;
      if(this.emails.length>0){
        this.errorMessage="Some employees are not verified yet. Verification emails were resent to unvereified employees!"
      }

    this.associates=[];

    this.groupData.getAllAssociates().subscribe((usersReturned)=> {
  		usersReturned.forEach((user)=>this.associates.push(user.employee));
      this.loaded=true;		  
  	},
    (err)=>{this.errorMessage = "Could not find any associates for your assigned batch!"});


    },(err)=>this.errorMessage='Error when adding new Associates');     


    

    // for(let email of this.emails){
    //   this.associates.push(new User(null, email, null, null))
    // }

    // this.groupData.addAssociates(this.associates).subscribe((empsReturned)=>this.associates=empsReturned, 
    // ()=>this.errorMessage='Could not add employees to batch', 
    // ()=>this.successMessage = "Employees were added to batch successfully");

    // this.groupData.getAllAssociates().subscribe((usersReturned)=>this.associates=usersReturned,
    // (err)=>{this.errorMessage = "Could not find any associates for your assigned batch!"});
  }

  openAssignment(){
    this.editorOpened = true;
  }
  
  removeEmp(emp:User){
    console.log("removing associate from batch");
    this.groupData.removeAssociate(emp).subscribe(()=>console.log("removing associate from batch"), ()=>console.log("Some Error"),
     ()=> this.groupData.getAllAssociates().subscribe((usersReturned)=> {
      this.associates=[];
      this.loaded=false;
  		usersReturned.forEach((user)=>this.associates.push(user.employee));
      this.loaded=true;
		  
  	},(err)=>{this.errorMessage = "Could not find any associates for your assigned batch!"})
    );
  }
  removeEmail(i:number){
    
    this.emails.splice(i,1);

  }
  

}
