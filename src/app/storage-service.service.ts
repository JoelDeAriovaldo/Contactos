interface DadoSalvo {
  id: number;
  nome: string;
  celular: string;
  pic: string | null;
}

import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private key: string = 'cursoionic';
  private dadosSalvos: DadoSalvo[] = [];

  constructor() {}

  async armazenarDados(dadosSalvos: DadoSalvo[]) {
    try {
      const arrayString = JSON.stringify(dadosSalvos);
      await Preferences.set({
        key: this.key,
        value: arrayString,
      });
    } catch (error) {
      console.error('Erro ao armazenar dados:', error);
    }
  }

  async obterDadosSalvos() {
    try {
      const storedArrayString = await Preferences.get({
        key: this.key,
      });
      this.dadosSalvos = storedArrayString.value
        ? JSON.parse(storedArrayString.value)
        : [];
      console.log('Dados salvos:', this.dadosSalvos);
      return this.dadosSalvos;
    } catch (error) {
      console.error('Erro ao obter dados salvos:', error);
      return [];
    }
  }

  async atualizarDados(dados: DadoSalvo) {
    try {
      const index = this.dadosSalvos.findIndex((d) => d.id === dados.id);

      if (index !== -1) {
        this.dadosSalvos[index] = dados;
        await this.armazenarDados(this.dadosSalvos);
      } else {
        console.error('Dado não encontrado para atualização');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  }
}
