import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {FormsComponent} from './forms/forms.component';
import {RouterModule, Routes} from '@angular/router';
import {UserRegistrationService} from './service/user-registration.service';
import {UserParametersService} from './service/user-parameters.service';
import {UserLoginService} from './service/user-login.service';
import {CognitoUtil} from './service/cognito.service';
import {AwsUtil} from './service/aws.service';
import {DynamoDBService} from './service/dynamodb-services/ddb.service';
import {ServiceItemDDBService} from './service/dynamodb-services/ddbServiceItems.service';
import {DataMapService} from './service/data-map.service';
import {AuthGuardService} from './service/auth-guard.service';

import {SenderformComponent} from './forms/senderform/senderform.component';
import {DeliveryServiceFormComponent} from './forms/delivery-service-form/delivery-service-form.component';
import {HeaderComponent} from './header/header.component';

import {LoginComponent} from './auth/login/login.component';
import {NewPasswordComponent} from './auth/newpassword/newpassword.component';
import {LogoutComponent, RegistrationConfirmationComponent} from './auth/confirm/confirmRegistration.component';
import {ForgotPassword2Component, ForgotPasswordStep1Component} from './auth/forgot/forgotPassword.component';
import {ResendCodeComponent} from './auth/resend/resendCode.component';
import {RegisterComponent} from './auth/register/registration.component';

import {SecureHomeComponent} from './secure/landing/securehome.component';
import {JwtComponent} from './secure/jwttokens/jwt.component';
import {MyProfileComponent} from './secure/profile/myprofile.component';
import {UseractivityComponent} from './secure/useractivity/useractivity.component';
import {ServicesTableComponent} from './forms/services-table/services-table.component';
import {AdminHomeComponent} from './admin-home/admin-home.component';
import {ServiceDetailComponent} from './forms/service-detail/service-detail.component';
import {ServiceItemLabelComponent} from './forms/service-item-label/service-item-label.component';
import {CommonUtilService} from './service/common-util.service';
import {DataAvailabilityMapService} from './service/data-availability-map.service';
import {AvailableTimeDDBserviceService} from './service/dynamodb-services/available-time-ddbservice.service';

import { GmapComponent } from './gmap/gmap.component';
import { AgmCoreModule } from '@agm/core';
import {environment} from '../environments/environment';
import {GmapService} from './service/gmap.service';



const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'admin-home', component: AdminHomeComponent, canActivate: [AuthGuardService]},
  {path: 'serviceItem/:itemId', component: SenderformComponent, canActivate: [AuthGuardService]},
  {path: 'serviceItem', component: SenderformComponent, canActivate: [AuthGuardService]},
  {path: 'newPassword', component: NewPasswordComponent},
  {path: 'serviceItemList', component: ServicesTableComponent, canActivate: [AuthGuardService]},
  {path: 'confirmRegistration', component: RegistrationConfirmationComponent},
  {path: 'forgotPassword', component: ForgotPasswordStep1Component},
  {path: 'forgotPassword/:email', component: ForgotPassword2Component},
  {path: 'register', component: RegisterComponent},
  {path: 'resendCode', component: ResendCodeComponent},
  {path: 'myprofile', component: MyProfileComponent},
  {path: 'jwttokens', component: JwtComponent},
  {path: 'useractivity', component: UseractivityComponent},
  {path: 'securehome', component: SecureHomeComponent},
  {path: 'service-item-label/:itemId', component: ServiceItemLabelComponent, canActivate: [AuthGuardService]},
  {path: 'gmap', component: GmapComponent}



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
    AdminHomeComponent,
    ServiceDetailComponent,
    ServiceItemLabelComponent,
    GmapComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AgmCoreModule.forRoot({
     apiKey: environment.googleAPIKey,
     libraries: ['places', 'geometry']
   })
  ],
  providers: [
    CognitoUtil,
    AwsUtil,
    UserRegistrationService,
    UserLoginService,
    UserParametersService,
    DynamoDBService,
    AvailableTimeDDBserviceService,
    ServiceItemDDBService,
    DataMapService,
    AuthGuardService,
    CommonUtilService,
    DataAvailabilityMapService,
    GmapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
