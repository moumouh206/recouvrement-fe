import { Component, EventEmitter, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Redevable } from '../../pages/redevable-list/redevable-list';

@Component({
  selector: 'app-redevable-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redevable-lookup.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RedevableLookupComponent),
      multi: true,
    },
  ],
})
export class RedevableLookupComponent implements ControlValueAccessor {
  // Mock data - In a real app, this would come from a service
  private allRedevables: Redevable[] = [
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

  searchTerm = '';
  searchResults: Redevable[] = [];
  isDropdownOpen = false;

  // --- ControlValueAccessor implementation ---
  private onChange = (value: number | null) => {};
  private onTouched = () => {};

  writeValue(value: number | null): void {
    // When the form model is set, find the redevable and set the display name
    const redevable = this.allRedevables.find((r) => r.id === value);
    this.searchTerm = redevable ? redevable.nomRaisonSociale : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // --- Component Logic ---
  onSearchChange(): void {
    if (this.searchTerm.length > 1) {
      this.isDropdownOpen = true;
      const term = this.searchTerm.toLowerCase();
      this.searchResults = this.allRedevables.filter(
        (r) =>
          r.nomRaisonSociale.toLowerCase().includes(term) ||
          r.nif.includes(term)
      );
    } else {
      this.isDropdownOpen = false;
      this.searchResults = [];
    }
  }

  selectRedevable(redevable: Redevable): void {
    this.searchTerm = redevable.nomRaisonSociale; // Update the display
    this.onChange(redevable.id); // Update the form model with the ID
    this.onTouched();
    this.isDropdownOpen = false;
  }
}
