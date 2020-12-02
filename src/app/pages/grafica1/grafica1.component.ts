import { Component } from '@angular/core';

import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[];
  public data1: MultiDataSet;

  constructor() {
    this.labels1 = ['Pan', 'Refresco', 'Tacos'];
    this.data1 = [[10, 15, 40],];
  }
}
