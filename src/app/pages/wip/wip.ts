// src/app/pages/wip/wip.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <--- ÉTAPE 1: Importer

@Component({
  selector: 'app-wip',
  standalone: true,
  imports: [RouterLink], // <--- ÉTAPE 2: Ajouter aux imports
  templateUrl: './wip.html',
  styleUrl: './wip.css',
})
export class WipComponent {
  // <--- Le nom de la classe est WipComponent
}
