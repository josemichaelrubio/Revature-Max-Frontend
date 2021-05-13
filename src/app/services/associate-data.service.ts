import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeInfo } from '../models/employee-info';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { UserProfile } from 'app/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class AssociateDataService {

  token: string = sessionStorage.getItem("token") || '';
  associateId : string = sessionStorage.getItem("userId") || '0';

  associatesUrl: string = environment.baseUrl+`/employees/${this.associateId}`;
  employeeTestUrl: string = "http://localhost:8082/employees";


  httpOptions = {
    headers: new HttpHeaders({"Authorization": this.token})
  };

  constructor(private http: HttpClient) {  
    
  }
  getEmployeeInfo():Observable<any>{
      return this.http.get<any>(environment.baseUrl + `/employees/${this.associateId}?field=quiz-scores,topic-competencies,qc-feedbacks`, this.httpOptions);
    }

  setEmployeeQuiz(employeeQuiz: string, quizId: number) {
    let user = JSON.parse(sessionStorage.getItem("user") || "");
    this.http.put(environment.baseUrl + `/employees/${this.associateId}/quizzes/${quizId}`, employeeQuiz, { headers : new HttpHeaders({"Authorization":this.token,"Content-Type":"application/json"})}).subscribe(
       (response) => console.log("Added a quiz"),
       (error) => console.log(error),
       () => console.log()

      );
  }


  getEmployeeProfile(): Observable<any>{
    return this.http.get<any>(this.associatesUrl, this.httpOptions);
  }

  getBatchId(employeeId: string): Observable<any>{
    return this.http.get<any>(environment.baseUrl+'batches/'+employeeId+'/batch', this.httpOptions);
  }

  updateUserProfile(profile: UserProfile): Observable<any>{
    return this.http.put<any>(environment.baseUrl+'employees/'+this.associateId, profile, this.httpOptions);
  }

}
