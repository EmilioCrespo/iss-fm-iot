import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { RoomMeasuresService } from '../services/room-measures.service';
import { RoomMeasure } from './room-measure';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {

  private roomActive: string;
  private roomMeasures: RoomMeasure[];
  //private sensorId = "sensor_office";

  constructor(
    private route: ActivatedRoute,
    private measureService: RoomMeasuresService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roomActive = params.get('room');
    });
    this.getRoomMeasure();
  }

  getRoomMeasure(): void {
    this.measureService.getMeasures().subscribe(measures => this.roomMeasures = measures);
  }

  getIndexRoom(): number {
    return this.roomMeasures.findIndex((item) => item.key === this.roomActive);
  }

}

