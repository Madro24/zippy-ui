import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import  { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsComponent } from './forms/forms.component';
import { RouterModule, Routes } from '@angular/router';
import {UserRegistrationService} from "./service/user-registration.service";
import {UserParametersService} from "./service/user-parameters.service";
import {UserLoginService} from "./service/user-login.service";
import {CognitoUtil} from "./service/cognito.service";
import {AwsUtil} from "./service/aws.service";
import {DynamoDBService} from "./service/ddb.service";

import { SenderformComponent } from './forms/senderform/senderform.component';
import { DeliveryServiceFormComponent } from './forms/delivery-service-form/delivery-service-form.component';
import { HeaderComponent } from './header/header.component';

import { LoginComponent } from './auth/login/login.component';
import {NewPasswordComponent} from "./auth/newpassword/newpassword.component";
import {LogoutComponent, RegistrationConfirmationComponent} from './auth/confirm/confirmRegistration.component';
import {ForgotPassword2Component, ForgotPasswordStep1Component} from "./auth/forgot/forgotPassword.component";
import {ResendCodeComponent} from "./auth/resend/resendCode.component";
import {RegisterComponent} from "./auth/register/registration.component";

import {SecureHomeComponent} from "./secure/landing/securehome.component";
import {JwtComponent} from "./secure/jwttokens/jwt.component";
import {MyProfileComponent} from "./secure/profile/myprofile.component";
import {UseractivityComponent} from "./secure/useractivity/useractivity.component";
import { ServicesTableComponent } from './forms/services-table/services-table.component';


const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent},
  { path: 'newService', component: FormsComponent },
  { path: 'newPassword', component: NewPasswordComponent },
  { path: 'senderForm', component: SenderformComponent },
  { path: 'deliveryServiceForm', component: DeliveryServiceFormComponent },
  { path: 'serviceslist', component: ServicesTableComponent },
  { path: 'confirmRegistration', component: RegistrationConfirmationComponent },
  { path: 'forgotPassword', component: ForgotPasswordStep1Component },
  { path: 'forgotPassword/:email', component: ForgotPassword2Component},
  { path: 'register', component: RegisterComponent },
  { path: 'resendCode', component: ResendCodeComponent },
  { path: 'myprofile', component: MyProfileComponent },
  { path: 'jwttokens', component: JwtComponent },
  { path: 'useractivity', component: UseractivityComponent },
  { path: 'securehome', component: SecureHomeComponent }
];

@NgModule({
  declarations: [
    NewPasswordComponent,
    LogoutComponent,
    RegistrationConfirmationComponent,
    ResendCodeComponent,
    ForgotPasswordStep1Component,
    ForgotPassword2Component,
    RegisterComponent,
    AppComponent,
    FormsComponent,
    LoginComponent,
    SenderformComponent,
    DeliveryServiceFormComponent,
    HeaderComponent,
    UseractivityComponent,
    MyProfileComponent,
    SecureHomeComponent,
    JwtComponent,
    ServicesTableComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    CognitoUtil,
    AwsUtil,
    UserRegistrationService,
    UserLoginService,
    UserParametersService,
    DynamoDBService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
