import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// ---> 1. IMPORT FormsModule
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Data model for a Redevable (Debtor)
export interface Redevable {
  // ... interface remains the same
  id: number;
  type: 'Personne Physique' | 'Personne Morale';
  nomRaisonSociale: string;
  nif: string;
  nss?: string;
  rc?: string;
  adresse: string;
  telephone: string;
}

@Component({
  selector: 'app-redevable-list',
  standalone: true,
  // ---> 2. ADD FormsModule to the imports array
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './redevable-list.html',
})
export class RedevableListComponent implements OnInit {
  // ... the rest of the component code remains exactly the same

  // --- Mock Data ---
  allRedevables: Redevable[] = [
    {
      id: 1,
      type: 'Personne Morale',
      nomRaisonSociale: 'SARL Tech Solutions',
      nif: '001234567890123',
      rc: '16/00-123456 B 16',
      adresse: 'Cité 1200 Logts, Bab Ezzouar, Alger',
      telephone: '021 55 66 77',
    },
    {
      id: 2,
      type: 'Personne Morale',
      nomRaisonSociale: 'Établissement Benali',
      nif: '002345678901234',
      rc: '06/00-987654 A 06',
      adresse: 'Rue de la Liberté, Oran',
      telephone: '041 22 33 44',
    },
    {
      id: 3,
      type: 'Personne Physique',
      nomRaisonSociale: 'Amine Khelfoui',
      nif: '199012345678901',
      nss: '190123456789',
      adresse: '24 Rue Didouche Mourad, Alger',
      telephone: '0550 11 22 33',
    },
    {
      id: 4,
      type: 'Personne Morale',
      nomRaisonSociale: 'Global Imports',
      nif: '004567890123456',
      rc: '31/00-543210 B 31',
      adresse: 'Zone Industrielle, Sétif',
      telephone: '036 88 99 00',
    },
  ];
  filteredRedevables: Redevable[] = [];

  // --- Component State ---
  isModalOpen = false;
  isEditMode = false;
  redevableForm!: FormGroup;
  selectedRedevableId: number | null = null;
  searchTerm = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.redevableForm = this.fb.group({
      type: ['Personne Morale', Validators.required],
      nomRaisonSociale: ['', Validators.required],
      nif: ['', [Validators.required, Validators.pattern('^[0-9]{15}$')]],
      nss: [''],
      rc: [''],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
    });
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRedevables = this.allRedevables.filter(
      (r) =>
        r.nomRaisonSociale.toLowerCase().includes(term) || r.nif.includes(term)
    );
  }

  // --- Modal and Form Handling ---
  openModal(redevable?: Redevable): void {
    if (redevable) {
      // Editing existing redevable
      this.isEditMode = true;
      this.selectedRedevableId = redevable.id;
      this.redevableForm.patchValue(redevable);
    } else {
      // Adding new redevable
      this.isEditMode = false;
      this.selectedRedevableId = null;
      this.redevableForm.reset({ type: 'Personne Morale' });
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.redevableForm.invalid) {
      return;
    }

    if (this.isEditMode && this.selectedRedevableId !== null) {
      // Update existing
      const index = this.allRedevables.findIndex(
        (r) => r.id === this.selectedRedevableId
      );
      if (index !== -1) {
        this.allRedevables[index] = {
          id: this.selectedRedevableId,
          ...this.redevableForm.value,
        };
        alert('Redevable mis à jour avec succès.');
      }
    } else {
      // Add new
      const newId = Math.max(...this.allRedevables.map((r) => r.id), 0) + 1;
      const newRedevable = { id: newId, ...this.redevableForm.value };
      this.allRedevables.push(newRedevable);
      alert('Nouveau redevable ajouté avec succès.');
    }

    this.applyFilter();
    this.closeModal();
  }

  deleteRedevable(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce redevable ?')) {
      this.allRedevables = this.allRedevables.filter((r) => r.id !== id);
      this.applyFilter();
      alert('Redevable supprimé.');
    }
  }
}
