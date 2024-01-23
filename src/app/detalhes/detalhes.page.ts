import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage-service.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ver-dados',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
})
export class DetalhesPage implements OnInit {
  dadosSalvos: any[] = [];

  constructor(public storage: StorageService, private router: Router) {}
  async ngOnInit() {
    this.dadosSalvos = await this.storage.obterDadosSalvos();
  }

  async ionViewWilEnter() {
    this.dadosSalvos = await this.storage.obterDadosSalvos();
  }
  voltar(): void {
    window.location.href = '/home';
  }

  editarDados(id: string): void {
    const index = this.dadosSalvos.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.storage.valorP = { ...this.dadosSalvos[index] };
      this.router.navigate(['/home'], { queryParams: { editId: id } });
      console.log(index);
    } else {
      alert('Dado nap encontrado para edicao');
    }
  }

  apagar(id: number) {
    this.dadosSalvos = this.dadosSalvos.filter((item) => item.id !== id);
    this.storage.armazenarDados(this.dadosSalvos);
    console.log(this.dadosSalvos, id);
  }
}
