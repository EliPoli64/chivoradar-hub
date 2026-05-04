import { link } from "fs";
import { normalizeConfig } from "next/dist/server/config";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
// el plan es usar puppeteer-core para hacer el scraping de cada pagina

const GEOCODE_API_KEY = process.env.GEOCODING_API_KEY || '';

interface Evento {
  titulo: String;
  descripcion?: String;
  categoria?: String;
  urlImagen: String;
  fechaHora: Date;
  latitud: Number;
  longitud: Number;
  link: String;
}

async function checkGeocoding(direccion: string) {
  if (!GEOCODE_API_KEY) return [0, 0];
  const linkRequest = `https://api.opencagedata.com/geocode/v1/json?q=${direccion.replaceAll(" ", "+").replaceAll(",", "%2C")}+COSTA+RICA&key=${GEOCODE_API_KEY}`;
  const info = await fetch(linkRequest);
  const retornadoApi = await info.json();
  const resultado = retornadoApi.results[0];
  const ubicacion: Map<string, number> = resultado.geometry;
  return [ubicacion.get("lat"), ubicacion.get("lng")];
}

async function fetchSpecialTicket() {
  // TODO: this
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.specialticket.net/');
  const links = await page.$$eval('a', elements => elements.map(el => el.href));
  const linksLimpios = links;//links.filter(link => link.includes('evento'));
  await browser.close();
  //console.log(linksLimpios);
  return linksLimpios;
}

async function categorizarEventosETicket(categorias: string[]) {
  const browser = await puppeteer.launch();
  const eventosPorCategoria: Map<string, string[]> = new Map(); // 'categoria': [eventos]

  for (const categoria of categorias) {
    const page = await browser.newPage();
    await page.goto(categoria, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const listaDivs = await page.$$eval('div', elements => elements.map(el => el.textContent.trim()));
    const nombreCategoria = listaDivs.filter(div => div.includes('en Costa Rica')).at(-1)?.split(" ")[0] || "Sin Categoría";
    const listaPaginas = await page.$$eval('a', elements => elements.map(el => el.href));

    const paginasEventosLimpias = [...new Set(listaPaginas.filter(link => link.includes('masinformacion')))]
    eventosPorCategoria.set(nombreCategoria, paginasEventosLimpias);
    await page.close();
  }
  browser.close();
  return eventosPorCategoria;
}

async function extraerEventoETicket(links: Map<string, string[]>) {
  const browser = await puppeteer.launch();
  const infoEventos: Evento[] = [];

  for (const categoria of links.keys()) {
    const listaLinks = links.get(categoria) || [];
    for (const link of listaLinks){
      console.log(link);
      const page = await browser.newPage();
      await page.goto(link);
      const resultadosUbicacion = await page.$$eval('.font16.mayusculas_primera div', elements =>
        elements.map(el => el.textContent.trim()).filter(text => text.length > 0)
      )
      console.log(resultadosUbicacion);
      const [latitud, longitud] = await checkGeocoding(resultadosUbicacion[0] + "+" + resultadosUbicacion[1]);
      console.log(latitud, longitud);
      
      await page.close()
    };
    
  }

  return infoEventos;
}

async function fetchETicket() {
  const browser = await puppeteer.launch();
  
  const page = await browser.newPage();
  await page.goto('https://www.eticket.cr/');

  // buscar elementos 'a' que tengan href de categoria
  // estructura de la pagina incluye eventos por categoria
  const links = await page.$$eval('a', elements => elements.map(el => el.href));
  await browser.close();

  const categorias = [...new Set(links.filter(link => link.includes('categoria')))];
  console.log(categorias);

  const eventosPorCategoria = await categorizarEventosETicket(categorias);
  console.log(eventosPorCategoria);

  const infoEventos = await extraerEventoETicket(eventosPorCategoria);

  // TODO: organizar informacion de eventos usando interface

  //console.log(eventosPorCategoria);
  return //eventosPorCategoria;
}

async function fetchStarTicket() {
  // TODO: this
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.starticket.cr/');
  const links = await page.$$eval('a', elements => elements.map(el => el.href));
  const linksLimpios = [...new Set(links.filter(link => link.includes('https://starticket.cr/e/')))];
  
  await browser.close();
  return linksLimpios;
}

export async function getTodos(){
  // const specialTicket = fetchSpecialTicket();
  const eTicket = await fetchETicket();
  // const starTicket = fetchStarTicket();
  // console.log(specialTicket, eTicket, starTicket);
  
  return NextResponse.json(
    { message: 'Success', data: { id: 1, name: 'Next.js' } },
    { status: 200 }
  );
}