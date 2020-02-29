import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { BodyComponent } from './body/body.component';
import { ConfigComponent } from './config/config.component';
import { HumidityComponent } from './humidity/humidity.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { CatordogComponent } from './catordog/catordog.component';
import { RequestsComponent } from './requests/requests.component';
import { PhotosComponent } from './photos/photos.component';
import { UsersComponent } from './users/users.component';
import { FilesComponent } from './files/files.component';
import { WifiComponent } from './wifi/wifi.component';
import { SensorInfoComponent } from './sensor-info/sensor-info.component';

const routes: Routes = [
  {path:'', component: BodyComponent, canActivate: [AuthGuard]},
  {path:'logs', component: LogsComponent, canActivate: [AuthGuard]},
  {path:'config', component: ConfigComponent, canActivate: [AuthGuard]},
  {path:'sensor', component: HumidityComponent, canActivate: [AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'catordog', component: CatordogComponent, canActivate: [AuthGuard]},
  {path:'requests', component: RequestsComponent, canActivate: [AuthGuard]},
  {path:'photos', component: PhotosComponent, canActivate: [AuthGuard]},
  {path:'users', component: UsersComponent},
  {path:'files', component: FilesComponent, canActivate: [AuthGuard]},
  {path:'sensor/:sensor', component: SensorInfoComponent, canActivate: [AuthGuard]},
  {path:'wifi', component: WifiComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
