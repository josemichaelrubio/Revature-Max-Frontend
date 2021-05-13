import { taggedTemplate } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/angular';
import { BatchDay } from 'app/models/batch-day';
import { Tech } from 'app/models/tech';
import { Topic } from 'app/models/topic';
import { CurriculumService } from 'app/services/curriculum.service';
import { TopicService } from 'app/services/topic.service';
import { filter } from 'rxjs/operators';
import * as jquery from 'jquery';
import { Quiz } from 'app/models/quiz';
import { QC } from 'app/models/qc';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css'],
})
export class CurriculumComponent implements OnInit {
  batchDays: BatchDay[] = [];
  techList: Tech[] = [];
  topicList: Topic[] = [];
  quizList: Quiz[] = [];
  qcList: QC[] = [];
  daysToUpdate: Set<BatchDay> = new Set();

  showDayModal: boolean = false;
  showEditButton: boolean = false;

  modalErrorText: string | undefined;

  formData!: FormGroup;
  formRemoveData!: FormGroup;
  day!: string;
  topicTitle!: string;
  tagIdBind!: string;
  topicNameClick!: string;
  topicIdClick!: string;
  topicDateClick!: string;
  topicTagId!: string;
  typeOfAddition!: string;
  topicColor="#72a4c2";
  quizColor="#f26925";
  qcColor="#FCB414";

  events = [{ id: '0', title: 'Start Date', date: '2021-03-01', tech: '0' , backgroundColor:'',borderColor:''}];

  @ViewChild('content') private contentRef!: TemplateRef<Object>;

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
          console.log(curDay);

          if (curDay.topics != null) {
            for (let topic of curDay.topics) {
              this.events.push({
                id: `${topic.id}`,
                title: topic.name,
                date: curDay.date,
                tech: `${topic.tech.id}`,
                backgroundColor:this.topicColor,
                borderColor:this.topicColor
              });
            }
          }
          // add quiz / qc
          if (curDay.quiz) {
            this.events.push({
              id: `${curDay.quiz.id}`,
              title: curDay.quiz.name,
              date: curDay.date,
              tech: 'quiz',
              backgroundColor:this.quizColor,
              borderColor:this.quizColor
            });
          }
          if (curDay.qc) {
            
            this.events.push({
              id: `${curDay.qc.id}`,
              title: curDay.qc.name,
              date: curDay.date,
              tech: 'QC',
              backgroundColor: this.qcColor,
              borderColor: this.qcColor,
            }
            );
          }
        }

        
        this.calendarOptions.events = this.events;

      },
      (err) => console.log(err),
      () => {
      }
    );

    // document
    //   .getElementById('exampleModalCenter')
    //   ?.addEventListener('hidden.bs.modal', () => {
    //     console.log('hidden.bs.modal event listener');

    //     this.modalErrorText = '';
    //   });
    // topicService.getAllTopics().subscribe((data) => (this.topicList = data));
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      topicName: new FormControl('Topic'),
      techId: new FormControl(0),
      eventDay: new FormControl('Day'),
    });
    this.formRemoveData = new FormGroup({
      topicName: new FormControl(this.topicNameClick),
      topicId: new FormControl(this.topicIdClick),
      topicDate: new FormControl(this.topicDateClick),
    });
  }
  handleDateClick(arg: any) {
    this.day = arg.dateStr;
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    editable: true,
    selectable: true,
    selectMirror: true,
    weekends: false, // initial value
  };

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
  }

  handleEventClick(arg: any) {
    this.topicIdClick = arg.event._def.sourceId;
    this.topicNameClick = arg.event._def.title;
    this.topicTagId = arg.event._def.extendedProps.tag;
    console.log(this.batchDays);
  }

  loadTopics(val: any) {
    this.topicService
      .getTopicsForTech(val.value)
      .subscribe((data) => (this.topicList = data));
  }

  loadDataForAdditions(val: any) {
    const type = val.value;
    if (type == 'Topic') this.loadTechs();
    else if (type == 'Quiz') this.loadQuizzes();
    else if (type == 'QC') this.loadQC();
  }

  loadTechs() {
    this.topicService.getAllTags().subscribe((data) => (this.techList = data));
  }

  loadQuizzes() {
    this.curriculumService
      .getAllQuizzes()
      .subscribe((data) => (this.quizList = data));
  }

  loadQC() {
    this.curriculumService
      .getAllQCs()
      .subscribe((data) => (this.qcList = data));
  }

  removeErrorText() {
    this.modalErrorText = undefined;
  }

  /**
   * Updates this.batchDays when a topic is moved from one day to another
   * @param arg
   * @returns
   */
  handleEventDrop(arg: any) {
    // get the days the topic is moved from / to
    const initDate = arg.oldEvent._instance.range.start
      .toISOString()
      .split('T')[0];
    const destDate = arg.event._instance.range.start
      .toISOString()
      .split('T')[0];
    const initDay: BatchDay | undefined = this.batchDays.find(
      (curr) => curr.date == initDate
    );
    let destDay: BatchDay | undefined = this.batchDays.find(
      (curr) => curr.date == destDate
    );

    if (!initDay) {
      console.error('initDay undefined');
      return;
    }

    if (!destDay) {
      let batchId = sessionStorage.getItem('userBatchId')!;
      destDay = new BatchDay(
        <number>(<unknown>undefined),
        +batchId,
        destDate,
        [],
        <Quiz>(<unknown>undefined),
        <QC>(<unknown>undefined)
      );
      this.batchDays.push(destDay);
    }

    // move topic or quiz in curriculum[]
    if (arg.event._def.extendedProps.tech == 'quiz') {
      if (destDay.quiz) {
        console.log('Day already has a quiz, exiting');
        arg.revert();
        return;
      }
      const movedQuiz: Quiz = initDay?.quiz;
      initDay.quiz = <Quiz>(<unknown>undefined);
      destDay.quiz = movedQuiz;
    } else if (arg.event._def.extendedProps.tech == 'QC') {
      if (destDay.qc) {
        console.log('Day already has a qc, exiting');
        arg.revert();
        return;
      }
      const movedQuiz: QC = initDay?.qc;
      initDay.qc = <QC>(<unknown>undefined);
      destDay.qc = movedQuiz;
    } else {
      const movedTopic: Topic | undefined = initDay?.topics.find(
        (topic) => topic.name == arg.event._def.title
      );
      if (!movedTopic) {
        return;
      }
      initDay?.topics.splice(
        initDay.topics.findIndex((e) => e.id == movedTopic.id)
      );
      destDay?.topics.push(movedTopic);
    }

    // change this.events date
    const movedEvent = this.events.find(
      (event) => event.title == arg.event._def.title
    );
    if (!movedEvent) return;
    let f = this.events.map((e) => e.title).indexOf(arg.event._def.title);
    movedEvent.date = destDate;
    // this.events[f].date = destDate;

    console.log('(eventDrop) Event: ', movedEvent);
    console.log('(eventDrop) events[f] ', this.events[f]);

    console.log('(eventdrop) List of events: ', this.events);

    // Mark what days are updated so when we save changes it keeps the number of requests to a minimum
    if (!this.daysToUpdate.has(initDay)) this.daysToUpdate.add(initDay);
    if (!this.daysToUpdate.has(destDay)) this.daysToUpdate.add(destDay);
    console.log('(eventDrop) initDay ', initDay);
    console.log('(eventDrop) destDay ', destDay);
  }

  addTopic(val: any) {
    const topicId = val.target[1].value;
    const topicToAdd: Topic | undefined = this.topicList.find(
      (topic) => topic.id == topicId
    );

    if (!topicToAdd) {
      return;
    }
    if (this.events.find((e) => e.title == topicToAdd.name)) {
      console.log(
        'The topic already exists in the curriculum. For now, just refusing to add it'
      );
      this.modalErrorText = 'Can not add a duplicate topic to curriculum';
      return;
    }

    // add to this.curriculum appropriate day (create one if necessary)
    let destDay = this.batchDays.find(
      (curriculum) => curriculum.date == this.day
    );
    if (!destDay) {
      let batchId = sessionStorage.getItem('userBatchId');
      if (!batchId) return;
      destDay = new BatchDay(
        <number>(<unknown>undefined),
        +batchId,
        this.day,
        [],
        <Quiz>(<unknown>undefined),
        <QC>(<unknown>undefined)
      );
    }
    destDay.topics.push(topicToAdd);

    /*
      Refresh the calendar
        When resetting calendarOptions.events, the assigned array must be a new array, or it doesn't
        refresh the calendar. I'd like a more efficient option but the jquery calendar.fullCalender just wasn't working.
    */
    let newEvents = [];
    this.events.forEach((event) => newEvents.push(event));
    newEvents.push({
      id: `${topicToAdd.id}`,
      title: topicToAdd.name,
      date: this.day,
      tech: `${topicToAdd.tech.id}`,
      backgroundColor:this.topicColor,
      borderColor:this.topicColor
    });
    this.events = newEvents;
    this.calendarOptions.events = newEvents;

    // console.log('(addTopic) destDay ', destDay);
    // console.log('(addTopic) events ', this.events);

    // add day to update set
    if (!this.daysToUpdate.has(destDay)) this.daysToUpdate.add(destDay);
    console.log(destDay);
  }

  addQuiz(arg: any) {
    const quizId = arg.target[0].value;
    const quizToAdd: Quiz | undefined = this.quizList.find(
      (quiz) => quiz.id == quizId
    );

    if (this.events.find((e) => e.title == quizToAdd?.name)) {
      console.log(
        'The quiz already exists in the curriculum. For now, just refusing to add it'
      );
      this.modalErrorText = 'Quiz already exists in curriculum';
      return;
    }

    // add to this.curriculum appropiate day
    let batchDay = this.batchDays.find((curr) => curr.date == this.day);
    if (!batchDay) {
      let batchId = sessionStorage.getItem('userBatchId');
      if (!batchId) return;
      batchDay = new BatchDay(
        <number>(<unknown>undefined),
        +batchId,
        this.day,
        [],
        <Quiz>(<unknown>undefined),
        <QC>(<unknown>undefined)
      );
    }
    if (batchDay.quiz || !quizToAdd) {
      console.log("Quiz already present on that day, can't add");
      this.modalErrorText = 'Can not add a second quiz to this day';

      return;
    }
    batchDay.quiz = quizToAdd;

    // Refresh the calendar
    // Refer to above method (addTopic) for why I don't like this but it's here anyway
    let newEvents = [];
    this.events.forEach((event) => newEvents.push(event));
    newEvents.push({
      id: `${quizToAdd.id}`,
      title: quizToAdd.name,
      date: this.day,
      tech: `quiz`,
      backgroundColor:this.quizColor,
      borderColor:this.quizColor
 
    });
    this.events.push({
      id: `${quizToAdd.id}`,
      title: quizToAdd.name,
      date: this.day,
      tech: `quiz`,
      backgroundColor:this.quizColor,
      borderColor:this.quizColor
    });
    this.calendarOptions.events = newEvents;

    // console.log('(addQuiz) ', batchDay);
    // add day to update set
    if (!this.daysToUpdate.has(batchDay)) this.daysToUpdate.add(batchDay);
    console.log(batchDay);
  }

  addQC(arg: any) {
    console.log(arg);
    const qcId = arg.target[0].value;
    const qcToAdd: QC | undefined = this.qcList.find((qc) => qc.id == qcId);
    if (this.events.find((e) => e.title == qcToAdd?.name)) {
      console.log(
        'The qc already exists in the curriculum. For now, just refusing to add it'
      );
      this.modalErrorText = 'QC already exists in curriculum';
      return;
    }

    // add to this.curriculum appropiate day
    let batchDay = this.batchDays.find((curr) => curr.date == this.day);
    if (!batchDay) {
      let batchId = sessionStorage.getItem('userBatchId');
      if (!batchId) return;
      batchDay = new BatchDay(
        <number>(<unknown>undefined),
        +batchId,
        this.day,
        [],
        <Quiz>(<unknown>undefined),
        <QC>(<unknown>undefined)
      );
    }
    if (batchDay.qc || !qcToAdd) {
      console.log("QC already present on that day, can't add");
      this.modalErrorText = 'Can not add a second qc to this day';
      return;
    }
    batchDay.qc = qcToAdd;

    // Refresh the calendar
    // Refer to above method (addTopic) for why I don't like this but it's here anyway
    let newEvents = [];
    this.events.forEach((event) => newEvents.push(event));
    newEvents.push({
      id: `${qcToAdd.id}`,
      title: qcToAdd.name,
      date: this.day,
      tech: `QC`,
      backgroundColor: this.qcColor,
      borderColor: this.qcColor,
    });
    this.events.push({
      id: `${qcToAdd.id}`,
      title: qcToAdd.name,
      date: this.day,
      tech: `QC`,
      backgroundColor: this.qcColor,
      borderColor: this.qcColor,
    });
    this.calendarOptions.events = newEvents;

    // add day to update set
    if (!this.daysToUpdate.has(batchDay)) this.daysToUpdate.add(batchDay);
    console.log(batchDay);
  }

  saveTopic(topic: any) {
    this.topicIdClick = topic.id;
  }

  removeTopic() {
    const removedEvent = this.events.find(
      (event) => event.title == this.topicNameClick
    );
    let newEvents: any = [];
    this.events.forEach((event) => {
      if (
        !(
          event.title == removedEvent?.title && event.date == removedEvent?.date
        )
      ) {
        newEvents.push(event);
      }
    });
    this.events = newEvents;
    this.calendarOptions.events = newEvents;
    let curDay: BatchDay | undefined = this.batchDays.find(
      (curr) => curr.date == removedEvent?.date
    );
    if (curDay) {
      if (removedEvent?.tech == 'quiz') {
        const batchDayToRemoveFrom = this.batchDays.find(
          (curr) => curr.date == removedEvent.date
        );
        if (batchDayToRemoveFrom) {
          batchDayToRemoveFrom.quiz = <Quiz>(<unknown>undefined);
        }
      } else if (removedEvent?.tech == 'QC') {
        const batchDayToRemoveFrom = this.batchDays.find(
          (curr) => curr.date == removedEvent.date
        );
        if (batchDayToRemoveFrom) {
          batchDayToRemoveFrom.qc = <QC>(<unknown>undefined);
        }
      } else {
        this.batchDays
          .find((curr) => curr.date == removedEvent?.date)
          ?.topics.splice(
            curDay.topics.findIndex((e) => e.name == removedEvent?.title)
          );
      }
    }
    console.log('(remove) curDay events: ', curDay);
    console.log('(remove) curriculum after removing: ', this.batchDays);
    console.log('(remove) events: ', this.events);

    // add day to update set
    if (curDay && !this.daysToUpdate.has(curDay)) this.daysToUpdate.add(curDay);
    console.log(curDay);
  }

  updateBackend() {
    console.log(this.daysToUpdate);
    for (const day of this.daysToUpdate) {
      console.log('updating day ', day);
      this.curriculumService
        .setBatchDay(day)
        .subscribe((val) => console.log('setBatchDay callback', val));
    }
    this.daysToUpdate.clear();
  }
}
