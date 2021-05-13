import { Component, OnDestroy, OnInit} from '@angular/core';
import { take, filter } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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

  topic: string = "";
  competency: number = 0;
  starredNotes: Notes | null = null;
  notes = new Array<Notes>();
  isEditing : boolean = false;
  selfNotes : Notes = {
    id: null,
    employee: {id: 0, name: ""},
    votes: 0,
    content: ""
  };


  constructor(private router : ActivatedRoute, private topicService: TopicService) {
    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
    //   if (event.url == '/topics') {
    //     this.ngOnInit();
    //   }
    // });
    this.router.params.subscribe(params => {
      topicService.selectedTopicId.next(+params['id'])
      topicService.selectedTopicName.next(params["name"])
    })
    // if(topicService.selectedTopicId.getValue() == 0) {
    //   router.navigate(['/batch/curriculum'])
    // }
  }

  ngOnInit(): void {
    this.topicService.getTopicDTO().subscribe(
      (res) => {
        this.competency = res.competency || 0;
        var notes = res.notes;

        var selfIdx = notes.findIndex(e => e.employee.id == this.userId)
        if(selfIdx != -1)
          this.selfNotes = notes.splice(selfIdx, 1)[0];
        
        if(res.fav_notes_id != null) {
          var starredidx = notes.findIndex(e => e.id == res.fav_notes_id)
          if(starredidx != -1)
            this.starredNotes = notes.splice(starredidx, 1)[0];
        }
        this.notes = res.notes.sort((a,b) => b.votes - a.votes);
      }, (err) => {
        console.log(err);
      }
    );

    this.topicService.selectedTopicName.asObservable()
    .subscribe((val) => {
      this.topic = val;
    })
  }

  updateCompetency(): void {
    console.log("Updating competency")
    let employeeTopic = { competency: this.competency, favNotes: this.starredNotes ? this.starredNotes.id : null };
    this.topicService.setEmployeeTopic(JSON.stringify(employeeTopic)).subscribe(
      (res) => {},
      (err) => {
        console.log(err);
      }
    );
  }

  updateStarredNotes(notesSelected: Notes | null): void {
    let employeeTopic = { competency: this.competency, favNotes: notesSelected ? notesSelected.id : null };
    this.topicService.setEmployeeTopic(JSON.stringify(employeeTopic)).subscribe(
      (res) => {
        if(this.starredNotes) {
          this.starredNotes.votes--;
          this.notes.push(this.starredNotes!);
          this.notes = this.notes.sort((a,b) => b.votes - a.votes);
        }
        if(notesSelected) {
          notesSelected.votes++;
          this.starredNotes = notesSelected;
          var starredidx = this.notes.findIndex(e => e.id == this.starredNotes!.id)
          this.starredNotes = this.notes.splice(starredidx, 1)[0];
        } else {
          this.starredNotes = null;
        }
      }, (err) => {
        console.log(err);
      }
    );
  }

  updateNotes(): void {

    var text = (<HTMLTextAreaElement>document.getElementById("selfNotes-content")).value;
    let o = { id: this.selfNotes.id ? this.selfNotes.id : null, topicId:this.topicService.selectedTopicId.getValue() , content: text };
    console.log(o);
    this.topicService.setNotes(JSON.stringify(o)).subscribe(
      (res) => {
        this.isEditing = false;
        this.selfNotes.content = text;
        this.selfNotes.id = +res;
      }, (err) => {
        console.log(err);
      }
    );
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
