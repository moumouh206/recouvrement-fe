import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RedevableLookupComponent } from '../../components/redevable-lookup/redevable-lookup';

export interface Ordre {
  id: number;
  numeroOrdre: string;
  redevableId: number;
  redevableNom: string;
  montantTotal: number;
}

@Component({
  selector: 'app-bordereau-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CurrencyPipe,
    RedevableLookupComponent,
  ],
  templateUrl: './bordereau-create.html',
})
export class BordereauCreateComponent implements OnInit {
  currentStep: 'step1' | 'step2' = 'step1';
  bordereauForm!: FormGroup;
  ordreForm!: FormGroup;
  ordresDuBordereau: Ordre[] = [];

  // --- NEW PROPERTIES FOR VALIDATION ---
  totalAmountOfOrders = 0;
  remainingAmount = 0;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // --- Step 1 Form: Add montant_brd back ---
    this.bordereauForm = this.fb.group({
      num_bord: ['', Validators.required],
      montant_brd: [0, [Validators.required, Validators.min(1)]], // <-- RE-ADDED
      date_emission: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      poste_comptable: ['', Validators.required],
      id_compte_Ref_Compte_Budget: ['', Validators.required],
      id_nat_budget: ['', Validators.required],
      nature_recette: ['', Validators.required],
      ID_MODE_RCT: ['', Validators.required],
      ID_TYPE_RCT: ['Prise en charge', Validators.required],
      ID_AXE_ADM: ['', Validators.required],
      ID_AXE_ECO: ['', Validators.required],
      ID_AXE_PROG: [''],
      id_chapitre: [''],
      type_chargement: ['Manuel', Validators.required],
    });

    this.ordreForm = this.fb.group({
      numeroOrdre: ['', Validators.required],
      redevableId: [null, Validators.required],
      lignes: this.fb.array([]),
    });

    this.addLigne();
  }

  // --- Stepper Navigation ---
  goToStep2(): void {
    if (this.bordereauForm.valid) {
      this.currentStep = 'step2';
      this.updateAmounts(); // Initial calculation
    } else {
      this.bordereauForm.markAllAsTouched();
      alert(
        'Veuillez remplir tous les champs obligatoires du bordereau avant de continuer.'
      );
    }
  }

  goToStep1(): void {
    this.currentStep = 'step1';
  }

  // --- Lignes FormArray Management ---
  get lignes(): FormArray {
    return this.ordreForm.get('lignes') as FormArray;
  }

  newLigne(): FormGroup {
    return this.fb.group({
      categorie: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(1)]],
    });
  }

  addLigne(): void {
    this.lignes.push(this.newLigne());
  }
  removeLigne(index: number): void {
    this.lignes.removeAt(index);
  }

  // --- NEW: Calculation Logic ---
  updateAmounts(): void {
    this.totalAmountOfOrders = this.ordresDuBordereau.reduce(
      (sum, ordre) => sum + ordre.montantTotal,
      0
    );
    const declaredAmount = this.bordereauForm.get('montant_brd')?.value || 0;
    this.remainingAmount = declaredAmount - this.totalAmountOfOrders;
  }

  calculateOrdreTotal(): number {
    return this.lignes.value.reduce(
      (sum: number, ligne: any) => sum + Number(ligne.montant),
      0
    );
  }

  // --- Main Actions ---
  addOrdreToList(): void {
    if (!this.ordreForm.valid) {
      alert("Veuillez remplir tous les champs de l'ordre.");
      return;
    }

    const ordreTotal = this.calculateOrdreTotal();
    // NEW VALIDATION: Check if adding this order exceeds the declared total
    if (ordreTotal > this.remainingAmount) {
      alert(
        `Erreur : Le montant de cet ordre (${ordreTotal.toLocaleString()}) dépasse le montant restant à imputer (${this.remainingAmount.toLocaleString()}).`
      );
      return;
    }

    const newOrdre: Ordre = {
      id: Date.now(),
      numeroOrdre: this.ordreForm.get('numeroOrdre')?.value,
      redevableId: this.ordreForm.get('redevableId')?.value,
      redevableNom: 'Mock Redevable Name',
      montantTotal: ordreTotal,
    };

    this.ordresDuBordereau.push(newOrdre);
    this.updateAmounts(); // Recalculate totals
    this.ordreForm.reset();
    this.lignes.clear();
    this.addLigne();
  }

  removeOrdreFromList(id: number): void {
    this.ordresDuBordereau = this.ordresDuBordereau.filter((o) => o.id !== id);
    this.updateAmounts(); // Recalculate totals
  }

  // Final submission of the entire bordereau + its orders
  submitAll(): void {
    // NEW VALIDATION: Final check before submission
    if (this.remainingAmount !== 0) {
      alert(
        `Validation échouée : La somme des ordres (${this.totalAmountOfOrders.toLocaleString()}) ne correspond pas au montant brut déclaré du bordereau (${this.bordereauForm
          .get('montant_brd')
          ?.value.toLocaleString()}).\nRestant à imputer: ${this.remainingAmount.toLocaleString()}`
      );
      return;
    }

    const finalPayload = {
      bordereau: this.bordereauForm.value,
      ordres: this.ordresDuBordereau,
    };

    console.log('FINAL SUBMISSION PAYLOAD:', finalPayload);
    alert('Bordereau et ses ordres soumis avec succès !');
    this.router.navigate(['/bordereaux']);
  }
}
