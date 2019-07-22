import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { BodyComponent } from './body/body.component';
import { WeatherComponent } from './weather/weather.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component'

const routes: Routes = [
  {path:'', component: BodyComponent, canActivate: [AuthGuard]},
  {path:'logs', component: LogsComponent, canActivate: [AuthGuard]},
  {path:'weather', component: WeatherComponent, canActivate: [AuthGuard]},
  {path:'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
