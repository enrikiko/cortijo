import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { DevicesComponent } from './devices/devices.component';
import { ConfigComponent } from './config/config.component';
import { SensorGraphicComponent } from './sensorGraphic/sensorGraphic.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { CatordogComponent } from './catordog/catordog.component';
import { RequestsComponent } from './requests/requests.component';
import { PhotosComponent } from './photos/photos.component';
import { UsersComponent } from './users/users.component';
import { FilesComponent } from './files/files.component';
import { WifiComponent } from './wifi/wifi.component';
import { TaskComponent } from './task/task.component';
import { CameraComponent } from './camera/camera.component';
import { SensorInfoComponent } from './sensor-info/sensor-info.component';
import { TenantsComponent } from './tenants/tenants.component';

const routes: Routes = [
  {path:'', component: DevicesComponent, canActivate: [AuthGuard]},
  {path:'devices', component: DevicesComponent, canActivate: [AuthGuard]},
  {path:'logs', component: LogsComponent, canActivate: [AuthGuard]},
  {path:'config', component: ConfigComponent, canActivate: [AuthGuard]},
  {path:'sensorInfo/:sensor', component: SensorGraphicComponent, canActivate: [AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'tenants', component: TenantsComponent},
  {path:'users', component: UsersComponent},
  {path:'catordog', component: CatordogComponent, canActivate: [AuthGuard]},
  {path:'requests/:device', component: RequestsComponent, canActivate: [AuthGuard]},
  {path:'photos', component: PhotosComponent, canActivate: [AuthGuard]},
  {path:'files', component: FilesComponent, canActivate: [AuthGuard]},
  {path:'sensorSetting/:sensor', component: SensorInfoComponent, canActivate: [AuthGuard]},
  {path:'wifi', component: WifiComponent, canActivate: [AuthGuard]},
  {path:'task', component: TaskComponent, canActivate: [AuthGuard]},
  {path:'camera', component: CameraComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
