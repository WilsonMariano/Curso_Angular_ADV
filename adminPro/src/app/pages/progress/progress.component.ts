import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  progreso1: Number = 50;
  progreso2: Number = 90;

  constructor() { }

  ngOnInit() {
  }

  actualizar( event: number ){
    
  }


}
