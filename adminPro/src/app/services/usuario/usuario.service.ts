import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(private http: HttpClient, public router: Router, public _subirArchivoService: SubirArchivoService) { 
    
    this.cargarStorage();
  }

  estaLogueado() {

    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {

    if(localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    
    } else {

      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logOut() {

    this.usuario = null;
    this.token = '';
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      })
    );
  }

  login(usuario: Usuario, recordar: boolean = false) {

    if(recordar)
      localStorage.setItem('email', usuario.email);
    else
      localStorage.removeItem('email');

    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario).pipe(
      map((resp: any) => {

        this.guardarStorage(resp.id, resp.token, resp.data);

        return true;
      })
    );
  }

  crearUsuario(usuario: Usuario) { 

    let url = URL_SERVICIOS + "/usuario";

    return this.http.post(url, usuario).pipe(
      map( (resp: any) => {

        swal("Usuario creado", usuario.email, "success");
        return resp.usuario;

      })
    );
  }

  actualizarUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + this.usuario._id + '?token=' + this.token;

    return this.http.put(url, this.usuario).pipe(
      map((resp: any) => {

        this.guardarStorage(resp.data._id, this.token, resp.data);
        swal('Usuario actualizado', usuario.nombre, 'success');

        return true;
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {

        this.usuario.img = resp.data.img;
        swal('Imagen actualizada', this.usuario.nombre, 'success');

          this.guardarStorage(id, this.token, this.usuario);
        })
      .catch(resp => console.log(resp))

  }

}