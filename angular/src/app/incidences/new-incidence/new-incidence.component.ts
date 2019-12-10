import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IncidenceService } from '../../services/incidence.service';
import { Incidence } from '../incidence';

@Component({
  selector: 'app-new-incidence',
  templateUrl: './new-incidence.component.html',
  styleUrls: ['./new-incidence.component.css']
})
export class NewIncidenceComponent implements OnInit {

  checkoutForm;

  constructor(
    private service: IncidenceService,
    private formBuilder: FormBuilder
  ) {
    this.checkoutForm = this.formBuilder.group({
      type: '',
      room: '',
      priority: '',
      description: ''
    });
  }

  ngOnInit() {
  }

  onSubmit(data) {
    // Collect form data
    let incidence: Incidence = new Incidence();
    incidence.type = data.type;
    incidence.room = data.room;
    incidence.priority = data.priority;
    incidence.description = data.description;

    // Add new incidence
    this.service.addIncidence(incidence);

    // Reset fields form
    this.checkoutForm.reset();
  }


}
