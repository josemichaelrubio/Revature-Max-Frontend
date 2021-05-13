import { Component, OnInit } from '@angular/core';
import { AssociateDataService } from '../../services/associate-data.service';
import { AssociateQuiz } from '../../models/associate-quiz';
import { EmployeeInfo } from '../../models/employee-info';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  ChartOptions,
  ChartType,
  ChartDataSets,
  RadialChartOptions,
} from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-competencies',
  templateUrl: './competencies.component.html',
  styleUrls: ['./competencies.component.css'],
})
export class CompetenciesComponent implements OnInit {
  employeeInfo!: any;
  associateQuizzes: any[] = [];
  techCompAvg: any = [];
  techCompetencies: any = {};
  techNames: string[] = [];
  qcFeedbacks: any[] = [];

  associateQuizScoresDataSet: number[] = [];
  quizNames: string[] = [];

  constructor(private associateDataService: AssociateDataService) {
    this.associateDataService.getEmployeeInfo().subscribe(
      (response: EmployeeInfo) => {
        this.employeeInfo = response;
        this.associateQuizzes = this.employeeInfo.quizScores;
      },
      (error) => console.log('Error occured'),
      () => {
        console.log(this.associateQuizzes);
        console.log(this.associateQuizzes[0].quiz.name);
      }
    );

    associateDataService
      .getEmployeeInfo()
      .pipe(take(1))
      .subscribe(
        (response: EmployeeInfo) => {
          console.log(response);
          this.employeeInfo = response;
          this.qcFeedbacks = this.employeeInfo.qcFeedbacks;

          for (let empQuiz of this.employeeInfo.quizScores) {
            this.quizNames.push(empQuiz.name);
            this.associateQuizScoresDataSet.push(empQuiz.score);
          }

          //.associateQuizScoresDataSet.push(50, 100);

          for (let empTopic of this.employeeInfo.topicCompetencies) {
            if (!(empTopic.techName in this.techCompetencies)) {
              this.techCompetencies[empTopic.techName] = [];
              this.techCompetencies[empTopic.techName].push(
                empTopic.competency
              );
            } else {
              this.techCompetencies[empTopic.techName].push(
                empTopic.competency
              );
            }
          }

          for (let technologyName in this.techCompetencies) {
            this.techNames.push(technologyName);
            let length = this.techCompetencies[technologyName].length;
            let sum = 0;
            for (let i = 0; i < length; i++) {
              sum += this.techCompetencies[technologyName][i];
            }
            let average = (sum / length).toPrecision(2);
            console.log(average);
            this.techCompAvg.push(average);
          }

          console.log(this.techCompAvg);
        },

        (error) => console.log(error),
        () => console.log(this.employeeInfo)
      );
  }

  ngOnInit(): void {}

  quizId!: number;
  setQuizId(quizId: number) {
    this.quizId = quizId;
    console.log(this.quizId);
  }

  score: number = 0;
  setScore(score: number) {
    this.score = score;
    console.log(this.score);
    let o = { score: score };
    this.associateDataService.setEmployeeQuiz(JSON.stringify(o), this.quizId);
  }


  radarChartOptions: RadialChartOptions = {
      legend: {
        labels: {
            fontSize: 16
        }
    },
    responsive: true,
    scale: {
      pointLabels: {
        fontSize: 16
      },
      ticks: {
        min: 0,
        max: 5,
        stepSize: 1,
        fontSize: 16
      },
    },
  };
  radarChartLabels: Label[] = this.techNames;

  radarChartData: ChartDataSets[] = [
    {
      data: this.techCompAvg,
      label: 'Associate Topic Competency Analysis',
      backgroundColor: 'rgba(248, 148, 6, 0.2)',
      borderColor: 'rgba(248, 148, 6, 1)',
    },
  ];

  radarChartType: ChartType = 'radar';

  lineChartData: ChartDataSets[] = [
    { data: this.associateQuizScoresDataSet, label: 'Quiz Score' },
  ];

  lineChartLabels: Label[] = this.quizNames;

  lineChartOptions = {
    responsive: true,
    legend: {
        labels: {
            fontSize: 16
        }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontSize: 16
        }
      }],
      yAxes: [{
        ticks: {
          fontSize: 16
        }
      }]
      
    }
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'rgba(248, 148, 6, 1)',
      backgroundColor: 'rgba(248, 148, 6, 0.2)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';
}
