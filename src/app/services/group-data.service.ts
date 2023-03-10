import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupDataService {


  batchId: number = +(sessionStorage.getItem("userBatchId") || 0);
  token: string = sessionStorage.getItem("token") || '';

  batchUrl: string = environment.baseUrl+`/batches/${this.batchId}`;
  batchAssociatesUrl: string = environment.baseUrl+`/batches/${this.batchId}/associates`;

  testBatchUrl: string = "http://localhost:80/batches/1/associates";

  constructor(private http: HttpClient) { }

  getAllAssociates(): Observable<any[]>{
    const httpOptions = {
    headers: new HttpHeaders({"Authorization": this.token, "Content-Type":"application/json"})
  };
    return this.http.get<any[]>(environment.baseUrl + `/batches/${this.batchId}/associates`, httpOptions);
  }


  addAssociates(associates: any[]): Observable<any[]>{
    const httpOptions = {
    headers: new HttpHeaders({"Authorization": this.token, "Content-Type":"application/json"})
  };
    return this.http.post<User[]>(this.batchAssociatesUrl, associates, httpOptions);
  }

  removeAssociate(associate: User): Observable<any>{
    const httpOptions = {
    headers: new HttpHeaders({"Authorization": this.token, "Content-Type":"application/json"})
  };
    return this.http.delete<any>(this.batchAssociatesUrl+`/${associate.id}`, httpOptions);
  }

  setQCFeedbackForEmployee(employeeId: number, qcId: number, instructorFeedback: number) : Observable<any> {
    const payload = `instructor-feedback=${instructorFeedback}`
    const httpOptions = {headers: new HttpHeaders({"Authorization": this.token, "Content-Type":"application/x-www-form-urlencoded"})};
    return this.http.put(environment.baseUrl + `employees/${employeeId}/qcs/${qcId}/instructor-feedback`, payload, httpOptions)

  }


  getQCsFromBatch() : Observable<any> {
    const httpOptions = {
    headers: new HttpHeaders({"Authorization": this.token})
  };
    return this.http.get<any[]>(environment.baseUrl + "/curriculum/qcs", httpOptions);
  }


  getQCFeedbackScores(employeeIds: number[]) : Observable<any> {
    const httpOptions = {
    headers: new HttpHeaders({"Authorization": this.token})
  };

  return this.http.get<any[]>(environment.baseUrl + `/employees?id=${employeeIds.toString()}&field=qc-feedbacks`, httpOptions);
  }


}

