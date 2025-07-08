import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// ---> 1. ADD 'Mainlevée émise' to the action types
export interface PoursuiteAction {
  type:
    | 'Sommation sans frais'
    | 'Copie de Titre'
    | 'Avis à Tiers Détenteur (ATD)'
    | 'Mainlevée émise';
  dateAction: Date;
  agent: string;
  documentRef?: string;
}

// ---> 2. ADD 'Mainlevée émise' to the status types
export interface OrdreEnPoursuite {
  id: number;
  numeroOrdre: string;
  redevable: string;
  nif: string;
  dateEmission: Date;
  montantRestant: number;
  joursDeRetard: number;
  etapeActuelle:
    | 'À traiter'
    | 'Sommation envoyée'
    | 'ATD émis'
    | 'Mainlevée émise';
  historiqueActions: PoursuiteAction[];
}

@Component({
  selector: 'app-poursuite-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './poursuite-list.html',
})
export class PoursuiteListComponent implements OnInit {
  // ---> 3. UPDATE MOCK DATA to include an order with a mainlevée
  allPoursuites: OrdreEnPoursuite[] = [
    {
      id: 103,
      numeroOrdre: 'TP-2024-1122',
      redevable: 'SARL Infra SARL',
      nif: '003456789012345',
      dateEmission: new Date('2024-04-10'),
      montantRestant: 85000,
      joursDeRetard: 125,
      etapeActuelle: 'Sommation envoyée',
      historiqueActions: [
        {
          type: 'Sommation sans frais',
          dateAction: new Date('2024-07-20'),
          agent: 'M. FERKHI Mouloud',
          documentRef: 'RVT_01_2024_103',
        },
      ],
    },
    {
      id: 205,
      numeroOrdre: 'TP-2024-0987',
      redevable: 'Entreprise de Construction BTP',
      nif: '005678901234567',
      dateEmission: new Date('2024-06-01'),
      montantRestant: 320000,
      joursDeRetard: 73,
      etapeActuelle: 'À traiter',
      historiqueActions: [],
    },
    {
      id: 206,
      numeroOrdre: 'AM-2023-1201',
      redevable: 'Anciens Ets. Dupond',
      nif: '006789012345678',
      dateEmission: new Date('2023-11-15'),
      montantRestant: 45000,
      joursDeRetard: 271,
      etapeActuelle: 'ATD émis',
      historiqueActions: [
        {
          type: 'Sommation sans frais',
          dateAction: new Date('2024-01-15'),
          agent: 'M. SABTI Ahmed',
        },
        {
          type: 'Copie de Titre',
          dateAction: new Date('2024-02-20'),
          agent: 'M. SABTI Ahmed',
        },
        {
          type: 'Avis à Tiers Détenteur (ATD)',
          dateAction: new Date('2024-04-01'),
          agent: 'M. FERKHI Mouloud',
          documentRef: 'RVT_02_2024_206',
        },
      ],
    },
    {
      id: 207,
      numeroOrdre: 'TP-2024-1010',
      redevable: 'Fournitures Générales Plus',
      nif: '007890123456789',
      dateEmission: new Date('2024-05-15'),
      montantRestant: 15000,
      joursDeRetard: 90,
      etapeActuelle: 'À traiter',
      historiqueActions: [],
    },
    // This new entry already has a mainlevée for demonstration
    {
      id: 208,
      numeroOrdre: 'CS-2023-0800',
      redevable: 'Consulting Services',
      nif: '008901234567890',
      dateEmission: new Date('2023-10-01'),
      montantRestant: 0,
      joursDeRetard: 305,
      etapeActuelle: 'Mainlevée émise',
      historiqueActions: [
        {
          type: 'Sommation sans frais',
          dateAction: new Date('2024-01-10'),
          agent: 'M. SABTI Ahmed',
        },
        {
          type: 'Avis à Tiers Détenteur (ATD)',
          dateAction: new Date('2024-03-15'),
          agent: 'M. FERKHI Mouloud',
          documentRef: 'RVT_02_2024_208',
        },
        {
          type: 'Mainlevée émise',
          dateAction: new Date('2024-05-20'),
          agent: 'M. FERKHI Mouloud',
          documentRef: 'RVT_20_2024_208',
        },
      ],
    },
  ];

  // ... filteredPoursuites, filterTerm, filterEtape, modal controls...
  filteredPoursuites: OrdreEnPoursuite[] = [];
  filterTerm = '';
  filterEtape = '';
  isModalOpen = false;
  selectedPoursuite: OrdreEnPoursuite | null = null;

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    // ... no changes to this function
    let result = this.allPoursuites;
    if (this.filterTerm) {
      const term = this.filterTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.numeroOrdre.toLowerCase().includes(term) ||
          p.redevable.toLowerCase().includes(term) ||
          p.nif.includes(term)
      );
    }
    if (this.filterEtape) {
      result = result.filter((p) => p.etapeActuelle === this.filterEtape);
    }
    this.filteredPoursuites = result;
  }

  openActionModal(poursuite: OrdreEnPoursuite): void {
    this.selectedPoursuite = {
      ...poursuite,
      historiqueActions: [...poursuite.historiqueActions],
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPoursuite = null;
  }

  // ---> 4. UPDATE executeAction TO HANDLE MAINLEVEE
  executeAction(type: PoursuiteAction['type']): void {
    if (!this.selectedPoursuite) return;

    // Add confirmation for this critical step
    if (type === 'Mainlevée émise') {
      if (
        !confirm(
          "Vous êtes sur le point d'émettre une mainlevée pour cet ATD. Cette action confirme que la dette est réglée ou qu'un accord a été trouvé. Continuer ?"
        )
      ) {
        return;
      }
    }

    const newAction: PoursuiteAction = {
      type: type,
      dateAction: new Date(),
      agent: 'M. FERKHI Mouloud',
    };

    let newStatus: OrdreEnPoursuite['etapeActuelle'] =
      this.selectedPoursuite.etapeActuelle;
    if (type === 'Sommation sans frais') {
      newStatus = 'Sommation envoyée';
      newAction.documentRef = `RVT_01_${new Date().getFullYear()}_${
        this.selectedPoursuite.id
      }`;
    } else if (type === 'Avis à Tiers Détenteur (ATD)') {
      newStatus = 'ATD émis';
      newAction.documentRef = `RVT_02_${new Date().getFullYear()}_${
        this.selectedPoursuite.id
      }`;
    } else if (type === 'Mainlevée émise') {
      newStatus = 'Mainlevée émise';
      newAction.documentRef = `RVT_20_${new Date().getFullYear()}_${
        this.selectedPoursuite.id
      }`;
      // In a real scenario, the remaining amount would be set to 0
      this.selectedPoursuite.montantRestant = 0;
    }

    // Update the local copy for the modal first
    this.selectedPoursuite.etapeActuelle = newStatus;
    this.selectedPoursuite.historiqueActions.push(newAction);

    // Then find and update the master list
    const index = this.allPoursuites.findIndex(
      (p) => p.id === this.selectedPoursuite!.id
    );
    if (index !== -1) {
      this.allPoursuites[index] = this.selectedPoursuite;
    }

    alert(
      `Action "${type}" exécutée avec succès pour l'ordre ${this.selectedPoursuite.numeroOrdre}.`
    );
    // No need to close modal, user might want to see the history update
    this.applyFilters(); // Refresh list to reflect changes
  }

  // ---> 5. UPDATE getEtapeClass TO INCLUDE THE NEW STATUS
  getEtapeClass(etape: string): string {
    switch (etape) {
      case 'À traiter':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sommation envoyée':
        return 'bg-blue-100 text-blue-800';
      case 'ATD émis':
        return 'bg-red-100 text-red-800';
      case 'Mainlevée émise':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
