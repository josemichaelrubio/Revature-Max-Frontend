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

  testBatchUrl: string = "http://localhost:80/batches/1/associates"

  httpOptions = {
    headers: new HttpHeaders({"Authorization": this.token})
  };

  constructor(private http: HttpClient) { }

  getAllAssociates(): Observable<User[]>{
    return this.http.get<User[]>(this.batchAssociatesUrl)
  }

  addAssociates(associates: User[]): Observable<User[]>{
    return this.http.post<User[]>(this.batchAssociatesUrl, associates, this.httpOptions);
  }

  removeAssociate(associate: User): Observable<any>{
    return this.http.delete<any>(this.batchAssociatesUrl+`/${associate.id}`, this.httpOptions);
  }


}
