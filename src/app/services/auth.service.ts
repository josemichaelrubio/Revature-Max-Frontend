import { UserRegistration } from './../models/user-registration';
import { LoginResponse } from './../models/login-response';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { UserProfile } from 'app/models/user-profile';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl: string = environment.baseUrl+"login";
  authSubject = new BehaviorSubject(false);// tracks the user's authorization state
  token: string | null | undefined;
  user: any;
  batchId: any;
  headers = new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
  authHeaders = new HttpHeaders({"Authorization":sessionStorage.getItem("token") || ''})
  isLoggedIn: boolean = false;
  isTrainer: boolean = false;
  isAssigned: boolean = false;
  registerUrl: string = environment.baseUrl+"register";

  constructor(private http: HttpClient, private router:Router) {
  }

  getToken(): any{
    if (this.token==null){
      this.token = sessionStorage.getItem("token");
    }
    return this.token;
  }

  getUser(): any{
    if(this.user==null){
      this.user = sessionStorage.getItem("user");
    }
    return this.user;
  }

  getBatchId(): any{
    if(this.batchId==null){
      this.batchId = +(sessionStorage.getItem("userBatchId") || 0);
    }
    return this.batchId;
  }
  attemptLogin(email: string, password: string ):Observable<HttpResponse<LoginResponse>>{
    const payload = `email=${email}&password=${password}`
    return this.http.post<LoginResponse>(this.loginUrl,payload, {headers: this.headers, observe: 'response'});
  }

  registerNewEmployee(name: string, email: string, password: string):Observable<UserRegistration>{
    const payload = `name=${name}&email=${email}&password=${password}`
    return this.http.post<any>(this.registerUrl,payload, {headers: this.headers});
  }

  getEmployeeProfile(empId: string, token:string): Observable<UserProfile>{
    return this.http.get<UserProfile>(environment.baseUrl+'employees/'+empId, {headers: new HttpHeaders({"Authorization": token})});
  }

  getBatch(employeeId: string, token: string): Observable<any>{
    return this.http.get<any>(environment.baseUrl+'batches/'+employeeId+'/batch', {headers:  new HttpHeaders({"Authorization": token})});
  }


}
