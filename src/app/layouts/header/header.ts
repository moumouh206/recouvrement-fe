import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContextService } from '../../services/context';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  // --- UI State ---
  isUserMenuOpen = false;
  isNotificationsMenuOpen = false;

  // --- Context State ---
  currentExercice: number | null = null;
  private exerciceSubscription!: Subscription;

  constructor(private contextService: ContextService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the context service to get real-time updates on the selected exercice
    this.exerciceSubscription = this.contextService.selectedExercice$.subscribe(
      (exercice) => {
        this.currentExercice = exercice;
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed to prevent memory leaks
    if (this.exerciceSubscription) {
      this.exerciceSubscription.unsubscribe();
    }
  }

  // Method to toggle the user menu dropdown
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    // Ensure the other menu is closed for a clean UI
    if (this.isUserMenuOpen) {
      this.isNotificationsMenuOpen = false;
    }
  }

  // Method to toggle the notifications menu dropdown
  toggleNotificationsMenu(): void {
    this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen;
    // Ensure the other menu is closed
    if (this.isNotificationsMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  // Method to handle user logout
  logout(): void {
    // Clear the selected exercice from the context service and localStorage
    this.contextService.clearExercice();
    // Navigate the user back to the login page
    this.router.navigate(['/login']);
  }
}
