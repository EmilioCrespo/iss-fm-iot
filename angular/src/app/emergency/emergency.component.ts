import {Component, Input, OnInit} from '@angular/core';
import {EmergencyService} from '../services/emergency.service';
import {EmergencyData} from './EmergencyData';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.css']
})
export class EmergencyComponent implements OnInit {

  @Input()
  emergencyState: EmergencyData;

  constructor() { }

  ngOnInit() {
  }

}
