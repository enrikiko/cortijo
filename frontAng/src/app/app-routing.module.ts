import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { BodyComponent } from './body/body.component';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  {path:'', component: BodyComponent},
  {path:'logs', component: LogsComponent},
  {path:'weather', component: WeatherComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
