import { taggedTemplate } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/angular';
import { Curriculum } from 'app/models/curriculum';
import { Tag } from 'app/models/tag';
import { Topic } from 'app/models/topic';
import { CurriculumService } from 'app/services/curriculum.service';
import { TopicService } from 'app/services/topic.service';
import { filter } from 'rxjs/operators';
import * as jquery from 'jquery';
import { Quiz } from 'app/models/quiz';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css'],
})
export class CurriculumComponent implements OnInit {
  showDayModal: boolean = false;
  showEditButton: boolean = false;
  curriculum: Curriculum[] = [];
  formData!: FormGroup;
  formRemoveData!: FormGroup;
  day!: string;
  topicTitle!: string;
  tagList: Tag[] = [];
  fullTopicList: Topic[] = [];
  topicList: Topic[] = [];
  tagIdBind!: string;
  topicNameClick!: string;
  topicIdClick!: string;
  topicDateClick!: string;
  topicTagId!: string;

  events = [{ id: '0', title: 'Start Date', date: '2021-03-01', tag: '0' }];

  @ViewChild('content') private contentRef!: TemplateRef<Object>;

  constructor(
    private topicService: TopicService,
    private router: Router,
    private curriculumService: CurriculumService
  ) {
    curriculumService.getCurriculumDays().subscribe(
      (data) => {
        this.curriculum = data;
        for (let curDay of this.curriculum) {
          if (curDay.topics != null) {
            for (let topic of curDay.topics) {
              this.events.push({
                id: `${topic.id}`,
                title: topic.name,
                date: curDay.date,
                tag: `${topic.tag.id}`,
              });

              if (topic.name == 'Annotations') console.log(topic);
            }
          }
          // add quiz / qc
          if (curDay.quizzes.length > 0) {
            console.log(
              `Day ${curDay.date} has a quiz ${curDay.quizzes[0].name}`
            );
            this.events.push({
              id: `${curDay.quizzes[0].id}`,
              title: curDay.quizzes[0].name,
              date: curDay.date,
              tag: '-1',
            });
          }
        }
        this.calendarOptions.events = this.events;
      },
      (err) => console.log(err),
      () => {
        console.log('yay curriculum: ', this.curriculum);
        console.log('yay events: ', this.events);
      }
    );

    // topicService.getAllTopics().subscribe((data) => (this.topicList = data));
  }

  ngOnInit(): void {
    this.topicService
      .getAllTopics()
      .subscribe((data) => (this.fullTopicList = data));

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
    // alert('date click! ' + arg.dateStr)
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
  }

  loadTags() {
    this.topicService.getAllTags().subscribe((data) => (this.tagList = data));
  }

  loadTopics(val: any) {
    this.topicList = this.fullTopicList.filter(
      (topic) => topic.tag.id == val.value
    );
  }

  /**
   * Updates this.curriculum when a topic is moved from one day to another
   * @param arg
   * @returns
   */
  handleEventDrop(arg: any) {
    // get the days the topic is moved from / to
    const initDay: Curriculum | undefined = this.curriculum.find(
      (curr) =>
        curr.date ==
        arg.oldEvent._instance.range.start.toISOString().split('T')[0]
    );
    console.log(initDay);
    const destDay: Curriculum | undefined = this.curriculum.find(
      (curr) =>
        curr.date == arg.event._instance.range.start.toISOString().split('T')[0]
    );
    console.log(destDay);

    if (!initDay || !destDay) {
      console.error('initDay or destDay undefined');
      return;
    }

    // move topic or quiz in curriculum[]
    if (arg.event._def.extendedProps.tag == '-1') {
      const movedQuiz: Quiz = initDay?.quizzes[0];
      console.log(movedQuiz);

      initDay.quizzes = [];
      destDay.quizzes[0] = movedQuiz;
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

    // console.log(initDay);
    // console.log(destDay);

    // TODO: Mark what days are updated so when we save changes it keeps the number of requests to a minimum
    // Can add this when getting backend requets set up
  }

  addTopic(val: any) {
    console.log(val.target[0].value);
    console.log(val.target[1].value);
    // const techId = val.target[0].value;
    const topicId = val.target[1].value;
    // add topic to the calendar at this.day
    const topicToAdd: Topic | undefined = this.fullTopicList.find(
      (topic) => topic.id == topicId
    );
    console.log('add');
    console.log(topicToAdd);
    console.log('to day');
    console.log(this.day);

    if (!topicToAdd) {
      return;
    }
    // add to this.curriculum appropriate day
    this.curriculum
      .find((curriculum) => curriculum.date == this.day)
      ?.topics.push(topicToAdd);
    console.log(this.curriculum);

    // // add to the calendar
    // this.events.push({
    //   id: `${topicToAdd.id}`,
    //   title: topicToAdd.name,
    //   date: this.day,
    //   tag: `${topicToAdd.tag.id}`,
    // });
    // this.calendarOptions.events = this.events;
    // console.log(this.events);
    // // (<any>$('#calendar')).fullCalendar('renderEvents', this.events, true);
    // console.log($('#calendar'));
    // (<any>$('#calendar')).fullCalendar('refetchEvents');

    let newEvents = [];
    this.events.forEach((event) => newEvents.push(event));
    newEvents.push({
      id: `${topicToAdd.id}`,
      title: topicToAdd.name,
      date: this.day,
      tag: `${topicToAdd.tag.id}`,
    });
    this.events.push({
      id: `${topicToAdd.id}`,
      title: topicToAdd.name,
      date: this.day,
      tag: `${topicToAdd.tag.id}`,
    });
    this.calendarOptions.events = newEvents;
    console.log(newEvents);
  }

  saveTopic(topic: any) {
    this.topicIdClick = topic.id;
  }

  removeTopic() {
    const removedEvent = this.events.find((event) => event.title == this.topicNameClick);
    if (removedEvent?.tag == '-1') {
      return;
    }
    let newEvents: any = [];
    this.events.forEach(event => {
      if (!(event.title == removedEvent?.title && event.date == removedEvent?.date)) {
        newEvents.push(event);
      }
    });
    this.events = newEvents;
    this.calendarOptions.events = this.events;
    let curDay: Curriculum | undefined = this.curriculum
      .find((curr) => curr.date == removedEvent?.date);
    if (curDay) {
      this.curriculum
        .find((curr) => curr.date == removedEvent?.date)
        ?.topics.splice(curDay.topics.findIndex((e) => e.name == removedEvent?.title));
    }
    console.log('curDay events: ', curDay)
    console.log('curriculum after removing: ', this.curriculum)
    console.log('events: ', this.events)
    }
}
