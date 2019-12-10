import { Injectable, Output, EventEmitter } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export class LocalWebsocketService {
  @Output() temperature: EventEmitter<JSON> = new EventEmitter();
  @Output() luminosity: EventEmitter<JSON> = new EventEmitter();
  @Output() humidity: EventEmitter<JSON> = new EventEmitter();
  @Output() comfort: EventEmitter<JSON> = new EventEmitter();


  private stompClient: any;
  private endpoint = 'http://localhost:7000/websocket';
  //private endpoint = 'http://192.168.137.62:7000/websocket';
  private topic = '/topic/facilityManagement';
  private topic_to_send = '/app/empresa/data';
  private sensorId = "";

  constructor() {
    this.getData();
  }

  public getData() {

    let socket = new SockJS(this.endpoint);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = null;

    let that = this;
    this.stompClient.connect({}, function (frame) {
      console.log("Connected");
      if(that.sensorId != "" && that.sensorId != undefined){
        that.sendData(JSON.stringify({"id":that.sensorId, "datatype":"subscription"}));
      }
      that.stompClient.subscribe(that.topic, (message) => {
        var data = JSON.parse(message.body);
        if (data.datatype == "temperature") {
          that.temperature.emit(data);
        }
        else if (data.datatype == "luminosity") {
          that.luminosity.emit(data);
        }
        else if (data.datatype == "humidity") {
          that.humidity.emit(data);
        }
        else if (data.datatype == "comfort") {
          that.comfort.emit(data);
        }
        else if(data.datatype == "control"){}
        else {
          console.error("Error, the data cannot be processed");
        }
      });
    });
  }
  public sendData(data){
    this.stompClient.send(this.topic_to_send, {}, data);
  }

  public close() {
    this.stompClient.disconnect(function () {

    }, {});
  }

  public setSensorId(sensorId){
    this.sensorId = sensorId;
  }
}
