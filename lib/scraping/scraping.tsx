import { normalizeConfig } from "next/dist/server/config";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
// el plan es usar puppeteer-core para hacer el scraping de cada pagina

async function fetchSpecialTicket() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.specialticket.net/');
  const links = await page.$$eval('a', elements => elements.map(el => el.href));
  const linksLimpios = links;//links.filter(link => link.includes('evento'));
  await browser.close();
  //console.log(linksLimpios);
  return linksLimpios;
}

async function fetchETicket() {
  const browser = await puppeteer.launch();
  const eventosPorCategoria = new Map(); // 'categoria': [eventos]
  const page = await browser.newPage();
  await page.goto('https://www.eticket.cr/');

  // buscar elementos 'a' que tengan href de categoria
  // estructura de la pagina incluye eventos por categoria
  const links = await page.$$eval('a', elements => elements.map(el => el.href));
  const linksLimpios = [...new Set(links.filter(link => link.includes('categoria')))];
  for (const link of linksLimpios) {
    await page.goto(link);
    const listaDivs = await page.$$eval('div', elements => elements.map(el => el.textContent.trim()));
    const nombreCategoria = listaDivs.filter(div => div.includes('en Costa Rica')).at(-1)?.split(" ")[0];
    const listaPaginas = await page.$$eval('a', elements => elements.map(el => el.href));
    const paginasEventosLimpias = [...new Set(listaPaginas.filter(link => link.includes('masinformacion')))]
    eventosPorCategoria.set(nombreCategoria, paginasEventosLimpias);
  }
  await browser.close();
  console.log(eventosPorCategoria);
  return eventosPorCategoria;
}

async function fetchStarTicket() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.starticket.cr/');
  const links = await page.$$eval('a', elements => elements.map(el => el.href));
  
  await browser.close();
  return links;
}

export function getTodos(){
  // const specialTicket = fetchSpecialTicket();
  const eTicket = fetchETicket();
  // const starTicket = fetchStarTicket();
  // console.log(specialTicket, eTicket, starTicket);
  
  return NextResponse.json(
    { message: 'Success', data: { id: 1, name: 'Next.js' } },
    { status: 200 }
  );
}