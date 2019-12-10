import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { IfStmt } from '@angular/compiler';
import { LocalWebsocketService } from '../../services/local-websocket.service';

@Component({
    selector: 'app-multi-line-chart',
    templateUrl: './multi-line-chart.component.html',
    styleUrls: ['./multi-line-chart.component.css']
})
export class MultiLineChartComponent implements OnInit {

    @Input() datatype = "default";
    @Input() width = "1000";
    @Input() height = "600";

    private lineColor1 = "";
    private lineColor2 = "";

    private yLabel = "";
    private maxY: Number;
    private minY: Number;

    private dataset: any;

    private chart: any;
    private sub: Subscription = new Subscription();

    private sensor1 = "Office"
    private sensor2 = "Dining room"

    private first_data1 : Number;
    private first_data2 : Number;

    constructor(private dataService: LocalWebsocketService) { }

    ngOnInit() {
        document.getElementById("chart").setAttribute("id", this.datatype);

        if (this.datatype == "temperature") {
            this.lineColor1 = "red";
            this.lineColor2 = "orange";

            this.yLabel = "ºC";
            this.maxY = 50;
            this.minY = -20;

            this.first_data1 = 12;
            this.first_data2 = 8;
        }
        else if (this.datatype == "luminosity") {
            this.lineColor1 = "gold"
            this.lineColor2 = "green"

            this.yLabel = "Lumens";
            this.maxY = 400;
            this.minY = 0;

            this.first_data1 = 20;
            this.first_data2 = 20;
        }
        else if (this.datatype == "humidity") {
            this.lineColor1 = "dodgerblue"
            this.lineColor2 = "purple"

            this.yLabel = "%";
            this.maxY = 100;
            this.minY = 0;

            this.first_data1 = 10;
            this.first_data2 = 14;
        }
        else if (this.datatype == "comfort") {
            this.lineColor2 = "grey"
            this.lineColor1 = "brown"

            this.yLabel = "%";
            this.maxY = 100;
            this.minY = 0;

            this.first_data1 = 10;
            this.first_data2 = 6;
        }
        this.initChart();

        if (this.datatype == "temperature") {
            this.sub = this.dataService.temperature.subscribe(data => {
                this.updateChart(data);
            });
        }
        else if (this.datatype == "luminosity") {
            this.sub = this.dataService.luminosity.subscribe(data => {
                this.updateChart(data);
            });
        }
        else if (this.datatype == "humidity") {
            this.sub = this.dataService.humidity.subscribe(data => {
                this.updateChart(data);
            });
        }
        else if (this.datatype == "comfort") {
            this.sub = this.dataService.comfort.subscribe(data => {
                this.updateChart(data);
            });
        }

    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

    private initChart() {
        this.chart = new Chart(this.datatype, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: this.sensor1,
                        fill: false,
                        data: [this.first_data1],
                        backgroundColor: this.lineColor1,
                        borderColor: this.lineColor1,
                    },
                    {
                        label: this.sensor2,
                        fill: false,
                        data: [this.first_data2],
                        backgroundColor: this.lineColor2,
                        borderColor: this.lineColor2,
                    }
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: true,
                    position: 'bottom'
                },
                elements: {
                    line: {
                        tension: 0 //disable bezier curves
                    }
                },
                scales: {
                    yAxes: [{
                        disable: true,
                        ticks: {
                            beginAtZero: true,
                            max: this.maxY,
                            min: this.minY
                        },
                        scalesLabel: {
                            display: true,
                            labelString: this.yLabel
                        }
                    }],
                    xAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            max: null,
                            min: null
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ''
                        }
                    }]
                }
            }
        });
    }

    private updateChart(data) {
        console.log(data);

        if (data.id == "sensor_office") {
            var time = data.timestamp.split("T")[1];
            if(!this.chart.data.labels.includes(time)){
                this.chart.data.labels.push(time);
            }
            this.chart.data.datasets[0].data.push(data.value);
        }
        else if (data.id == "sensor_dining_room") {
            var time = data.timestamp.split("T")[1];
            if(!this.chart.data.labels.includes(time)){
                this.chart.data.labels.push(time);
            }
            this.chart.data.datasets[1].data.push(data.value);
        }

        this.chart.update();
    }

}
