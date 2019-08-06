import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { BodyComponent } from './body/body.component';
import { WeatherComponent } from './weather/weather.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component'
import { CatOrDogComponent } from './catordog/catordog.component'

const routes: Routes = [
  {path:'', component: BodyComponent},
  {path:'logs', component: LogsComponent, canActivate: [AuthGuard]},
  {path:'weather', component: WeatherComponent},
  {path:'weather', component: WeatherComponent},
  {path:'login', component: LoginComponent}
  {path:'catordog', component: CatOrDogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
