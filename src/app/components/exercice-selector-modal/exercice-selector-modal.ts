import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextService } from '../../services/context';

@Component({
  selector: 'app-exercice-selector-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercice-selector-modal.html',
})
export class ExerciceSelectorModalComponent {
  selectedExercice: number | null = new Date().getFullYear(); // Default to current year
  exercices: number[] = this.getExerciceList();

  // This will be used if the modal is closable by the user
  @Output() exerciceSelected = new EventEmitter<number>();

  constructor(private contextService: ContextService) {}

  // Generate a list of recent years
  private getExerciceList(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }

  confirmSelection(): void {
    if (this.selectedExercice) {
      this.contextService.setExercice(this.selectedExercice);
      this.exerciceSelected.emit(this.selectedExercice);
    } else {
      alert('Veuillez sélectionner un exercice pour continuer.');
    }
  }
}
