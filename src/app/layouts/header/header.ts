// src/app/layouts/header/header.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important pour ngIf et ngClass
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink], // Ajouter CommonModule
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  // Variable pour contrôler l'état du menu utilisateur
  isUserMenuOpen = false;

  // Variable pour contrôler l'état du menu de notifications
  isNotificationsMenuOpen = false;

  // Méthode pour basculer l'état du menu utilisateur
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    // On s'assure que l'autre menu est fermé
    if (this.isUserMenuOpen) {
      this.isNotificationsMenuOpen = false;
    }
  }

  // Méthode pour basculer l'état du menu de notifications
  toggleNotificationsMenu(): void {
    this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen;
    // On s'assure que l'autre menu est fermé
    if (this.isNotificationsMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }
}
