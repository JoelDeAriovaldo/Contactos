import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  FormGroup: any;
  key: any = 'cursoionic';

  constructor() {}
  async armazenarDados(info: any) {
    await Preferences.set({
      key: this.key,
      value: JSON.stringify(info),
    });
  }
}
