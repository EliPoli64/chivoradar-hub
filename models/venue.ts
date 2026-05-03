import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordenadas: {
      type: [Number], // almacenadas como [longitud, latitud]
      required: true
    }
  },
  direccion: { // las direcciones en Costa Rica son complicadas
    type: String,
    required: false
  },
  redesSociales: {
    instagram: String,
    facebook: String,
    twitter: String
  }
})

const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);

export default Venue;