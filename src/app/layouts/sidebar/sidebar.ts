import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true, // Add standalone: true
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  isPriseEnChargeMenuOpen = false;
  isAdministrationMenuOpen = false;

  togglePriseEnChargeMenu(): void {
    this.isPriseEnChargeMenuOpen = !this.isPriseEnChargeMenuOpen;
    // Close other menus if open
    this.isAdministrationMenuOpen = false;
  }

  toggleAdministrationMenu(): void {
    this.isAdministrationMenuOpen = !this.isAdministrationMenuOpen;
    // Close other menus if open
    this.isPriseEnChargeMenuOpen = false;
  }
}
