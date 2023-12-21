import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  FormGroup: any;
  key: any = 'cursoionic';
  private dadosSalvos: any[] = [];
  static state: any;

  constructor() {}
  async armazenarDados(info: any) {
    await Preferences.set({
      key: this.key,
      value: JSON.stringify(info),
    });
  }

  async obterDadosSalvos() {
    const dados = await Preferences.get({
      key: this.key,
    });
    this.dadosSalvos.push(JSON.parse('' + dados.value));
    return this.dadosSalvos;
  }
}
