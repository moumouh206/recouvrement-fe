// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html', // ou login.component.html
  styleUrls: ['./login.css'], // ou login.component.css
})
export class LoginComponent {}
