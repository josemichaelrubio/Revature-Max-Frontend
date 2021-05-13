import { Component, OnInit } from '@angular/core';
import { GroupDataService } from '../../../services/group-data.service';
import { User } from '../../../models/user';
import { QC } from '../../../models/qc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-qc',
  templateUrl: './qc.component.html',
  styleUrls: ['./qc.component.css']
})
export class QcComponent implements OnInit {

	errorMessage: String = "";
	associates: any[] = [];
	qcs : QC[] = [];
	currentQC:QC=this.qcs[0];
 

  constructor(private groupData: GroupDataService) {

  	groupData.getAllAssociates().subscribe((usersReturned)=> {
  		usersReturned.forEach((user)=>this.associates.push(user.employee));
		  this.qcSelected(1); 
  	},
    (err)=>{this.errorMessage = "Could not find any associates for your assigned batch!"});


 	groupData.getQCsFromBatch().subscribe((qcsReturned) => {
 		this.qcs = qcsReturned;
		
 	},
 	(err)=>{this.errorMessage = "Could not find any qcs for this batch"});
   	
   }


   qcSelected(qcId: number) {
	   console.log("here")
	   
   		this.groupData.getQCFeedbackScores(this.associates.map((x) => x.id)).subscribe(
   				(returned) => {
   					for (let employeeDTO of returned) {
   						let employeeId = employeeDTO.employee.id;
   						let qcScore = 0;
   						for (let qcFeedback of employeeDTO.qcFeedbacks) {
   							if (qcId == qcFeedback.id.qcId) {
   								qcScore = qcFeedback.instructorFeedback;
   							}
   						}

   						this.associates.forEach((associate) => {
   							if (associate.id == employeeId) {
   								associate.qcScore = qcScore;
   								associate.qcId = qcId;
   							}
						})

						console.log(this.associates);

   					}
					   
   				}
   			);
			   this.currentQC=this.qcs[qcId-1];
			   
   }
   


   setQCFeedback(employeeId: number, qcId: number, instructorFeedback: number) {
   	this.groupData.setQCFeedbackForEmployee(employeeId, qcId, instructorFeedback).subscribe(
   		(response) => {
         this.associates.forEach((associate) => {
           if (associate.id == employeeId) {
             associate.qcScore = instructorFeedback;
           }
         })
       },
   		() => console.log("Please navigate to the desired qc using the drop down menu"),
     

   		);

   }

   //this.associates=usersReturned

  ngOnInit(): void {
  }

}
