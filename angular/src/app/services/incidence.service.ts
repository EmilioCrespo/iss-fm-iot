import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Incidence } from '../incidences/incidence';

@Injectable({
  providedIn: 'root'
})
export class IncidenceService {

  private incidenceList: Incidence[] = [];
  private INCIDENCE_DATA = require('../../assets/incidences_sample.json');

  constructor() {
    this.fetchIncidences();
  }

  private fetchIncidences() {
    // Mockup incidences
    this.INCIDENCE_DATA.forEach(element => {
        let item: Incidence = new Incidence();
        item.id = element.id;
        item.date = element.timestamp;
        item.status = element.status;
        item.type = element.type;
        item.room = element.room;
        item.priority = element.priority;
        item.description = element.description;

        this.incidenceList.push(item);
    });
  }

  getIncidences(): Observable<Incidence[]> {
    return of(this.incidenceList);
  }

  addIncidence(data) {
    // Add backend values
    data.id = 'Incidence #' + Math.random(); // Must be unique! This is an example!
    data.date = new Date();
    data.status = 'In Progress';

    this.incidenceList.push(data);
  }

  modifyIncidence(data) {
    // Search incidence ID
    let index = this.incidenceList.findIndex(item => item.id === data.id);

    // Replace incidence data
    this.incidenceList[index] = data;
  }

}
