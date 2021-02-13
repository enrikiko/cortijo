import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DevicesComponent } from './devices/devices.component';
import { FooterComponent } from './footer/footer.component';
import { LogsComponent } from './logs/logs.component';
import { WeatherComponent } from './weather/weather.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { CatordogComponent } from './catordog/catordog.component';
import { UsersComponent } from './users/users.component';
import { PhotosComponent } from './photos/photos.component';
import { PhotoComponent } from './photo/photo.component';
import { RequestsComponent } from './requests/requests.component';
import { SensorGraphicComponent } from './sensorGraphic/sensorGraphic.component';
import { ConfigComponent } from './config/config.component';
import { FilesComponent } from './files/files.component';
import { WifiComponent } from './wifi/wifi.component';
import { SensorInfoComponent } from './sensor-info/sensor-info.component';
import { TaskComponent } from './task/task.component';
import { CameraComponent } from './camera/camera.component';
import { TenantsComponent } from './tenants/tenants.component';

import {JsonAppConfigService} from './set_configuration/json-app-config.service';
import {AppConfiguration} from './set_configuration/app-configuration';


const config: SocketIoConfig = { url: 'http://socket.cortijodemazas.com', options: {} };

export function initializerFn(jsonAppConfigService: JsonAppConfigService) {
  return () => {
    return jsonAppConfigService.load();
  };
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DevicesComponent,
    FooterComponent,
    LogsComponent,
    WeatherComponent,
    LoginComponent,
    CatordogComponent,
    UsersComponent,
    PhotosComponent,
    PhotoComponent,
    RequestsComponent,
    SensorGraphicComponent,
    ConfigComponent,
    FilesComponent,
    WifiComponent,
    SensorInfoComponent,
    TaskComponent,
    CameraComponent,
    TenantsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
  {
    provide: AppConfiguration,
    deps: [HttpClient],
    useExisting: JsonAppConfigService
  },
  {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [JsonAppConfigService],
    useFactory: initializerFn
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
