import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrdreRecette } from '../recouvrement-search/recouvrement-search'; // Reuse this model for searching

// A more accurate model for our data
export interface RecetteNonTitre {
  id: number;
  type: 'IMPUTATION_DIRECTE' | 'CONSIGNATION';
  date: Date;
  montant: number;
  motif: string;
  provenance: string;
  // Fields for direct imputation
  compteImputation?: string;
  // Fields for consignation
  statut?: 'En attente de liaison' | 'Liée';
  titreAssocie?: string;
}

@Component({
  selector: 'app-recettes-sans-titre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './recettes-sans-titre.html',
})
export class RecettesSansTitreComponent implements OnInit {
  activeTab: 'directe' | 'consignation' = 'directe';

  // Forms for each workflow
  imputationDirecteForm!: FormGroup;
  consignationForm!: FormGroup;

  // --- Mock Data ---
  allRecettes: RecetteNonTitre[] = [
    {
      id: 401,
      type: 'IMPUTATION_DIRECTE',
      date: new Date('2024-08-10'),
      montant: 15000,
      motif: 'Amende transactionnelle',
      provenance: 'Justice',
      compteImputation: '702101 - Amendes',
    },
    {
      id: 402,
      type: 'CONSIGNATION',
      date: new Date('2024-08-11'),
      montant: 75000,
      motif: 'Vente aux enchères véhicule',
      provenance: 'Douane',
      statut: 'En attente de liaison',
    },
    {
      id: 403,
      type: 'CONSIGNATION',
      date: new Date('2024-07-28'),
      montant: 22500,
      motif: 'Frais de dossier',
      provenance: 'Domaine',
      statut: 'Liée',
      titreAssocie: 'TP-2024-REG-403',
    },
  ];
  consignationsEnAttente: RecetteNonTitre[] = [];

  // --- Modal State for Linking ---
  isLinkModalOpen = false;
  selectedConsignation: RecetteNonTitre | null = null;
  ordreSearchTerm = '';
  // In a real app, this would be fetched from a service
  mockOrdresRecherche: OrdreRecette[] = [
    {
      id: 1001,
      numeroOrdre: 'TP-2024-REG-402',
      redevable: 'Acheteur Véhicule X',
      nif: 'N/A',
      dateEmission: new Date(),
      montantInitial: 75000,
      paiements: [],
      statut: 'En attente de paiement',
    },
    {
      id: 1002,
      numeroOrdre: 'TP-2024-9999',
      redevable: 'Autre Redevable',
      nif: 'N/A',
      dateEmission: new Date(),
      montantInitial: 10000,
      paiements: [],
      statut: 'En attente de paiement',
    },
  ];
  ordreSearchResults: OrdreRecette[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.imputationDirecteForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      provenance: ['Justice', Validators.required],
      compteImputation: ['', Validators.required],
      motif: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });

    this.consignationForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      provenance: ['', Validators.required],
      motif: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });

    this.updateConsignationsList();
  }

  updateConsignationsList(): void {
    this.consignationsEnAttente = this.allRecettes.filter(
      (r) => r.type === 'CONSIGNATION' && r.statut === 'En attente de liaison'
    );
  }

  selectTab(tab: 'directe' | 'consignation'): void {
    this.activeTab = tab;
  }

  // --- Workflow Handlers ---
  submitImputationDirecte(): void {
    if (this.imputationDirecteForm.valid) {
      alert('Recette imputée directement avec succès ! (Vérifiez la console)');
      console.log('Imputation Directe:', this.imputationDirecteForm.value);
      this.imputationDirecteForm.reset({
        provenance: 'Justice',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }

  submitConsignation(): void {
    if (this.consignationForm.valid) {
      const newRecette: RecetteNonTitre = {
        id: Date.now(),
        type: 'CONSIGNATION',
        statut: 'En attente de liaison',
        ...this.consignationForm.value,
      };
      this.allRecettes.push(newRecette);
      this.updateConsignationsList();
      alert('Recette consignée avec succès !');
      this.consignationForm.reset();
    }
  }

  // --- Linking Modal Logic ---
  openLinkModal(consignation: RecetteNonTitre): void {
    this.selectedConsignation = consignation;
    this.ordreSearchTerm = '';
    this.ordreSearchResults = [];
    this.isLinkModalOpen = true;
  }

  closeLinkModal(): void {
    this.isLinkModalOpen = false;
    this.selectedConsignation = null;
  }

  searchOrdre(): void {
    if (this.ordreSearchTerm.length < 2) {
      this.ordreSearchResults = [];
      return;
    }
    const term = this.ordreSearchTerm.toLowerCase();
    this.ordreSearchResults = this.mockOrdresRecherche.filter(
      (o) =>
        o.numeroOrdre.toLowerCase().includes(term) ||
        o.redevable.toLowerCase().includes(term)
    );
  }

  linkTitre(ordre: OrdreRecette): void {
    if (
      confirm(
        `Voulez-vous lier cette consignation de ${this.selectedConsignation?.montant.toLocaleString()} DZD au titre N° ${
          ordre.numeroOrdre
        } ?`
      )
    ) {
      const consignationToUpdate = this.allRecettes.find(
        (r) => r.id === this.selectedConsignation!.id
      );
      if (consignationToUpdate) {
        consignationToUpdate.statut = 'Liée';
        consignationToUpdate.titreAssocie = ordre.numeroOrdre;
      }
      this.updateConsignationsList();
      alert('Liaison effectuée avec succès.');
      this.closeLinkModal();
    }
  }
}
