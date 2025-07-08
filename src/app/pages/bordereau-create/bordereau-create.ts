import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// ---> 1. IMPORT THE LOOKUP COMPONENT
import { RedevableLookupComponent } from '../../components/redevable-lookup/redevable-lookup';

@Component({
  selector: 'app-bordereau-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    RedevableLookupComponent, // ---> 2. ADD IT TO IMPORTS
  ],
  templateUrl: './bordereau-create.html',
})
export class BordereauCreateComponent implements OnInit {
  bordereauForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.bordereauForm = this.fb.group({
      ordonnateur: ['', Validators.required],
      natureBudget: ['', Validators.required],
      type: ['Prise en charge', Validators.required],
      datePriseEnCharge: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      ordres: this.fb.array([]),
    });

    // Check for state from navigation (for the 'Edit' feature)
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['bordereauToEdit']) {
      console.log(
        'Editing mode, but pre-filling is not implemented in this prototype.'
      );
      // In a real app, you would use patchValue here to fill the form.
    }
  }

  // ... (get ordres, removeOrdre, lignes, newLigne, etc. all remain the same)
  get ordres(): FormArray {
    return this.bordereauForm.get('ordres') as FormArray;
  }

  newOrdre(): FormGroup {
    return this.fb.group({
      numeroOrdre: ['', Validators.required],
      // ---> 3. redevableId IS NOW A NUMBER, NOT A STRING
      redevableId: [null, Validators.required],
      montantTotalOrdre: [{ value: 0, disabled: true }],
      lignes: this.fb.array([]),
    });
  }

  addOrdre(): void {
    this.ordres.push(this.newOrdre());
  }

  removeOrdre(ordreIndex: number): void {
    this.ordres.removeAt(ordreIndex);
  }

  lignes(ordreIndex: number): FormArray {
    return this.ordres.at(ordreIndex).get('lignes') as FormArray;
  }

  newLigne(): FormGroup {
    return this.fb.group({
      categorie: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  addLigne(ordreIndex: number): void {
    this.lignes(ordreIndex).push(this.newLigne());
  }

  removeLigne(ordreIndex: number, ligneIndex: number): void {
    this.lignes(ordreIndex).removeAt(ligneIndex);
  }

  onSubmit(): void {
    if (this.bordereauForm.valid) {
      console.log('Form Submitted!');
      console.log(this.bordereauForm.getRawValue());
      alert('Bordereau soumis! Vérifiez la console pour voir les données.');
      this.router.navigate(['/bordereaux']);
    } else {
      console.log('Form is invalid.');
      this.bordereauForm.markAllAsTouched();
    }
  }
}
