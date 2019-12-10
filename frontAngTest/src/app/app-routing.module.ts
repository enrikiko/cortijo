import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { BodyComponent } from './body/body.component';
import { WeatherComponent } from './weather/weather.component';
import { HumidityComponent } from './humidity/humidity.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { CatordogComponent } from './catordog/catordog.component';
import { RequestsComponent } from './requests/requests.component';
import { PhotosComponent } from './photos/photos.component';
import { UsersComponent } from './users/users.component'

const routes: Routes = [
  {path:'', component: BodyComponent},
  {path:'logs', component: LogsComponent, canActivate: [AuthGuard]},
  {path:'weather', component: WeatherComponent},
  {path:'humidity', component: HumidityComponent},
  {path:'login', component: LoginComponent},
  {path:'catordog', component: CatordogComponent},
  {path:'requests', component: RequestsComponent},
  {path:'photos', component: PhotosComponent},
  {path:'users', component: UsersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
