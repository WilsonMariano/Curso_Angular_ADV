import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html'
})
export class GraficoDonaComponent implements OnInit {

  @Input() doughnutChartLabels = [];
  @Input() doughnutChartData = [];
  @Input() doughnutChartType = '';

  constructor() { }

  ngOnInit() {
  }

}
