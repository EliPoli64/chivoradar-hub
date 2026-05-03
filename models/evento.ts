import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  urlImagen: {
    type: String,
    required: false
  },
  ubicacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },
  fechaHora: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: false
  }

})

const Evento = mongoose.models.Evento || mongoose.model("Evento", eventoSchema);

export default Evento;