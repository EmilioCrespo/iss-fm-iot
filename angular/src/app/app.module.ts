import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { FacilityDetailsComponent } from './facility/facility-details/facility-details.component';
import { FacilityPlanComponent } from './facility/facility-plan/facility-plan.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { IncidencesComponent } from './incidences/incidences.component';
import { FacilityComponent } from './facility/facility.component';
import { MultiLineChartComponent } from './charts/multi-line-chart/multi-line-chart.component';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ControlComponent } from './control/control.component';
import { NewIncidenceComponent } from './incidences/new-incidence/new-incidence.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaugeComponent } from './charts/gauge-chart/gauge.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { EmergencyComponent } from './emergency/emergency.component';


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    SidebarComponent,
    DashboardComponent,
    FacilityPlanComponent,
    LineChartComponent,
    FacilityDetailsComponent,
    IncidencesComponent,
    FacilityComponent,
    MultiLineChartComponent,
    ControlComponent,
    NewIncidenceComponent,
    GaugeComponent,
    EmergencyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    GaugeChartModule,
    MatSliderModule,
    RouterModule.forRoot([
      { path: '', component: DashboardComponent },
      { path: 'facility/:room', component: FacilityComponent },
      { path: 'incidences', component: IncidencesComponent },
      { path: 'control', component: ControlComponent}
    ]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
