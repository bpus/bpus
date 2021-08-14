export class EncargadoEmpresa {

    constructor(

        public identificacion: String,
        public nombres: String,
        public apellidos: String,
        public correo: String,
        public telefono: String,
        public cargo:String,
        public rol: String,
        public estado?: String,

    ) { }

}