export class Convenio {

    constructor(
        public programa: String,
        public empresa: String,
        public encargadoEmpresa: string,
        public rutapdf?: String,
        public estado?: String
    ) { }

}