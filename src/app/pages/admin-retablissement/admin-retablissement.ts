import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-retablissement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-retablissement.html',
  styleUrl: './admin-retablissement.css',
})
export class AdminRetablissementComponent implements OnInit {
  retablissementForm!: FormGroup;
  isProcessing = false;

  // Mock data for the ordonnateur dropdown
  ordonnateurs = [
    "Ministère de l'Éducation",
    'Direction Générale des Impôts',
    "Wilaya d'Alger",
    'Office National des Forêts',
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.retablissementForm = this.fb.group({
      ordonnateur: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });
  }

  submitRetablissement(): void {
    if (this.retablissementForm.valid) {
      if (
        confirm(
          "Voulez-vous vraiment lancer le rétablissement de crédit pour la période et l'ordonnateur sélectionnés ?"
        )
      ) {
        this.isProcessing = true;
        console.log(
          'Lancement du rétablissement avec les paramètres:',
          this.retablissementForm.value
        );

        // Simulate API call
        setTimeout(() => {
          this.isProcessing = false;
          alert(
            'Le processus de rétablissement de crédit a été lancé avec succès.'
          );
          this.retablissementForm.reset();
        }, 2000);
      }
    } else {
      this.retablissementForm.markAllAsTouched();
    }
  }
}
