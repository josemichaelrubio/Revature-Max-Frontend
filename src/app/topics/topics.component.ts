import { Component, OnInit} from '@angular/core';
import { take, filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { Notes } from '../models/notes';
import { NavChangeService } from 'app/services/nav-change.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {

  userId = JSON.parse(sessionStorage.getItem("user")!).id;
  userName = JSON.parse(sessionStorage.getItem("user")!).name;

  topic!: Topic;
  competency: number = 0;
  starredNotes: Notes | null = null;
  notes = new Array<Notes>();
  isEditing : boolean = false;
  selfNotes : Notes = {
    notesId: null,
    employee: {id: 0, name: ""},
    timesStarred: 0,
    content: ""
  };

  constructor(private router: Router, private topicService: TopicService, private nav: NavChangeService) {
    console.log("persisting navbar state");
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      if (event.url == '/topics') {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.topicService.getTopicDTO().subscribe(
      (res) => { 
        this.topic = res.topic;
        this.competency = res.competency || 0;
        var notes = res.notes;

        var selfIdx = notes.findIndex(e => e.employee.id == this.userId)
        if(selfIdx != -1)
          this.selfNotes = notes.splice(selfIdx, 1)[0];
        
        if(res.starredNotesId != null) {
          var starredNotesIdx = notes.findIndex(e => e.notesId == res.starredNotesId)
          if(starredNotesIdx != -1)
            this.starredNotes = notes.splice(starredNotesIdx, 1)[0];
        }
        this.notes = res.notes;
      }, (err) => {
        console.log(err);
      }
    );
  }

  updateCompetency(): void {
    console.log("Updating competency")
    let employeeTopic = { competency: this.competency, favNotes: this.starredNotes ? this.starredNotes.notesId : null };
    this.topicService.setEmployeeTopic(JSON.stringify(employeeTopic)).subscribe(
      (res) => {},
      (err) => {
        console.log(err);
      }
    );
  }

  updateStarredNotes(notesSelected: Notes): void {
    let employeeTopic = { competency: this.competency, favNotes: this.starredNotes ? this.starredNotes.notesId : null };
    this.topicService.setEmployeeTopic(JSON.stringify(employeeTopic)).subscribe(
      (res) => {
        if(notesSelected) {
          if(this.starredNotes) {
            this.starredNotes.timesStarred--;
          }
          notesSelected.timesStarred++;
          this.starredNotes = notesSelected;
        } else {
          this.starredNotes!.timesStarred--;
          this.starredNotes = null;
        }
      }, (err) => {
        console.log(err);
      }
    );
  }

  updateNotes(): void {
    let o = { "id": this.selfNotes.notesId ? this.selfNotes.notesId : null, "topic": { "id": this.topicService.selectedTopicId }, "notes": this.selfNotes.content };
    this.topicService.setNotes(JSON.stringify(o)).subscribe(
      (res) => {
        if (!this.selfNotes.notesId) {
          if (!res) {
            this.selfNotes.notesId = null;
          } else {
            this.selfNotes.notesId = res;
          }
        }
      }, (err) => {
        console.log(err);
      }
    );
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

}
