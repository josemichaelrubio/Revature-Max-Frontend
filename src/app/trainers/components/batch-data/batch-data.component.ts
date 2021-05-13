import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BatchInfoAverages } from '../../../models/batch-info-averages';
import { AverageService } from '../../../services/average.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-batch-data',
  templateUrl: './batch-data.component.html',
  styleUrls: ['./batch-data.component.css']
})
export class BatchDataComponent implements OnInit {

  averages!:any;

  batchId: number =  +(sessionStorage.getItem("userBatchId") || 1);

  quizAvgDataSet: number[] = [];
  quizLabels: string[] = [];

  topicCompAvgDataSet: number[] = [];
  topicLabels: string[] = [];
  countForQuiz: number[] =[];
  countForTopics: number[] = [];

  constructor(private averageService:AverageService) {

    this.averageService
      .getBatchInfo(this.batchId)
      .pipe(take(1))
      .subscribe(
        (response) => {
          console.log(response);
          this.averages = response;
          let quizAvg = this.averages.quizAverage;
          for (let quizId of Object.keys(quizAvg)) {
            console.log(+(quizAvg[quizId][1]));
            this.quizAvgDataSet.push(+(quizAvg[quizId][1]));
            this.quizLabels.push(quizAvg[quizId][0] + ' (count: ' + quizAvg[quizId][2] + ')');
             this.countForQuiz.push(+(quizAvg[quizId][2]));
          }

         // this.quizAvgDataSet.push(0, 100);

          let topicCompAvg = this.averages.competencyAverage
          for (let topicId of Object.keys(topicCompAvg)) {
            this.topicCompAvgDataSet.push(+(topicCompAvg[topicId][1]));
            this.topicLabels.push((topicCompAvg[topicId][0]) + ' (count: ' +
                topicCompAvg[topicId][2] + ')');
            this.countForTopics.push(+(topicCompAvg.competenciesCounted));
          }

          this.topicCompAvgDataSet.push(0, 5);
        },
        (error) => console.log('There is an error'),
        () => console.log(this.averages)
      );


    /*averageService.getBatchInfo(this.batchId).subscribe((avg)=>{
      this.averages=avg;
      for(let quizAvg of this.averages.quizAverage){
        this.quizAvgDataSet.push(quizAvg.averageScore);
        this.quizLabels.push(quizAvg.quizName);
      }
  
      for(let compAvg of this.averages.competencyAverage){
        this.topicCompAvgDataSet.push(compAvg.averageCompetency);
        this.topicLabels.push(compAvg.tagName);
      }

      this.topicCompAvgDataSet.push(0, 5);

    }, 
      (err)=>console.log(err), 
      ()=>console.log(this.averages)
    );*/

  }

  ngOnInit(): void {
  }

  // Line Chart data for Quiz Averages

  lineChartData: ChartDataSets[] = [
    {data: this.quizAvgDataSet, label: 'Quiz Score Averages', fill: false}
  ];

  lineChartLabels: Label[] = this.quizLabels;

  lineChartOptions: ChartOptions = {responsive: true };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      pointBackgroundColor: 'orange',
      pointRadius: 7,
      pointStyle: 'rectRot'
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = "line";

  // Bar Chart Data for Topic Competencies

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = this.topicLabels;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: this.topicCompAvgDataSet, label: 'Topic Competency Averages', backgroundColor: 'rgba(0, 0, 0, 0.8)', hoverBackgroundColor: 'rgba(214, 116, 4, 0.6)', }
  ];

}
