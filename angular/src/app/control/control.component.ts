import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalWebsocketService } from '../services/local-websocket.service';

@Component({
    selector: 'app-control',
    templateUrl: './control.component.html',
    styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
    @ViewChild('gauge_temp', { static: false }) gauge_temp;
    @ViewChild('gauge_lum', { static: false }) gauge_lum;

    private rooms = ["Office", "Hall", "Dining room", "Warehouse"];
    private selected_room = "Office";
    private sensor_id = "sensor_office";

    constructor(private websocketService : LocalWebsocketService) { }

    ngOnInit() {

    }

    onInputChangeTemp(event) {
        var timestamp = new Date();
        var msg = "{\"id\":\"Server\"," +
            "\"datatype\":\"control\"," +
            "\"timestamp\": \"" + this.formatDate(timestamp.toLocaleString()) + "\"," +
            "\"command\": {" +
            "\"datatype\":\"temperature\"," +
            "\"sensor_id\":\"" + this.sensor_id + "\"," +
            "\"value\":" + event.value + "}}";

        this.websocketService.sendData(msg);
    }

    onInputChangeLight(event) {
        var timestamp = new Date();
        var msg = "{\"id\":\"Server\"," +
            "\"datatype\":\"control\"," +
            "\"timestamp\": \"" + this.formatDate(timestamp.toLocaleString()) + "\"," +
            "\"command\": {" +
            "\"datatype\":\"luminosity\"," +
            "\"sensor_id\":\"" + this.sensor_id + "\"," +
            "\"value\":" + event.value + "}}";

        this.websocketService.sendData(msg);
    }

    selectRoom(event) {
        this.selected_room = event.target.value;
        this.updateRoom();
        this.gauge_temp.updateSensorId(this.sensor_id);
        this.gauge_lum.updateSensorId(this.sensor_id);
    }

    updateRoom() {
        switch (this.selected_room) {
            case "Office":
                this.sensor_id = "sensor_office";
                break;
            case "Dining room":
                this.sensor_id = "sensor_dining_room";
                break;
            case "Hall":
                this.sensor_id = "sensor_hall";
                break;
            case "Warehouse":
                this.sensor_id = "sensor_warehouse";
                break;
            default:
                break;
        }
    }

    formatDate(timestamp){
        var date = timestamp.split(" ")[0];
        var time = timestamp.split(" ")[1];

        var day = date.split("/")[0];
        var month = date.split("/")[1];
        var year = date.split("/")[2];

        return year + "-" + month + "-" + day + "T" + time;
    }
}