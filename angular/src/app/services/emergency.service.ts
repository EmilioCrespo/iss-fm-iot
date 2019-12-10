import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import {EmergencyData} from '../emergency/EmergencyData';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  private emergency: EmergencyData = { state: false};
  //private emergency: Boolean;

  private stompClient: any;
  private endpoint = 'http://localhost:7000/websocket';
  //private endpoint = 'http://192.168.137.62:7000/websocket';
  private topic = '/topic/facilityManagement';

  constructor() { this.fetchEmergencyState(); }

  private fetchEmergencyState() {
    const that = this;
    const socket = new SockJS(this.endpoint);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = null;

    this.stompClient.connect({}, function (frame) {
      console.log('Connected');

      that.stompClient.subscribe(that.topic, (message) => {
        const data = JSON.parse(message.body);
        console.log(data);

        if (data.datatype === 'emergency' && data.value === true) {
          console.log("EMERGENCIA");
          //that.emergency = true;
          that.emergency.state = true;
        }
        else if (data.datatype === 'emergency' && data.value === false) {
          console.log("EMERGENCIA PASADA");
          //that.emergency = false;
          that.emergency.state = false;
        }
        else {
          console.error('Error, the data cannot be processed in this service.');
        }
      });
    });
  }



  getEmergence(): Observable<EmergencyData> {
    return of(this.emergency);
  }

}
