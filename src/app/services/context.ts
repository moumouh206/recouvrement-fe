import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  // Use a BehaviorSubject to store the current exercice.
  // It starts as null, meaning no exercice is selected.
  // It will emit its current value to any new subscribers.
  private selectedExerciceSubject = new BehaviorSubject<number | null>(null);

  // Public observable that components can subscribe to.
  public selectedExercice$ = this.selectedExerciceSubject.asObservable();

  constructor() {}

  // Method to set the exercice. This will notify all subscribers.
  setExercice(exercice: number): void {
    if (exercice) {
      this.selectedExerciceSubject.next(exercice);
      // Optional: Store in localStorage to persist across page reloads
      localStorage.setItem('selectedExercice', exercice.toString());
    }
  }

  // Method to get the current value synchronously
  getCurrentExercice(): number | null {
    return this.selectedExerciceSubject.getValue();
  }

  // Method to load the exercice from localStorage on app start
  loadInitialExercice(): void {
    const savedExercice = localStorage.getItem('selectedExercice');
    if (savedExercice) {
      this.selectedExerciceSubject.next(parseInt(savedExercice, 10));
    }
  }

  // Method to clear the context (e.g., on logout)
  clearExercice(): void {
    this.selectedExerciceSubject.next(null);
    localStorage.removeItem('selectedExercice');
  }
}
