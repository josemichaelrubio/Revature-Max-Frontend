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
  batchInfoAverages!: BatchInfoAverages;
  employeeInfo!: EmployeeInfo;

  batchId: number = +(sessionStorage.getItem('userBatchId') || '');

  quizAveragesDataSet: number[] = [];
  quizLabels: string[] = [];
  countForQuiz: number[] = [];

  topicAveragesDataSet: number[] = [];
  topicLabels: string[] = [];
  countForTopics: number[] = [];

  tagCompAvg: any = [];
  tagCompetencies: any = {};

  associateQuizScoresDataSet: number[] = [];

  constructor(
    private averageService: AverageService,
    private associateDataService: AssociateDataService
  ) {
    this.averageService
      .getBatchInfo(this.batchId)
      .pipe(take(1))
      .subscribe(
        (response: BatchInfoAverages) => {
          this.batchInfoAverages = response;
          for (let quizAvg of this.batchInfoAverages.quizAverage) {
            this.quizAveragesDataSet.push(quizAvg.averageScore);
            this.quizLabels.push(
              quizAvg.quizName + ' (count: ' + quizAvg.scoresCounted + ')'
            );
            this.countForQuiz.push(quizAvg.scoresCounted);
          }

          this.quizAveragesDataSet.push(0, 100);

          for (let topicAvg of this.batchInfoAverages.competencyAverage) {
            this.topicAveragesDataSet.push(topicAvg.averageCompetency);
            this.topicLabels.push(
              topicAvg.tagName +
                ' (count: ' +
                topicAvg.competenciesCounted +
                ')'
            );
            this.countForTopics.push(topicAvg.competenciesCounted);
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
          this.employeeInfo = response;
          for (let empQuiz of this.employeeInfo.quizzes) {
            this.associateQuizScoresDataSet.push(empQuiz.score);
          }

          this.associateQuizScoresDataSet.push(0, 100);

          for (let empTopic of this.employeeInfo.topics) {
            if (!(empTopic.topic.tech.name in this.tagCompetencies)) {
              this.tagCompetencies[empTopic.topic.tech.name] = [];
              this.tagCompetencies[empTopic.topic.tech.name].push(
                empTopic.competency
              );
            } else {
              this.tagCompetencies[empTopic.topic.tech.name].push(
                empTopic.competency
              );
            }
          }

          for (let tagName in this.tagCompetencies) {
            let length = this.tagCompetencies[tagName].length;
            let sum = 0;
            for (let i = 0; i < length; i++) {
              sum += this.tagCompetencies[tagName][i];
            }
            let average = (sum / length).toPrecision(2);
            this.tagCompAvg.push(average);
          }
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
      data: this.tagCompAvg,
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
