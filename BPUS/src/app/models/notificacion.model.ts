export class Notificacion {

    constructor(
        public receptor: string,
        public fecha: Date,
        public mensaje: string,
        public mensajeDetalle: string,
        public onModel : string,
        public receptorCorreo?: string,
        public isRead? : boolean,
        public _id?: string
    ) {
    }
}
