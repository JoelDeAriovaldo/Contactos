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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  formGroup: any = FormGroup;
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
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      pic: [null],
      nome: ['', Validators.required],
      celular: ['', Validators.required],
    });

    this.atualizarListaDeDados();
  }

  async atualizarListaDeDados() {
    this.dadosSalvos = await this.storage.obterDadosSalvos();
  }
  onSubmit() {
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
      this.dadosSalvos.push(info);
      this.formGroup.reset();
      this.pic = null;
      this.storage.armazenarDados(info);
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

  getDadosPorId(id: number) {
    return this.dadosSalvos.find((dados) => dados.id === id);
  }

  verDadosPorId(id: number) {
    if (this.dadosSalvos.length > 0) {
      const dadosSelecionados = this.getDadosPorId(id);

      if (dadosSelecionados) {
        this.router.navigate(['/detalhes'], {
          state: { dadosSelecionados },
        });
      } else {
        alert('Dados não encontrados para o ID fornecido');
      }
    } else {
      alert('Não há dados salvos para visualizar');
    }
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
}
