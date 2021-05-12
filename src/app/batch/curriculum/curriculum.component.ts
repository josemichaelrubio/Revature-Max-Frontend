import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/common';
import { BatchDay } from 'app/models/batch-day';
import { CurriculumService } from 'app/services/curriculum.service';
import { TopicService } from 'app/services/topic.service';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css'],
})
export class CurriculumComponent implements OnInit {
  showDayModal: boolean = false;
  showEditButton: boolean = false;
  batchDays: BatchDay[] = [];
  formData!: FormGroup;
  day!: string;
  topicTitle!: string;
  topicColor="#72a4c2";
  quizColor="#f26925";
  qcColor="#FCB414";
  //events = [{ id: '0', title: 'Start Date', date: '2021-03-01' }];
  events = [{ id: '0', title: 'Start Date', date: '2021-03-01', backgroundColor:'',borderColor:''}];

  constructor(
    private topicService: TopicService,
    private router: Router,
    private curriculumService: CurriculumService
  ) {
    this.calendarOptions.buttonText={today:"Today"};
    curriculumService.getBatchDays().subscribe(
      (data) => {
        this.batchDays = data;
        for (let curDay of this.batchDays) {
          if (curDay.topics != null) {
            for (let topic of curDay.topics) {
              this.events.push({
                id: `${topic.id}`,
                title: topic.name,
                date: curDay.date,
                backgroundColor:this.topicColor,
                borderColor:this.topicColor
              });
            }
          }
          console.log(curDay); ////TESTING LOG
          // add quiz / qc
          if (curDay.quiz) {
            this.events.push({
              id: `${curDay.quiz.id}`,
              title: curDay.quiz.name,
              date: curDay.date,
              backgroundColor:this.quizColor,
              borderColor:this.quizColor
            });
          }
          if (curDay.qc) {
            this.events.push({
              id: `${curDay.qc.id}`,
              title: curDay.qc.name,
              date: curDay.date,
              backgroundColor: this.qcColor,
              borderColor: this.qcColor,
            });
          }
        }
        this.calendarOptions.events = this.events;
      },
      (err) => console.log(err),
      () => {
        console.log(this.batchDays);
      }
    );
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      topicName: new FormControl('Topic'),
      eventDay: new FormControl('Day'),
    });
  }
  handleDateClick(arg: any) {
    // alert('date click! ' + arg.dateStr)
    this.day = arg.dateStr;
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this),
    selectable: true,
    selectMirror: true,
    weekends: false, // initial value
  };

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
  }

  handleEventClick(arg: any) {
    console.log(arg);
    this.topicService.selectedTopicId = +arg.event._def.publicId;
    this.router.navigateByUrl('/topics');
  }

  checkTopicOne() {
    this.topicService.selectedTopicId = 1;
    this.router.navigateByUrl('/topics');
  }
}
