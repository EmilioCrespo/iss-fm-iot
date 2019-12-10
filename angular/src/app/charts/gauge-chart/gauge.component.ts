import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalWebsocketService } from 'src/app/services/local-websocket.service';

@Component({
    selector: 'app-gauge-chart',
    templateUrl: './gauge.component.html',
    styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit {

    @Input() name = "default"
    @Input() value = 50
    @Input() max = "100"
    @Input() min = "0"
    @Input() delimiter = 50
    @Input() _sensor_id = "sensor_office"

    public canvasWidth = 300
    public needleValue: number;
    public centralLabel = ''
    public bottomLabel = ''
    private needleColor = "grey"
    private colors = ['rgb(44, 151, 222)', 'lightgray']

    public options = {
        hasNeedle: true,
        needleColor: this.needleColor,
        needleUpdateSpeed: 100,
        arcColors: this.colors,
        arcDelimiters: [this.delimiter],
        rangeLabel: [this.min, this.max],
        needleStartValue: 50,
    }

    private units = "";

    private colors_luminosity = [['#a8a618', 'lightgrey'], ['#e0dd0d', 'lightgray'], ['#fffb08', 'lightgrey']]
    private colors_temperature = [['#1db5a6', 'lightgrey'], ['#73b51d', 'lightgrey'], ['#deb110', 'lightgrey'], ['#b5481d', 'lightgrey']]
    private colors_humidity = [['#68707d', 'lightgrey'], ['#698ebf', 'lightgrey'], ['#3c7dde', 'lightgrey']]

    private sub: Subscription  = new Subscription();

    constructor(private dataService: LocalWebsocketService) { }

    ngOnInit() {
        this.initChart();

        if (this.name == "Temperature") {
            this.sub = this.dataService.temperature.subscribe(data => {
                if (data.id == this._sensor_id) {
                    this.updateChart(data);
                }
            });
        }
        else if (this.name == "Luminosity") {
            this.sub = this.dataService.luminosity.subscribe(data => {
                if (data.id == this._sensor_id) {
                    this.updateChart(data);
                }
            });
        }
        else if (this.name == "Humidity") {
            this.sub = this.dataService.humidity.subscribe(data => {
                if (data.id == this._sensor_id) {
                    this.updateChart(data);
                }
            });
        }
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

    ngOnChanges(changes : SimpleChanges){
        this.initChart();
    }

    initChart() {
        if (this.name == "Luminosity") {
            this.needleValue = this.value/400 * 100;
            this.colors = this.colors_luminosity[1];
        }
        else if (this.name == "Temperature") {
            //this.name = this.name + ' ºC';
            this.colors = this.colors_temperature[1];
            this.units = " ºC";
            if (this.value > 0) {
                this.needleValue = this.value * 2;
            }
            else if (this.value == 0) {
                this.needleValue = 28.6;
            }
            else {
                this.needleValue = 28.6 - (this.value) * (-1.43);
            }
        }
        else if (this.name == "Humidity") {
            //this.name = this.name + ' (%)';
            this.colors = this.colors_humidity[1];
            this.units = ' %';
            this.needleValue = this.value;
        }
        else {
            this.needleValue = this.value;
        }
        this.delimiter = this.needleValue;

        this.bottomLabel = this.value.toString() + this.units;
        this.options = {
            hasNeedle: true,
            needleColor: this.needleColor,
            needleUpdateSpeed: 1000,
            arcColors: this.colors,
            arcDelimiters: [this.delimiter],
            rangeLabel: [this.min, this.max],
            needleStartValue: 50,
        }
    }

    updateChart(data) {
        var lastValue = this.needleValue;
        this.updateNeedleValue(data);


        this.delimiter = this.needleValue;
        if (this.delimiter == 0) {
            this.delimiter = 0.1;
        }
        else if (this.delimiter == 100) {
            this.delimiter = 99;
        }

        this.options.arcColors = this.colors;
        this.options.arcDelimiters = [this.delimiter];
        this.options.needleStartValue = lastValue;

        this.bottomLabel = data.value.toString();
    }

    updateSensorId(sensor_id) {
        this._sensor_id = sensor_id;
    }

    updateNeedleValue(data){
        if (this.name == "Luminosity") {
            this.needleValue = data.value/400 * 100;
            this.updateColor();
        }
        else if (this.name == "Temperature") {
            if (data.value > 0) {
                this.needleValue = 28.6 + (data.value) * 1.43;
            }
            else if (this.value == 0) {
                this.needleValue = 28.6;
            }
            else {
                this.needleValue = 28.6 - (data.value) * (-1.43);
            }

            this.updateColor();
        }
        else if (this.name == "Humidity") {
            this.needleValue = data.value;
            this.updateColor();
        }
        else {
            this.needleValue = data.value;
        }

        if(data.value <= Number(this.min)){
            this.needleValue = 0.1;
        }
        else if(data.value >= Number(this.max)){
            this.needleValue = 99.9;
        }
    }

    updateColor() {
        if (this.name == 'Luminosity') {
            if (this.needleValue < 30) {
                this.colors = this.colors_luminosity[0]
            }
            else if (this.needleValue >= 30 && this.needleValue < 70) {
                this.colors = this.colors_luminosity[1]
            }
            else {
                this.colors = this.colors_luminosity[2]
            }
        }
        else if (this.name == 'Temperature') {
            if (this.needleValue < 30) {
                this.colors = this.colors_temperature[0]
            }
            else if (this.needleValue >= 30 && this.needleValue < 55) {
                this.colors = this.colors_temperature[1]
            }
            else if (this.needleValue >= 55 && this.needleValue < 70) {
                this.colors = this.colors_temperature[2]
            }
            else {
                this.colors = this.colors_temperature[3]
            }
        }
        else if (this.name == 'Humidity') {
            if (this.needleValue < 30) {
                this.colors = this.colors_humidity[0]
            }
            else if (this.needleValue >= 30 && this.needleValue < 70) {
                this.colors = this.colors_humidity[0]
            }
            else {
                this.colors = this.colors_humidity[0]
            }
        }
    }
}
