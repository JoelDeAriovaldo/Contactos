import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-dados',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
})
export class DetalhesPage implements OnInit {
  dadosSalvos: any[] = [];
  constructor(public storage: StorageService, private router: Router) {}
  ngOnInit(): void {
    this.dadosSalvos = history.state.dadosSalvos || [];
    throw new Error('Method not implemented.');
  }

  voltar(): void {
    window.location.href = '/home';
  }
}
