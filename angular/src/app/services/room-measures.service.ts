import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Measure, RoomMeasure } from '../facility/room-measure';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class RoomMeasuresService {

  private measureList: Array<RoomMeasure> = [
    { key: 'office', value: new Measure()},
    { key: 'hall', value: new Measure()},
    { key: 'warehouse', value: new Measure()},
    { key: 'dining_room', value: new Measure()},
  ];


  private stompClient: any;
  private endpoint = 'http://localhost:7000/websocket';
  //private endpoint = 'http://192.168.137.62:7000/websocket';
  private topic = '/topic/facilityManagement';

  constructor() { this.fetchMeasures(); }

  private fetchMeasures() {
    const that = this;
    const socket = new SockJS(this.endpoint);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = null;

    this.stompClient.connect({}, function (frame) {
      console.log('Connection stablished');

      that.stompClient.subscribe(that.topic, (message) => {
        const data = JSON.parse(message.body);
        const roomID = data.id.replace('sensor_', '');
        const roomIndex = that.measureList.findIndex((item) => item.key === roomID);

        if (data.datatype === 'temperature') {
          that.measureList[roomIndex].value.temperature = data;
        }
        else if (data.datatype === 'luminosity') {
          that.measureList[roomIndex].value.luminosity = data;
        }
        else if (data.datatype === 'humidity') {
          that.measureList[roomIndex].value.humidity = data;
        }
        else if (data.datatype === "comfort") {
          that.measureList[roomIndex].value.comfort = data;
        }
        else {
          console.error('Error, the data cannot be processed');
        }
      });
    });

  }

  getMeasures(): Observable<RoomMeasure[]> {
    return of(this.measureList);
  }
}
