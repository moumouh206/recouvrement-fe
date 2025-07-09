import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Still needed for ngModel search

// Data model for a Redevable (Debtor) - remains the same
export interface Redevable {
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
  imports: [CommonModule, FormsModule], // Only CommonModule and FormsModule are needed now
  templateUrl: './redevable-list.html',
})
export class RedevableListComponent implements OnInit {
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
  isDetailsModalOpen = false;
  selectedRedevable: Redevable | null = null;
  searchTerm = '';

  constructor() {}

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRedevables = this.allRedevables.filter(
      (r) =>
        r.nomRaisonSociale.toLowerCase().includes(term) || r.nif.includes(term)
    );
  }

  // --- Modal Handling for Viewing Details ---
  openDetailsModal(redevable: Redevable): void {
    this.selectedRedevable = redevable;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedRedevable = null;
  }
}
