import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// --- Interfaces for our data models ---
interface BaseRef {
  id: number;
  libelle: string;
}

interface Budget extends BaseRef {}
interface TypeRecette extends BaseRef {
  code: string;
}
interface ModePaiement extends BaseRef {}

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-parametres.html',
  styleUrl: './admin-parametres.css',
})
export class AdminParametresComponent implements OnInit {
  activeTab: 'budgets' | 'typesRecette' | 'modesPaiement' = 'budgets';

  // --- Forms for adding new items ---
  budgetForm!: FormGroup;
  typeRecetteForm!: FormGroup;
  modePaiementForm!: FormGroup;

  // --- Mock Data Collections ---
  budgets: Budget[] = [
    { id: 1, libelle: "Budget d'État" },
    { id: 2, libelle: 'Budget EPA' },
    { id: 3, libelle: 'Budget Wilaya' },
    { id: 4, libelle: 'Comptes Spéciaux du Trésor' },
  ];

  typesRecette: TypeRecette[] = [
    { id: 1, code: 'PEC', libelle: 'Prise en charge' },
    { id: 2, code: 'REP', libelle: 'Reprise' },
    { id: 3, code: 'RED', libelle: 'Réduction' },
    { id: 4, code: 'ANN', libelle: 'Annulation' },
    { id: 5, code: 'NV', libelle: 'Non-valeur' },
  ];

  modesPaiement: ModePaiement[] = [
    { id: 1, libelle: 'Espèces' },
    { id: 2, libelle: 'Chèque' },
    { id: 3, libelle: 'Virement bancaire' },
    { id: 4, libelle: 'Versement CCP' },
    { id: 5, libelle: 'Avis à Tiers Détenteur (ATD)' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize forms
    this.budgetForm = this.fb.group({
      libelle: ['', Validators.required],
    });
    this.typeRecetteForm = this.fb.group({
      code: ['', Validators.required],
      libelle: ['', Validators.required],
    });
    this.modePaiementForm = this.fb.group({
      libelle: ['', Validators.required],
    });
  }

  selectTab(tab: 'budgets' | 'typesRecette' | 'modesPaiement'): void {
    this.activeTab = tab;
  }

  // --- Generic Add/Delete Functions for Simulation ---

  // A generic function to add an item to any list
  addItem(listName: 'budgets' | 'typesRecette' | 'modesPaiement'): void {
    let form: FormGroup;
    let list: any[];

    switch (listName) {
      case 'budgets':
        form = this.budgetForm;
        list = this.budgets;
        break;
      case 'typesRecette':
        form = this.typeRecetteForm;
        list = this.typesRecette;
        break;
      case 'modesPaiement':
        form = this.modePaiementForm;
        list = this.modesPaiement;
        break;
    }

    if (form.valid) {
      const newId = Math.max(...list.map((item) => item.id), 0) + 1;
      const newItem = { id: newId, ...form.value };
      list.push(newItem);
      form.reset();
      alert(`'${newItem.libelle}' a été ajouté avec succès.`);
    }
  }

  // A generic function to delete an item from any list
  deleteItem(
    listName: 'budgets' | 'typesRecette' | 'modesPaiement',
    id: number
  ): void {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'
      )
    ) {
      let list: any[];
      switch (listName) {
        case 'budgets':
          this.budgets = this.budgets.filter((item) => item.id !== id);
          break;
        case 'typesRecette':
          this.typesRecette = this.typesRecette.filter(
            (item) => item.id !== id
          );
          break;
        case 'modesPaiement':
          this.modesPaiement = this.modesPaiement.filter(
            (item) => item.id !== id
          );
          break;
      }
      alert('Élément supprimé.');
    }
  }
}
