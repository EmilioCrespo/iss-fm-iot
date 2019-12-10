import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';

import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { IfStmt } from '@angular/compiler';
import { LocalWebsocketService } from '../../services/local-websocket.service';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

    @Input() sensorId = "sensor_office"
    @Input() datatype = "default";
    @Input() width = "1000";
    @Input() height = "600";

    private lineColor = "";
    private yLabel = "";
    private maxY: Number;
    private minY: Number;

    private dataset: any;

    private chart: any;
    private sub: Subscription  = new Subscription();
    private first_data: Number;

    constructor(private dataService: LocalWebsocketService) { }

    ngOnInit() {
        document.getElementById("chart").setAttribute("id", this.datatype);

        if (this.datatype == "temperature") {
            this.lineColor = "red";
            this.yLabel = "ºC";
            this.maxY = 50;
            this.minY = -20;
            this.first_data = 12;
        }
        else if (this.datatype == "luminosity") {
            this.lineColor = "gold"
            this.yLabel = "Lumens";
            this.maxY = 400;
            this.minY = 0;
            this.first_data = 20
        }
        else if (this.datatype == "humidity") {
            this.lineColor = "dodgerblue"
            this.yLabel = "%";
            this.maxY = 100;
            this.minY = 0;
            this.first_data = 10
        }
        else if (this.datatype == "comfort") {
            this.lineColor = "brown"
            this.yLabel = "%";
            this.maxY = 100;
            this.minY = 0;
            this.first_data = 86
        }
        this.initChart();

        if (this.datatype == "temperature") {
            this.sub = this.dataService.temperature.subscribe(data => {
                if (data.id == this.sensorId)
                    this.updateChart(data);
            });
        }
        else if (this.datatype == "luminosity") {
            this.sub = this.dataService.luminosity.subscribe(data => {
                if (data.id == this.sensorId)
                    this.updateChart(data);
            });
        }
        else if (this.datatype == "humidity") {
            this.sub = this.dataService.humidity.subscribe(data => {
                if (data.id == this.sensorId)
                    this.updateChart(data);
            });
        }
        else if (this.datatype == "comfort") {
            this.sub = this.dataService.humidity.subscribe(data => {
                if (data.id == this.sensorId)
                    this.updateChart(data);
            });
        }
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

    ngOnChanges(changes : SimpleChanges){
        this.reloadChart();
    }

    private initChart() {
        this.chart = new Chart(this.datatype, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: this.datatype,
                    fill: false,
                    data: [this.first_data],
                    backgroundColor: this.lineColor,
                    borderColor: this.lineColor,
                }]
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
        var time = data.timestamp.split("T")[1];
        this.chart.data.labels.push(time);
        this.chart.data.datasets[0].data.push(data.value);

        this.chart.update();
    }

    public reloadChart(){
        this.initChart();
        this.chart.update();
    }

}
