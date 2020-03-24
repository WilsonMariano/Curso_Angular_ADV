import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare var swal: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) { }

  sonIguales(campo1: string, campo2: string) {


    return (group: FormGroup) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if(pass1 === pass2)
        return null;
      
      return {
        sonIguales: true
      }
    }
  }

  ngOnInit() {

    this.forma = new FormGroup({

      'nombre': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'password2': new FormControl(null, Validators.required),
      'condiciones': new FormControl(false)
    }, { validators: this.sonIguales('password', 'password2') });

    this.forma.setValue({
      'nombre': 'Mariano',
      'email' : 'mgw009@gmail.com',
      'password' : '123',
      'password2' : '1234',
      'condiciones' : false
    });
  }

  registrarUsuario() {

    if(this.forma.invalid)
      return;
    
    if(!this.forma.value.condiciones) {

      swal({title: "Importante!", text: "Debe de aceptar las condiciones", icon: "warning",});
      return;
    }

    let usuario = new Usuario(this.forma.value.nombre, this.forma.value.email, this.forma.value.password);

    this._usuarioService.crearUsuario(usuario).subscribe(

      data => this.router.navigate(['/login'])
    );
  }

}
