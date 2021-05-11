import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { EventInput } from '@fullcalendar/angular';
import { BatchDay } from 'app/models/batch-day';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  initialEvents: EventInput[] = [];

  token: string = sessionStorage.getItem('token') || '';

  batchId: number = +(sessionStorage.getItem('userBatchId') || 1);

  constructor(private http: HttpClient) {}

  httpOptions = { headers: new HttpHeaders({ Authorization: this.token }) };

  getBatchDays(): Observable<any> {
    return this.http.get<any>(
      environment.baseUrl + `batch-days?batch=${this.batchId}`,
      this.httpOptions
    );
  }

  setBatchDay(batchDay: BatchDay) {
    let headers = new HttpHeaders({
      Authorization: sessionStorage.getItem('token') || '',
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(environment.baseUrl + `batch-days`, batchDay, {
      headers: headers,
    });
  }

  getAllQuizzes() {
    return this.http.get<any>(
      environment.baseUrl + 'curriculum/quizzes',
      this.httpOptions
    );
  }

  getAllQCs() {
    return this.http.get<any>(
      environment.baseUrl + 'curriculum/qcs',
      this.httpOptions
    );
  }
}
