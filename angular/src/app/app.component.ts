import {AfterViewChecked, Component, OnInit, Output} from '@angular/core';
import { EmergencyService } from './services/emergency.service';
import {EmergencyData} from "./emergency/EmergencyData";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private emergency: EmergencyData;

  title = 'Facility Management';

  constructor(
    private emergencyService: EmergencyService
  ) { }

  ngOnInit(): void {
    this.checkEmergengyState();
  }

  checkEmergengyState(): void {
    this.emergencyService.getEmergence().subscribe(value => {
      this.emergency = value;
    });
  }

}
