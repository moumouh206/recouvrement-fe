import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

// --- Data Models for Dashboard KPIs ---
interface KpiCard {
  title: string;
  value: string;
  change: number; // Positive or negative percentage change
  icon: 'wallet' | 'clock' | 'check' | 'warning';
  color: 'blue' | 'yellow' | 'green' | 'red';
}

interface RecouvrementParMois {
  mois: string;
  montant: number;
}

interface RepartitionParStatut {
  statut: string;
  nombre: number;
  couleur: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // --- Mock Data for KPIs and Charts ---
  kpiCards: KpiCard[] = [
    {
      title: 'Montant Total à Recouvrer',
      value: '12,450,780 DZD',
      change: 2.5,
      icon: 'wallet',
      color: 'blue',
    },
    {
      title: 'Ordres en Retard (> 30j)',
      value: '189 Ordres',
      change: -5,
      icon: 'clock',
      color: 'yellow',
    },
    {
      title: 'Recouvrements (30 derniers jours)',
      value: '3,120,500 DZD',
      change: 15,
      icon: 'check',
      color: 'green',
    },
    {
      title: 'Dossiers en Poursuite (ATD)',
      value: '89 Dossiers',
      change: 10,
      icon: 'warning',
      color: 'red',
    },
  ];

  recouvrementsData: RecouvrementParMois[] = [
    { mois: 'Fév', montant: 2100000 },
    { mois: 'Mar', montant: 1800000 },
    { mois: 'Avr', montant: 2500000 },
    { mois: 'Mai', montant: 2300000 },
    { mois: 'Juin', montant: 3100000 },
    { mois: 'Juil', montant: 3120500 },
  ];

  repartitionData: RepartitionParStatut[] = [
    { statut: 'En attente', nombre: 1254, couleur: '#FFF176' }, // amber-400
    { statut: 'Partiellement Payé', nombre: 430, couleur: '#4FC3F7' }, // blue-500
    { statut: 'En Poursuite', nombre: 189, couleur: '#EC407A' }, // red-500
    { statut: 'Soldé', nombre: 8540, couleur: '#8BC34A' }, // green-500
  ];

  // --- Chart.js instance variables ---
  @ViewChild('recouvrementChart') private recouvrementChartRef!: ElementRef;
  recouvrementChart: Chart | undefined;

  @ViewChild('repartitionChart') private repartitionChartRef!: ElementRef;
  repartitionChart: Chart | undefined;

  constructor() {}

  ngOnInit(): void {
    // Data processing can happen here
  }

  // We use AfterViewInit to ensure the <canvas> elements are available in the DOM
  ngAfterViewInit(): void {
    this.initRecouvrementChart();
    this.initRepartitionChart();
  }

  // --- Chart Initialization ---
  initRecouvrementChart(): void {
    if (this.recouvrementChartRef?.nativeElement) {
      const ctx = this.recouvrementChartRef.nativeElement.getContext('2d');
      this.recouvrementChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.recouvrementsData.map((d) => d.mois),
          datasets: [
            {
              label: 'Montant Recouvré (DZD)',
              data: this.recouvrementsData.map((d) => d.montant),
              backgroundColor: '#187181',
              borderColor: '#0f5b69',
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${(context.raw as number).toLocaleString()} DZD`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `${Number(value) / 1000000}M`,
              },
            },
          },
        },
      });
    }
  }

  initRepartitionChart(): void {
    if (this.repartitionChartRef?.nativeElement) {
      const ctx = this.repartitionChartRef.nativeElement.getContext('2d');
      this.repartitionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.repartitionData.map((d) => d.statut),
          datasets: [
            {
              data: this.repartitionData.map((d) => d.nombre),
              backgroundColor: this.repartitionData.map((d) => d.couleur),
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    }
  }

  // Proper cleanup to prevent memory leaks
  ngOnDestroy(): void {
    this.recouvrementChart?.destroy();
    this.repartitionChart?.destroy();
  }

  // --- Helper Functions for Template ---
  getKpiColorClasses(color: 'blue' | 'yellow' | 'green' | 'red'): {
    bg: string;
    text: string;
  } {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'yellow':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'red':
        return { bg: 'bg-red-100', text: 'text-red-600' };
    }
  }
}
