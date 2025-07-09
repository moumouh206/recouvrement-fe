import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// --- Interfaces for our Report Definitions ---
interface ReportParameter {
  name: string;
  label: string;
  type: 'date' | 'select' | 'text';
  options?: string[]; // For select type
  required: boolean;
}

interface Report {
  code: string;
  title: string;
  description: string;
  category:
    | 'Prise en Charge & Suivi'
    | 'Recouvrement & Recettes'
    | 'Poursuites & Oppositions'
    | 'Spécifiques';
  parameters: ReportParameter[];
}

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reporting.html',
  styleUrl: './reporting.css',
})
export class ReportingComponent implements OnInit {
  // --- Master List of All Reports (from CSFD) ---
  allReports: Report[] = [
    // Category: Prise en Charge & Suivi
    {
      code: 'RVT 04',
      title: 'État Détaillé des Prises en Charge (CGA7)',
      category: 'Prise en Charge & Suivi',
      parameters: [
        {
          name: 'dateDebut',
          label: 'Date de Début',
          type: 'date',
          required: true,
        },
        { name: 'dateFin', label: 'Date de Fin', type: 'date', required: true },
      ],
      description: ''
    },
    {
      code: 'RVT 05',
      title: 'État Détaillé des Restes à Recouvrer (CGA8)',
      category: 'Prise en Charge & Suivi',
      parameters: [
        {
          name: 'dateSnapshot',
          label: "Date d'arrêté",
          type: 'date',
          required: true,
        },
      ],
      description: ''
    },
    {
      code: 'RVT 06',
      title: 'Bordereau Récapitulatif Prise en Charge/Recouvrement (CGA9)',
      category: 'Prise en Charge & Suivi',
      parameters: [
        {
          name: 'dateDebut',
          label: 'Date de Début',
          type: 'date',
          required: true,
        },
        { name: 'dateFin', label: 'Date de Fin', type: 'date', required: true },
      ],
      description: ''
    },
    {
      code: 'RVT 14',
      title: 'Certificat de Prise en Charge (Arrêts/Débets)',
      category: 'Prise en Charge & Suivi',
      parameters: [
        {
          name: 'numArret',
          label: "Numéro de l'Arrêt/Débet",
          type: 'text',
          required: true,
        },
      ],
      description: ''
    },
    // Category: Recouvrement & Recettes
    {
      code: 'RVT 07',
      title: 'Bordereau Récapitulatif des Recettes (CGA10)',
      category: 'Recouvrement & Recettes',
      parameters: [
        {
          name: 'dateDebut',
          label: 'Date de Début',
          type: 'date',
          required: true,
        },
        { name: 'dateFin', label: 'Date de Fin', type: 'date', required: true },
      ],
      description: ''
    },
    {
      code: 'RVT 08',
      title: 'État des Recouvrements par Chapitre (Wilaya/EPA)',
      category: 'Recouvrement & Recettes',
      parameters: [
        {
          name: 'budget',
          label: 'Budget',
          type: 'select',
          options: ['Budget Wilaya', 'Budget EPA'],
          required: true,
        },
        {
          name: 'dateDebut',
          label: 'Date de Début',
          type: 'date',
          required: true,
        },
        { name: 'dateFin', label: 'Date de Fin', type: 'date', required: true },
      ],
      description: ''
    },
    {
      code: 'RVT 11',
      title: 'Situation Détaillée des Recettes Budgétaires (TR5)',
      category: 'Recouvrement & Recettes',
      parameters: [
        {
          name: 'dateDebut',
          label: 'Date de Début',
          type: 'date',
          required: true,
        },
        { name: 'dateFin', label: 'Date de Fin', type: 'date', required: true },
      ],
      description: ''
    },
    {
      code: 'RVT 16',
      title: 'État Détaillé Recouvrements Arrêts/Débets',
      category: 'Recouvrement & Recettes',
      parameters: [
        {
          name: 'dateDebut',
          label: 'Date de Début',
          type: 'date',
          required: true,
        },
        { name: 'dateFin', label: 'Date de Fin', type: 'date', required: true },
      ],
      description: ''
    },
    // Category: Poursuites & Oppositions
    {
      code: 'RVT 01',
      title: 'Sommation sans Frais',
      category: 'Poursuites & Oppositions',
      parameters: [
        {
          name: 'numOrdre',
          label: "Numéro de l'Ordre de Recette",
          type: 'text',
          required: true,
        },
      ],
      description: ''
    },
    {
      code: 'RVT 02',
      title: 'Avis à Tiers Détenteur (ATD)',
      category: 'Poursuites & Oppositions',
      parameters: [
        {
          name: 'numOrdre',
          label: "Numéro de l'Ordre de Recette",
          type: 'text',
          required: true,
        },
      ],
      description: ''
    },
    {
      code: 'RVT 17',
      title: "Fiche d'Opposition",
      category: 'Poursuites & Oppositions',
      parameters: [
        {
          name: 'numOrdre',
          label: "Numéro de l'Ordre de Recette",
          type: 'text',
          required: true,
        },
      ],
      description: ''
    },
    {
      code: 'RVT 21',
      title: 'État des Recouvrements par Oppositions',
      category: 'Poursuites & Oppositions',
      parameters: [
        {
          name: 'dateDebut',
          label: 'Date de Début',
          type: 'date',
          required: true,
        },
        { name: 'dateFin', label: 'Date de Fin', type: 'date', required: true },
      ],
      description: ''
    },
  ];

  reportCategories: string[] = [];

  // Modal control
  isModalOpen = false;
  selectedReport: Report | null = null;
  reportForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Dynamically get unique categories from the reports list
    this.reportCategories = [
      ...new Set(this.allReports.map((r) => r.category)),
    ];
  }

  getReportsByCategory(category: string): Report[] {
    return this.allReports.filter((r) => r.category === category);
  }

  openModal(report: Report): void {
    this.selectedReport = report;
    // Dynamically build the form based on the report's parameters
    const formControls: { [key: string]: any } = {};
    for (const param of report.parameters) {
      const value =
        param.type === 'date' ? new Date().toISOString().split('T')[0] : '';
      formControls[param.name] = [value];
    }
    this.reportForm = this.fb.group(formControls);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedReport = null;
  }

  generateReport(format: 'PDF' | 'Excel'): void {
    if (this.reportForm.valid && this.selectedReport) {
      console.log(
        `Génération du rapport: ${this.selectedReport.title} (${this.selectedReport.code})`
      );
      console.log(`Format: ${format}`);
      console.log('Paramètres:', this.reportForm.value);

      // In a real app, you would call a service that returns a Blob or opens a new window
      // this.reportingService.generate(this.selectedReport.code, this.reportForm.value, format).subscribe(...)

      alert(
        `Le rapport "${this.selectedReport.title}" au format ${format} a été généré.\n(Vérifiez la console pour les détails)`
      );
      this.closeModal();
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
}
