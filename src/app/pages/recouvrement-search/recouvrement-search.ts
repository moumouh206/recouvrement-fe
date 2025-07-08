import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// --- Data Models ---
export interface Paiement {
  id: number;
  montant: number;
  datePaiement: Date;
  modePaiement: string;
  reference?: string;
}

export interface OrdreRecette {
  id: number;
  numeroOrdre: string;
  redevable: string;
  nif: string;
  dateEmission: Date;
  montantInitial: number;
  paiements: Paiement[]; // Array of payments
  statut:
    | 'En attente de paiement'
    | 'Partiellement payé'
    | 'Soldé'
    | 'En poursuite'
    | 'Échéancier Actif';
  echeancier?: Echeance[];
}

export interface Echeance {
  dateEcheance: Date;
  montant: number;
  statut: 'En attente' | 'Payée';
}

@Component({
  selector: 'app-recouvrement-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './recouvrement-search.html',
})
export class RecouvrementSearchComponent implements OnInit {
  searchCriteria = {
    terme: '',
    statut: '',
  };

  allOrdres: OrdreRecette[] = [
    {
      id: 101,
      numeroOrdre: 'TP-2024-1150',
      redevable: 'SARL Tech Solutions',
      nif: '001234567890123',
      dateEmission: new Date('2024-06-15'),
      montantInitial: 50000,
      paiements: [],
      statut: 'En attente de paiement',
    },
    {
      id: 102,
      numeroOrdre: 'TP-2024-1151',
      redevable: 'Établissement Benali',
      nif: '002345678901234',
      dateEmission: new Date('2024-05-20'),
      montantInitial: 120000,
      paiements: [
        {
          id: 501,
          montant: 50000,
          datePaiement: new Date('2024-07-10'),
          modePaiement: 'Chèque',
          reference: 'BCPA_456789',
        },
      ],
      statut: 'Partiellement payé',
    },
    {
      id: 103,
      numeroOrdre: 'TP-2024-1122',
      redevable: 'SARL Infra SARL',
      nif: '003456789012345',
      dateEmission: new Date('2024-04-10'),
      montantInitial: 85000,
      paiements: [
        {
          id: 502,
          montant: 25000,
          datePaiement: new Date('2024-07-30'),
          modePaiement: 'Versement',
          reference: 'V-889',
        },
      ],
      statut: 'Échéancier Actif',
      echeancier: [
        {
          dateEcheance: new Date('2024-07-30'),
          montant: 20000,
          statut: 'Payée',
        },
        {
          dateEcheance: new Date('2024-08-30'),
          montant: 20000,
          statut: 'En attente',
        },
        {
          dateEcheance: new Date('2024-09-30'),
          montant: 20000,
          statut: 'En attente',
        },
      ],
    },
    {
      id: 104,
      numeroOrdre: 'AD-2024-0034',
      redevable: 'Amine Khelfoui',
      nif: '199012345678901',
      dateEmission: new Date('2024-07-01'),
      montantInitial: 25000,
      paiements: [
        {
          id: 503,
          montant: 25000,
          datePaiement: new Date('2024-07-05'),
          modePaiement: 'Espèces',
        },
      ],
      statut: 'Soldé',
    },
    {
      id: 105,
      numeroOrdre: 'AM-2024-0512',
      redevable: 'Global Imports',
      nif: '004567890123456',
      dateEmission: new Date('2024-07-22'),
      montantInitial: 250000,
      paiements: [],
      statut: 'En poursuite',
    },
  ];

  searchResults: OrdreRecette[] = [];
  searchPerformed = false;

  isPaiementModalOpen = false;
  isEcheancierModalOpen = false;
  selectedOrdre: OrdreRecette | null = null;

  paiementModel = { montant: 0, modePaiement: 'Espèces', reference: '' };
  echeancierForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.echeancierForm = this.fb.group({
      nombreEcheances: [
        3,
        [Validators.required, Validators.min(2), Validators.max(12)],
      ],
      datePremiereEcheance: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
    });
  }

  performSearch(): void {
    this.searchPerformed = true;
    let result = this.allOrdres;

    if (this.searchCriteria.terme) {
      const termeLower = this.searchCriteria.terme.toLowerCase();
      result = result.filter(
        (o) =>
          o.numeroOrdre.toLowerCase().includes(termeLower) ||
          o.redevable.toLowerCase().includes(termeLower) ||
          o.nif.includes(termeLower)
      );
    }

    if (this.searchCriteria.statut) {
      result = result.filter((o) => o.statut === this.searchCriteria.statut);
    }

    this.searchResults = result;
  }

  resetSearch(): void {
    this.searchCriteria = { terme: '', statut: '' };
    this.searchResults = [];
    this.searchPerformed = false;
  }

  // --- HELPER FUNCTIONS ---
  getMontantRecouvre(ordre: OrdreRecette): number {
    return ordre.paiements.reduce((sum, p) => sum + p.montant, 0);
  }

  getResteAPayer(ordre: OrdreRecette): number {
    return ordre.montantInitial - this.getMontantRecouvre(ordre);
  }

  // --- Paiement Modal Logic ---
  openPaiementModal(ordre: OrdreRecette): void {
    if (ordre.statut === 'Soldé') {
      alert('Cet ordre de recette est déjà soldé.');
      return;
    }
    this.selectedOrdre = ordre;
    const resteAPayer = this.getResteAPayer(ordre);
    this.paiementModel = {
      montant: resteAPayer,
      modePaiement: 'Espèces',
      reference: '',
    };
    this.isPaiementModalOpen = true;
  }

  closePaiementModal(): void {
    this.isPaiementModalOpen = false;
    this.selectedOrdre = null;
  }

  submitPaiement(): void {
    if (!this.selectedOrdre || this.paiementModel.montant <= 0) return;

    const resteAPayer = this.getResteAPayer(this.selectedOrdre);
    if (this.paiementModel.montant > resteAPayer) {
      alert(
        `Le montant du paiement ne peut pas dépasser le reste à payer (${resteAPayer.toFixed(
          2
        )} DZD).`
      );
      return;
    }

    const ordreToUpdate = this.allOrdres.find(
      (o) => o.id === this.selectedOrdre!.id
    );
    if (ordreToUpdate) {
      const newPaiement: Paiement = {
        id: Date.now(),
        montant: this.paiementModel.montant,
        modePaiement: this.paiementModel.modePaiement,
        reference: this.paiementModel.reference,
        datePaiement: new Date(),
      };
      ordreToUpdate.paiements.push(newPaiement);

      const totalPaye = this.getMontantRecouvre(ordreToUpdate);
      if (totalPaye >= ordreToUpdate.montantInitial) {
        ordreToUpdate.statut = 'Soldé';
      } else {
        ordreToUpdate.statut = 'Partiellement payé';
      }
    }

    alert('Paiement enregistré avec succès!');
  }

  annulerPaiement(paiementId: number): void {
    if (!this.selectedOrdre) return;

    if (
      confirm(
        'Êtes-vous sûr de vouloir annuler ce paiement ? Cette action est irréversible.'
      )
    ) {
      const ordreToUpdate = this.allOrdres.find(
        (o) => o.id === this.selectedOrdre!.id
      );
      if (ordreToUpdate) {
        ordreToUpdate.paiements = ordreToUpdate.paiements.filter(
          (p) => p.id !== paiementId
        );

        const totalPaye = this.getMontantRecouvre(ordreToUpdate);
        if (
          ordreToUpdate.statut === 'Soldé' &&
          totalPaye < ordreToUpdate.montantInitial
        ) {
          ordreToUpdate.statut = 'Partiellement payé';
        } else if (totalPaye <= 0) {
          ordreToUpdate.statut = 'En attente de paiement';
        }
      }
      alert('Paiement annulé.');
    }
  }

  // --- Echeancier Modal Logic ---
  openEcheancierModal(ordre: OrdreRecette): void {
    if (ordre.statut === 'Soldé' || ordre.statut === 'Échéancier Actif') {
      alert('Un échéancier ne peut pas être créé pour cet ordre.');
      return;
    }
    this.selectedOrdre = ordre;
    this.isEcheancierModalOpen = true;
  }

  closeEcheancierModal(): void {
    this.isEcheancierModalOpen = false;
    this.selectedOrdre = null;
  }

  submitEcheancier(): void {
    if (!this.echeancierForm.valid || !this.selectedOrdre) return;

    const resteAPayer = this.getResteAPayer(this.selectedOrdre);
    const { nombreEcheances, datePremiereEcheance } = this.echeancierForm.value;
    const montantParEcheance = resteAPayer / nombreEcheances;

    const confirmation = confirm(
      `Vous êtes sur le point de créer un échéancier pour un montant de ${resteAPayer.toLocaleString()} DZD.\n\n` +
        `Détails:\n` +
        `- ${nombreEcheances} versements de ${montantParEcheance.toLocaleString(
          'fr-DZ'
        )} DZD chacun.\n` +
        `- Première échéance le ${new Date(
          datePremiereEcheance
        ).toLocaleDateString('fr-DZ')}.\n\n` +
        `Confirmer la création de cet échéancier ?`
    );

    if (confirmation) {
      const ordreToUpdate = this.allOrdres.find(
        (o) => o.id === this.selectedOrdre!.id
      );
      if (ordreToUpdate) {
        ordreToUpdate.statut = 'Échéancier Actif';
      }
      alert('Échéancier de paiement créé avec succès.');
      this.performSearch(); // Refresh the search results
      this.closeEcheancierModal();
    }
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'Soldé':
        return 'bg-green-100 text-green-800';
      case 'Partiellement payé':
        return 'bg-blue-100 text-blue-800';
      case 'Échéancier Actif':
        return 'bg-purple-100 text-purple-800';
      case 'En attente de paiement':
        return 'bg-yellow-100 text-yellow-800';
      case 'En poursuite':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
