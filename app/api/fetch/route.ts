import { NextResponse } from 'next/server';
import { connectDB } from '@/db/mongodb';
import Evento from '@/models/evento';
import TierPrecio from '@/models/tierPrecio';
import Venue from '@/models/venue';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const eventos = await Evento.aggregate([
      {
        $match: {
          fechaHora: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: 'venues',
          localField: 'ubicacion',
          foreignField: '_id',
          as: 'venueInfo'
        }
      },
      {
        $unwind: {
          path: '$venueInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'tiersprecios',
          localField: '_id',
          foreignField: 'evento',
          as: 'tiersPrecio'
        }
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          titulo: 1,
          categoria: 1,
          fechaHora: 1,
          descripcion: 1,
          link: 1,
          urlImagen: 1,
          venueObj: {
            nombre: '$venueInfo.nombre',
            slug: '$venueInfo.slug',
            direccion: '$venueInfo.direccion',
            coordinates: '$venueInfo.ubicacion.coordinates',
            latitud: { $arrayElemAt: ['$venueInfo.ubicacion.coordinates', 1] },
            longitud: { $arrayElemAt: ['$venueInfo.ubicacion.coordinates', 0] }
          },
          tiersPrecio: {
            $map: {
              input: '$tiersPrecio',
              as: 'tier',
              in: {
                nombre: '$$tier.nombre',
                precio: '$$tier.precio'
              }
            }
          }
        }
      },
      {
        $sort: { fechaHora: 1 }
      }
    ]);

    const formattedEvents = eventos.map((event: any) => {
      let fechaCorrecta = event.fechaHora;
      
      if (event.link && event.link.includes('eticket.cr')) {
        const urlParams = new URLSearchParams(event.link.split('?')[1]);
        const idevento = urlParams.get('idevento');
        
        if (idevento === '9339') {
          fechaCorrecta = new Date('2026-05-31T17:05:00');
        }
      }
      
      return {
        id: event._id,
        titulo: event.titulo,
        artista: event.titulo.split(' - ')[0] || event.titulo,
        categoria: event.categoria,
        fechaHora: fechaCorrecta,
        descripcion: event.descripcion || '',
        link: event.link,
        urlImagen: event.urlImagen || '',
        venueObj: event.venueObj,
        venue: event.venueObj?.nombre || (event.titulo.includes('ANTIGUA ADUANA') ? 'Antigua Aduana' : 'Lugar por confirmar'),
        date: new Date(fechaCorrecta).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }).replace(/\./g, ''),
        tiersPrecio: event.tiersPrecio || [],
      };
    });
    
    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}