import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  //FormGroup: any;
  key: any = 'cursoionic';
  private dadosSalvos: any[] = [];
  //static state: any;

  constructor() {}
  async armazenarDados(dadosSalvos: any) {
    const arrayString = JSON.stringify(this.dadosSalvos); //Stringifica todo o array
    await Preferences.set({
      key: this.key,
      value: arrayString,
    });
  }

  async obterDadosSalvos() {
    const storedArrayString = await Preferences.get({
      key: this.key,
    });
    this.dadosSalvos = storedArrayString.value
      ? JSON.parse(storedArrayString.value)
      : [];
    console.log(this.dadosSalvos); //Analisa a string recuperada ou inicializa um array vazio
    return this.dadosSalvos;
  }
}
