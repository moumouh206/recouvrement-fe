import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';
import { ContextService } from '../../services/context'; // Adjust path if needed
import { ExerciceSelectorModalComponent } from '../../components/exercice-selector-modal/exercice-selector-modal'; // Adjust path if needed

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    ExerciceSelectorModalComponent,
  ],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent implements OnInit {
  showExerciceModal = false;

  constructor(private contextService: ContextService) {}

  ngOnInit(): void {
    // Attempt to load from localStorage first
    this.contextService.loadInitialExercice();

    // Check if an exercice is set. If not, show the modal.
    if (!this.contextService.getCurrentExercice()) {
      this.showExerciceModal = true;
    }
  }

  // This method is called by the modal component when an exercice is selected.
  onExerciceSelected(): void {
    this.showExerciceModal = false;
  }
}
