interface DadoSalvo {
  id: number;
  // Adicione outras propriedades, se houver
  nome: string;
  celular: string;
  pic: string | null;
}
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { StorageService } from '../storage-service.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  formGroup: FormGroup;
  nome: any;
  celular: any;
  pic: any;
  linkAtivo = false;

  dadosSalvos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {
    this.formGroup = this.fb.group({
      pic: [null],
      nome: ['', Validators.required],
      celular: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    // await this.editarDados();

    if (this.storage.valorP) {
      console.log(this.storage.valorP);
      this.formGroup.patchValue(this.storage.valorP);
    }
  }

  async atualizarListaDeDados() {
    const dadosSalvos = await this.storage.obterDadosSalvos();

    if (Array.isArray(dadosSalvos)) {
      this.dadosSalvos = dadosSalvos;
    } else {
      console.error('Os dados salvos não são um array:', dadosSalvos);
      this.dadosSalvos = [];
    }
  }

  async onSubmit() {
    let info;
    let nome = this.formGroup.get('nome')?.value;
    let celular = this.formGroup.get('celular')?.value;
    let pic = this.formGroup.get('pic')?.value;

    info = {
      id: this.dadosSalvos.length + 1,
      nome,
      celular,
      pic,
    };

    if (this.formGroup.status === 'VALID') {
      this.linkAtivo = true;
      await this.editarDados(info.id);
      this.dadosSalvos.push(info);
      await this.storage.armazenarDados(this.dadosSalvos);
      this.formGroup.reset();
      this.pic = null;
    } else {
      alert('Preencha os campos obrigatórios!');
    }

    this.dadosSalvos = await this.storage.obterDadosSalvos(); // Atualiza o array após armazenamento
  }

  selImg(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const imagem = fileInput?.files?.[0];

      if (imagem) {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.pic = reader.result as string;
          console.log(this.pic);

          const picControl = this.formGroup.get('pic');
          if (picControl) {
            this.renderer.setProperty(picControl, 'value', this.pic);
          }
        };

        reader.readAsDataURL(imagem);
      } else {
        console.error('Arquivo de imagem nulo.');
      }
    }
  }

  verDadosPorId() {
    this.router.navigate(['/detalhes'], {});
  }

  limparDados() {
    let info = {
      nome: '',
      celular: '',
      pic: null,
    };

    this.formGroup.setValue(info);

    alert('Limpando dados');
  }

  async editarDados(id: number) {
    const index = this.dadosSalvos.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.formGroup.patchValue(this.dadosSalvos[index]);
    } else {
      console.log('id não encontrado');
    }
  }
}
