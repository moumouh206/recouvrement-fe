import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// ---> 1. IMPORT THE DETAILS COMPONENT
import { BordereauDetailsComponent } from '../bordereau-details/bordereau-details';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader';

// The interface now includes a mock array of orders for the details view
export interface Bordereau {
  id: number;
  numero: string;
  datePriseEnCharge: Date;
  ordonnateur: string;
  natureBudget:
    | "Budget d'État"
    | 'Budget EPA'
    | 'Budget Wilaya'
    | 'Comptes Spéciaux';
  type: 'Prise en charge' | 'Réduction' | 'Non-valeur';
  montant: number;
  statut: 'Validé' | 'En attente' | 'Rejeté';
  // Add mock details for demonstration
  ordres: { numero: string; redevable: string; montant: number }[];
}

@Component({
  selector: 'app-bordereau-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    BordereauDetailsComponent,
    FileUploaderComponent,
  ],
  templateUrl: './bordereau-list.html',
})
export class BordereauListComponent implements OnInit {
  // ---> 3. ADD STATE FOR THE DETAILS PANEL
  isDetailsPanelOpen = false;
  isUploadModalOpen = false;
  selectedBordereau: Bordereau | null = null;
  filteredBordereaux: Bordereau[] = [];

  // Inject the router for navigation
  constructor(private router: Router) {}

  // The rest of the component properties (allBordereaux, filteredBordereaux, filters) remain the same...
  allBordereaux: Bordereau[] = [
    {
      id: 1,
      numero: 'BGE-2024-001',
      datePriseEnCharge: new Date('2024-07-25'),
      ordonnateur: "Ministère de l'Éducation",
      natureBudget: "Budget d'État",
      type: 'Prise en charge',
      montant: 1500000,
      statut: 'Validé',
      ordres: [
        { numero: 'OR-01', redevable: 'SARL Scolaris', montant: 1500000 },
      ],
    },
    {
      id: 2,
      numero: 'EPA-2024-056',
      datePriseEnCharge: new Date('2024-07-28'),
      ordonnateur: 'Office National des Forêts',
      natureBudget: 'Budget EPA',
      type: 'Prise en charge',
      montant: 75000,
      statut: 'Validé',
      ordres: [{ numero: 'OR-02', redevable: 'EPE Foresta', montant: 75000 }],
    },
    {
      id: 3,
      numero: 'WIL-2024-102',
      datePriseEnCharge: new Date('2024-08-01'),
      ordonnateur: "Wilaya d'Alger",
      natureBudget: 'Budget Wilaya',
      type: 'Prise en charge',
      montant: 450000,
      statut: 'En attente',
      ordres: [
        { numero: 'OR-03', redevable: 'Urbanis-Alger', montant: 450000 },
      ],
    },
    {
      id: 4,
      numero: 'BGE-2024-002',
      datePriseEnCharge: new Date('2024-08-05'),
      ordonnateur: 'Direction Générale des Impôts',
      natureBudget: "Budget d'État",
      type: 'Prise en charge',
      montant: 8250000,
      statut: 'Validé',
      ordres: [
        {
          numero: 'OR-04',
          redevable: 'Grande Distribution SA',
          montant: 8250000,
        },
      ],
    },
    {
      id: 5,
      numero: 'BGE-2024-001-RD',
      datePriseEnCharge: new Date('2024-08-06'),
      ordonnateur: "Ministère de l'Éducation",
      natureBudget: "Budget d'État",
      type: 'Réduction',
      montant: -50000,
      statut: 'Validé',
      ordres: [],
    },
    {
      id: 6,
      numero: 'CS-2024-015',
      datePriseEnCharge: new Date('2024-08-10'),
      ordonnateur: 'Fonds Spécial de Solidarité',
      natureBudget: 'Comptes Spéciaux',
      type: 'Prise en charge',
      montant: 300000,
      statut: 'En attente',
      ordres: [
        { numero: 'OR-05', redevable: 'Association El Amel', montant: 300000 },
      ],
    },
    {
      id: 7,
      numero: 'EPA-2024-057',
      datePriseEnCharge: new Date('2024-08-11'),
      ordonnateur: "Agence Nationale de l'Emploi",
      natureBudget: 'Budget EPA',
      type: 'Prise en charge',
      montant: 120000,
      statut: 'Rejeté',
      ordres: [],
    },
  ];

  searchTerm = '';
  statusFilter = '';
  budgetFilter = '';
  dateFrom: string | null = null;
  dateTo: string | null = null;

  ngOnInit(): void {
    this.applyFilters();
  }
  openUploadModal(): void {
    this.isUploadModalOpen = true;
  }

  closeUploadModal(): void {
    this.isUploadModalOpen = false;
  }
  handleUploadComplete(): void {
    // When upload is "successful", we refresh the list and close the modal after a delay
    alert('Le(s) bordereau(x) du fichier ont été ajoutés à la liste.');
    this.applyFilters(); // In a real app, you'd refetch from the server
    setTimeout(() => {
      this.closeUploadModal();
    }, 1500);
  }

  applyFilters(): void {
    let result = this.allBordereaux;
    if (this.searchTerm)
      result = result.filter(
        (b) =>
          b.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          b.ordonnateur.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    if (this.statusFilter)
      result = result.filter((b) => b.statut === this.statusFilter);
    if (this.budgetFilter)
      result = result.filter((b) => b.natureBudget === this.budgetFilter);
    if (this.dateFrom)
      result = result.filter(
        (b) => b.datePriseEnCharge >= new Date(this.dateFrom!)
      );
    if (this.dateTo)
      result = result.filter(
        (b) => b.datePriseEnCharge <= new Date(this.dateTo!)
      );
    this.filteredBordereaux = result;
  }

  // --- NEW AND UPDATED ACTION HANDLERS ---
  viewDetails(bordereau: Bordereau): void {
    this.selectedBordereau = bordereau;
    this.isDetailsPanelOpen = true;
  }

  closeDetailsPanel(): void {
    this.isDetailsPanelOpen = false;
    this.selectedBordereau = null;
  }

  editBordereau(bordereau: Bordereau): void {
    // In a real app, you'd pass data via a service or state management.
    // For this prototype, we can use Navigation extras state.
    alert(
      `Redirection vers le formulaire d'édition pour le bordereau N° ${bordereau.numero}. \n(Cette fonctionnalité pré-remplirait le formulaire avec les données existantes).`
    );
    this.router.navigate(['/bordereaux/nouveau'], {
      state: { bordereauToEdit: bordereau },
    });
  }

  deleteBordereau(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bordereau ?')) {
      this.allBordereaux = this.allBordereaux.filter((b) => b.id !== id);
      this.applyFilters();
      alert('Bordereau supprimé avec succès.');
    }
  }

  getStatusClass(statut: 'Validé' | 'En attente' | 'Rejeté'): string {
    switch (statut) {
      case 'Validé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeté':
        return 'bg-red-100 text-red-800';
    }
  }
}
