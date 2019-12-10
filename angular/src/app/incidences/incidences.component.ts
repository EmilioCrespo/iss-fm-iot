import { Component, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

import { IncidenceService } from '../services/incidence.service';
import {Incidence} from './incidence';

@Component({
  selector: 'app-incidences',
  templateUrl: './incidences.component.html',
  styleUrls: ['./incidences.component.css']
})
export class IncidencesComponent implements OnInit {

  incidences: Incidence [];

  /*
  private json_array = require('../../assets/incidences_sample.json');
  private cont = 8;
  */

  constructor(
    private incidentService: IncidenceService
  ) { }

  ngOnInit() {
    this.getIncidences();
  }
/*
  putIncidences(){
    this.json_array.forEach(element => {
      var table = document.getElementById("incidence_rows").innerHTML;
      var priority_color;

      if(element.priority == "High"){
        priority_color = "red"
      }
      else if(element.priority == "Medium"){
        priority_color = "orange"
      }
      else {
        priority_color = "gold"
      }

      var row =
        "<tr>" +
        "<td>" + element.timestamp + "</td>" +
        "<td>" + element.id + "</td>" +
        "<td>" + element.status + "</td>" +
        "<td>" + element.type + "</td>" +
        "<td>" + element.description + "</td>" +
        "<td>" + element.room + "</td>" +
        "<td><span style='color:" + priority_color + "'>" + element.priority + "</td>" +
        "</tr>";

        document.getElementById("incidence_rows").innerHTML = table + row
    });
  }

  formatDate(timestamp){
    var date = timestamp.split("T")[0];
    var time = timestamp.split("T")[1];

    var day = date.split("-")[2];
    var month = date.split("-")[1];
    var year = date.split("-")[0];

    var hours = time.split(":")[0];
    var minutes = time.split(":")[1];
    var seconds = time.split(":")[2];

    return day + "-" + month + "-" + seconds + " " + hours + ":" + minutes + ":" + seconds;
  }
*/
  getIncidences() {
    this.incidentService.getIncidences()
      .subscribe(incidences => this.incidences = incidences);
  }

}
