import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
import { FormsComponent } from './forms/forms.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import {UserRegistrationService} from "./service/user-registration.service";
import {UserParametersService} from "./service/user-parameters.service";
import {UserLoginService} from "./service/user-login.service";
import {NewPasswordComponent} from "./newpassword/newpassword.component";
import {RegisterComponent} from "./register/registration.component";
import {CognitoUtil} from "./service/cognito.service";
import {AwsUtil} from "./service/aws.service";
import { SenderformComponent } from './forms/senderform/senderform.component';
import { DeliveryServiceFormComponent } from './forms/delivery-service-form/delivery-service-form.component';
import { HeaderComponent } from './header/header.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'new-service', component: FormsComponent },
  { path: 'newPassword', component: NewPasswordComponent },
  { path: 'senderForm', component: SenderformComponent },
  { path: 'deliveryServiceForm', component: DeliveryServiceFormComponent }
];

@NgModule({
  declarations: [
    NewPasswordComponent,
    RegisterComponent,
    AppComponent,
    ServerComponent,
    FormsComponent,
    LoginComponent,
    SenderformComponent,
    DeliveryServiceFormComponent,
    HeaderComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    CognitoUtil,
    AwsUtil,
    UserRegistrationService,
    UserLoginService,
    UserParametersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
