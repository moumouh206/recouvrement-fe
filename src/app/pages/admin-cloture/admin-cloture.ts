import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-cloture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-cloture.html',
  styleUrl: './admin-cloture.css',
})
export class AdminClotureComponent {
  isProcessing = false;
  clotureDone = false;

  // This function simulates the backend process
  lancerClotureAnnuelle(): void {
    const confirmation = confirm(
      "ATTENTION : Vous êtes sur le point de lancer la clôture de l'exercice en cours.\n\n" +
        'Cette action est IRREVERSIBLE et va:\n' +
        '1. Clôturer tous les ordres de recette non soldés.\n' +
        '2. Générer les bordereaux de reprise pour le nouvel exercice.\n\n' +
        'Êtes-vous absolument certain de vouloir continuer ?'
    );

    if (confirmation) {
      this.isProcessing = true;
      this.clotureDone = false;

      // In a real application, you would call your backend API here.
      // this.apiService.lancerCloture().subscribe(...)

      // We use setTimeout to simulate a network delay of 3 seconds.
      setTimeout(() => {
        this.isProcessing = false;
        this.clotureDone = true;
        alert("La clôture de l'exercice a été effectuée avec succès !");
      }, 3000);
    }
  }
}
