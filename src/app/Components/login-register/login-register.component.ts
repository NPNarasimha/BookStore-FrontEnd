import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../Services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: false,
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss'
})
export class LoginRegisterComponent implements OnInit {
  hidePassword: boolean = true;
  RegisterForm!: FormGroup
  LoginForm!: FormGroup;
  constructor(private service: UserService, private snackbar: MatSnackBar,private router:Router) { }
  ngOnInit(): void {
     this.LoginForm =new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password:new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.RegisterForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
  
  Register() {
    if (this.RegisterForm.valid) {
      const formdata = this.RegisterForm.value
      console.log("Register successfull ", formdata);
      const payload = {
        firstname: this.RegisterForm.value.firstname,
        lastname: this.RegisterForm.value.lastname,
        email: this.RegisterForm.value.email,
        password: this.RegisterForm.value.password
      };
      this.service.register(payload).subscribe({
        next: (result: any) => {
          console.log(result);
         this.snackbar.open('Signup successful!', 'Close', {
               duration: 3000,
              
            });
          },
        error: (err) => {
          this.snackbar.open('Signup unsuccessful!.Please try again.', 'Close', {
            duration: 3000,
          });
        }
      });

    } else {
      this.snackbar.open('Please fill all fields correctly.', 'Close', {
        duration: 3000,
        
      });
    }
  }
  Login(){
      if (this.LoginForm.valid) {
      console.log('Login Successful', this.LoginForm.value);
      const payload = {
        email:this.LoginForm.value.email,
        password:this.LoginForm.value.password
      };
      this.service.login(payload).subscribe({
        next:(result:any)=>{
            console.log(result);
            const token=result?.data?.accessToken;
            if(token){
              localStorage.setItem('token',token);
              this.router.navigate(['dashboard'])
              console.log("token stored",token);
              this.snackbar.open('Login Successful!', 'Close', {
            duration: 1000,
            panelClass: ['success-snackbar'],
          });
        }
        else {
          console.error('No token found in response');
          this.snackbar.open('Login failed: No token received', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      },
      error: (err) => {
        console.error('Login Error:', err);
        this.snackbar.open(
          'Login failed. Please check your credentials.',
          'Close',
          {
            duration: 2000,
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
    }
  }
}
