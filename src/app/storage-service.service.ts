import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  FormGroup: any;
  key: any = 'cursoionic';
  private dadosSalvos: any[] = [];

  constructor() {}
  armazenarDados(info: any) {
    this.dadosSalvos.push(info);
  }

  obterDadosSalvos() {
    return this.dadosSalvos;
  }
}
