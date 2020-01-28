import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const host = (window.location.href.split("/")[2]).split(":")[0]
const config: SocketIoConfig = { url: 'http://'+host+':8200', options: {} };

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { FooterComponent } from './footer/footer.component';
import { LogsComponent } from './logs/logs.component';
// import { WeatherComponent } from './weather/weather.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { CatordogComponent } from './catordog/catordog.component';
import { UsersComponent } from './users/users.component';
import { PhotosComponent } from './photos/photos.component';
import { PhotoComponent } from './photo/photo.component';
import { RequestsComponent } from './requests/requests.component';
import { HumidityComponent } from './humidity/humidity.component';
import { ConfigComponent } from './config/config.component';
import { FilesComponent } from './files/files.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    LogsComponent,
    // WeatherComponent,
    LoginComponent,
    CatordogComponent,
    UsersComponent,
    PhotosComponent,
    PhotoComponent,
    RequestsComponent,
    HumidityComponent,
    ConfigComponent,
    FilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
