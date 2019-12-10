import {Component, Input, OnInit} from '@angular/core';
import { RoomMeasure} from '../room-measure';

@Component({
  selector: 'app-facility-plan',
  templateUrl: './facility-plan.component.html',
  styleUrls: ['./facility-plan.component.css']
})
export class FacilityPlanComponent implements OnInit {

  @Input()
  roomSelected: string;

  @Input()
  roomMeasures: RoomMeasure[];

  constructor() { }

  ngOnInit(): void {
  }

}
