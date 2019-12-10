import {Component, Input, OnInit } from '@angular/core';
import { LocalWebsocketService } from '../../services/local-websocket.service';
import {Measure, RoomMeasure} from '../room-measure';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.css']
})

export class FacilityDetailsComponent implements OnInit {

  @Input()
  roomSelected: string;

  @Input()
  roomMeasures: RoomMeasure;

  constructor() { }

  ngOnInit() {
  }
}
