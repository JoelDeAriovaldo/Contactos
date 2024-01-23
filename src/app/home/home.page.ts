interface DadoSalvo {
  id: string;
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
import { v4 as uuidv4 } from 'uuid';

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
    private formBuilder: FormBuilder,
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

  async ngOnInit() {
    console.log('Runnig App...');
    this.dadosSalvos = await this.storage.obterDadosSalvos();
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required]],
      celular: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      pic: ['', [Validators.required]],
    });
  }

  ionViewDidEnter() {
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
    if (this.formGroup.status === 'VALID') {
      const nome = this.formGroup.get('nome')?.value;
      const celular = this.formGroup.get('celular')?.value;
      const pic = this.formGroup.get('pic')?.value;

      const novoDado: DadoSalvo = {
        id: uuidv4(),
        nome,
        celular,
        pic,
      };

      const index = this.dadosSalvos.findIndex(
        (item) => item.id === novoDado.id
      );

      if (index !== -1) {
        console.log('ID já existe.');
      } else {
        this.dadosSalvos.push(novoDado);
        await this.storage.armazenarDados(this.dadosSalvos);
        console.log('Dados salvos:', this.dadosSalvos);

        this.formGroup.reset();
        this.pic = null;
      }
    } else {
      alert('Preencha os campos obrigatórios!');
    }
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

  async editarDados(id: string) {
    const index = this.dadosSalvos.findIndex((item) => item.id === id);

    if (index !== -1) {
      // Define os valores do formulário com os valores do item a ser editado
      this.formGroup.patchValue(this.dadosSalvos[index]);
    } else {
      console.log('ID não encontrado');
    }
  }
}
