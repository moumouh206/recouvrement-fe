import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Data model for a consigned revenue
export interface Consignation {
  id: number;
  dateConsignation: Date;
  montant: number;
  motif: string;
  provenance: string; // e.g., 'Justice', 'Douane', 'Domaine'
  statut: 'En attente de régularisation' | 'Régularisée';
  ordreRecetteAssocie?: string; // e.g., 'TP-2024-REG-001'
}

@Component({
  selector: 'app-recettes-sans-titre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './recettes-sans-titre.html',
})
export class RecettesSansTitreComponent implements OnInit {
  activeTab: 'consignation' | 'regularisation' = 'consignation';
  consignationForm!: FormGroup;

  // Mock Data
  allConsignations: Consignation[] = [
    {
      id: 301,
      dateConsignation: new Date('2024-08-10'),
      montant: 15000,
      motif: 'Amende transactionnelle',
      provenance: 'Justice',
      statut: 'En attente de régularisation',
    },
    {
      id: 302,
      dateConsignation: new Date('2024-08-05'),
      montant: 75000,
      motif: 'Vente aux enchères véhicule',
      provenance: 'Douane',
      statut: 'En attente de régularisation',
    },
    {
      id: 303,
      dateConsignation: new Date('2024-07-28'),
      montant: 22500,
      motif: 'Frais de dossier',
      provenance: 'Domaine',
      statut: 'Régularisée',
      ordreRecetteAssocie: 'TP-2024-REG-303',
    },
    {
      id: 304,
      dateConsignation: new Date('2024-08-12'),
      montant: 5000,
      motif: 'Pénalités de retard',
      provenance: 'Justice',
      statut: 'En attente de régularisation',
    },
  ];

  // List for display on the 'regularisation' tab
  consignationsEnAttente: Consignation[] = [];

  // Modal Control for Regularization
  isModalOpen = false;
  selectedConsignation: Consignation | null = null;
  regularisationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.consignationForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      provenance: ['', Validators.required],
      motif: ['', Validators.required],
      dateConsignation: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
    });

    this.regularisationForm = this.fb.group({
      numeroOrdre: ['', Validators.required],
    });

    this.filterConsignationsEnAttente();
  }

  filterConsignationsEnAttente(): void {
    this.consignationsEnAttente = this.allConsignations.filter(
      (c) => c.statut === 'En attente de régularisation'
    );
  }

  // Switch between tabs
  selectTab(tab: 'consignation' | 'regularisation'): void {
    this.activeTab = tab;
  }

  // --- Consignation Logic ---
  submitConsignation(): void {
    if (this.consignationForm.valid) {
      const newId = Math.max(...this.allConsignations.map((c) => c.id)) + 1;
      const newConsignation: Consignation = {
        id: newId,
        statut: 'En attente de régularisation',
        ...this.consignationForm.value,
      };

      this.allConsignations.unshift(newConsignation); // Add to the beginning of the main list
      this.filterConsignationsEnAttente(); // Refresh the pending list

      alert('Recette consignée avec succès !');
      this.consignationForm.reset({
        dateConsignation: new Date().toISOString().split('T')[0],
      });
      this.activeTab = 'regularisation'; // Switch to the next step
    } else {
      this.consignationForm.markAllAsTouched();
    }
  }

  // --- Regularization Modal Logic ---
  openRegularisationModal(consignation: Consignation): void {
    this.selectedConsignation = consignation;
    this.regularisationForm.reset();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedConsignation = null;
  }

  submitRegularisation(): void {
    if (this.regularisationForm.valid && this.selectedConsignation) {
      const numeroOrdre = this.regularisationForm.get('numeroOrdre')?.value;

      // Find the item in the main list and update it
      const itemToUpdate = this.allConsignations.find(
        (c) => c.id === this.selectedConsignation!.id
      );
      if (itemToUpdate) {
        itemToUpdate.statut = 'Régularisée';
        itemToUpdate.ordreRecetteAssocie = numeroOrdre;
      }

      this.filterConsignationsEnAttente(); // Refresh the pending list, the item will disappear
      alert(
        `La recette a été régularisée avec l'ordre de recette N° ${numeroOrdre}.`
      );
      this.closeModal();
    }
  }

  // Helper for status badge colors
  getStatusClass(
    statut: 'En attente de régularisation' | 'Régularisée'
  ): string {
    return statut === 'En attente de régularisation'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-green-100 text-green-800';
  }
}
