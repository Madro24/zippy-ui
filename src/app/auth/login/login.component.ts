import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserLoginService} from "../../service/user-login.service";
import {CognitoCallback, LoggedInCallback} from "../../service/cognito.service";
import {DynamoDBService} from "../../service/dynamodb-services/ddb.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
  email: string;
  password: string;
  errorMessage: string;

  constructor(public router: Router,
              public ddb: DynamoDBService,
              public userService: UserLoginService) {
      console.log("LoginComponent constructor");
  }

  ngOnInit() {
    this.errorMessage = null;
    console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
    this.userService.isAuthenticated(this);
  }

  onLogin() {
      if (this.email == null || this.password == null) {
          this.errorMessage = "All fields are required";
          return;
      }
      this.errorMessage = null;
      this.userService.authenticate(this.email.toLowerCase(), this.password, this);
  }

  cognitoCallback(message: string, result: any) {
      if (message != null) { //error
          this.errorMessage = message;
          console.log("result: " + this.errorMessage);
          if (this.errorMessage === 'User is not confirmed.') {
              console.log("redirecting");
              this.router.navigate(['confirmRegistration', this.email]);
          } else if (this.errorMessage === 'User needs to set password.') {
              console.log("redirecting to set new password");
              this.router.navigate(['newPassword']);
          }
      } else { //success
           this.ddb.writeLogEntry("login");
          this.router.navigate(['/admin-home']);
      }
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
      if (isLoggedIn)
          this.router.navigate(['/admin-home']);
  }

}
