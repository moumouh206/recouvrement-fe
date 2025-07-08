import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Bordereau } from '../bordereau-list/bordereau-list'; // We reuse the same interface

@Component({
  selector: 'app-bordereau-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './bordereau-details.html',
})
export class BordereauDetailsComponent {
  // Input property to receive the bordereau data from the parent component
  @Input() bordereau: Bordereau | null = null;

  // Output event to notify the parent component to close the panel
  @Output() closePanel = new EventEmitter<void>();

  onClose(): void {
    this.closePanel.emit();
  }

  // Helper function for dynamic status badge colors
  getStatusClass(statut: 'Validé' | 'En attente' | 'Rejeté'): string {
    switch (statut) {
      case 'Validé':
        return 'bg-green-100 text-green-800 ring-green-600/20';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      case 'Rejeté':
        return 'bg-red-100 text-red-800 ring-red-600/20';
    }
  }
}
