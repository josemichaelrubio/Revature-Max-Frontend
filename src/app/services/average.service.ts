import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BatchInfoAverages } from '../models/batch-info-averages';


@Injectable({
  providedIn: 'root'
})
export class AverageService {
 
  constructor(private http: HttpClient) {
   }

   httpOptions = {
    headers: new HttpHeaders({"Authorization": sessionStorage.getItem("token") || ''})
  };

  getBatchInfo(batchId: number): Observable<BatchInfoAverages>{
  	return this.http.get<BatchInfoAverages>(environment.baseUrl+`batches/${batchId}`);

  }
}
