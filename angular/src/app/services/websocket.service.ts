import { Injectable, Output, EventEmitter } from '@angular/core';

import * as Stomp from 'stompjs'
import SockJS from "sockjs-client"

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    @Output() temperature: EventEmitter<JSON> = new EventEmitter();
    @Output() luminosity: EventEmitter<JSON> = new EventEmitter();
    @Output() humidity: EventEmitter<JSON> = new EventEmitter();

    private stompClient: any
    private endpoint = "/websocket"
    private topic = "/topic/facilityManagement"

    constructor() {
        this.getData();
    }

    public getData() {

        var socket = new SockJS(this.endpoint);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = null;

        let that = this;
        this.stompClient.connect({}, function (frame) {
            console.log("Connected")
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
                else {
                    console.error("Error, the data cannot be processed");
                }
            });
        });
    }

    public close(){
        this.stompClient.disconnect(function(){

        }, {});
    }
}
