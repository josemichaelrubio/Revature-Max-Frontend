import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BatchInfoAverages } from '../../models/batch-info-averages';
import { EmployeeInfo } from '../../models/employee-info';
import { AssociateDataService } from '../../services/associate-data.service';
import { AverageService } from '../../services/average.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-averages',
  templateUrl: './averages.component.html',
  styleUrls: ['./averages.component.css'],
})
export class AveragesComponent implements OnInit {
  batchInfoAverages!: any;
  employeeInfo!: any;

  batchId: number = +(sessionStorage.getItem('userBatchId') || '');

  quizAveragesDataSet: number[] = [];
  quizLabels: string[] = [];
  countForQuiz: number[] = [];

  topicAveragesDataSet: number[] = [];
  topicLabels: string[] = [];
  countForTopics: number[] = [];

  techCompAvg: any = [];
  techCompetencies: any = {};

  associateQuizScoresDataSet: number[] = [];

  constructor(
    private averageService: AverageService,
    private associateDataService: AssociateDataService
  ) {
    this.averageService
      .getBatchInfo(this.batchId)
      .pipe(take(1))
      .subscribe(
        (response) => {
          console.log(response);
          this.batchInfoAverages = response;
          let quizAvg = this.batchInfoAverages.quizAverage;
          for (let quizId of Object.keys(quizAvg)) {
            console.log(+(quizAvg[quizId][1]));
            this.quizAveragesDataSet.push(+(quizAvg[quizId][1]));
            this.quizLabels.push(quizAvg[quizId][0] + ' (count: ' + quizAvg[quizId][2] + ')');
             this.countForQuiz.push(+(quizAvg[quizId][2]));
          }

          this.quizAveragesDataSet.push(0, 100);

          let topicCompAvg = this.batchInfoAverages.competencyAverage
          for (let topicId of Object.keys(topicCompAvg)) {
            this.topicAveragesDataSet.push(+(topicCompAvg[topicId][1]));
            this.topicLabels.push((topicCompAvg[topicId][0]) + ' (count: ' +
                topicCompAvg[topicId][2] + ')');
            this.countForTopics.push(+(topicCompAvg.competenciesCounted));
          }

          this.topicAveragesDataSet.push(0, 5);
        },
        (error) => console.log('There is an error'),
        () => console.log(this.batchInfoAverages)
      );


      associateDataService
      .getEmployeeInfo()
      .pipe(take(1))
      .subscribe(
        (response: EmployeeInfo) => {
          console.log(response);
          this.employeeInfo = response;
          for (let empQuiz of this.employeeInfo.quizScores) {
            this.associateQuizScoresDataSet.push(empQuiz.score);
          }

          this.associateQuizScoresDataSet.push(0, 100);

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

  barChartOptionsQuizzes: ChartOptions = {
    responsive: true,
  };
  barChartLabelsQuizzes: Label[] = this.quizLabels;
  barChartTypeQuizzes: ChartType = 'bar';
  barChartLegendQuizzes = true;
  barChartPluginsQuizzes = [];

  barChartDataQuizzes: ChartDataSets[] = [
    {
      data: this.associateQuizScoresDataSet,
      label: 'Your Score',
      backgroundColor: 'rgba(248, 148, 6, 1)',
      hoverBackgroundColor: 'rgba(214, 116, 4, 0.6)',
    },
    {
      data: this.quizAveragesDataSet,
      label: 'Quiz Average for Batch',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      hoverBackgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  ];

  barChartOptionsTopics: ChartOptions = {
    responsive: true,
  };
  barChartLabelsTopics: Label[] = this.topicLabels;
  barChartTypeTopics: ChartType = 'bar';
  barChartLegendTopics = true;
  barChartPluginsTopics = [];

  barChartDataTopics: ChartDataSets[] = [
    {
      data: this.techCompAvg,
      label: 'Associate Topic Competency',
      backgroundColor: 'rgba(248, 148, 6, 1)',
      hoverBackgroundColor: 'rgba(214, 116, 4, 0.6)',
    },
    {
      data: this.topicAveragesDataSet,
      label: 'Topic Competency Average for Batch',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      hoverBackgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  ];
}
