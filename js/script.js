(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rnd = n => Math.floor(Math.random() * n);
  const pad = n => String(n).padStart(2, '0');
  const fmt = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const SCREENS = ['inicio', 'puzzle', 'quien', 'termo', 'mapa', 'puntos'];
  const SCREEN_NAV = { inicio: 'inicio', puzzle: 'juegos', quien: 'juegos', termo: 'juegos', mapa: 'mapa', puntos: 'puntos' };
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pendingScroll = 'top';

  /* ---------- Datos ---------- */
  const CHARS = [
    ['Anitta', 1, 'anitta', ['Soy una cantante brasileña.', 'Mi nombre real es Larissa Machado.', 'Canto en portugues, español e ingles.', 'Una de mis canciones famosas es «Envolver».']],
    ['Virginia Fonseca', 1, 'virginiafonseca', ['Soy una influencer brasileña.', 'Soy conocida por mis redes sociales.', 'Tambien trabajo con entretenimiento y negocios.', 'Tengo millones de seguidores en internet.']],
    ['Maisa Silva', 1, 'maisa', ['Soy una actriz y presentadora brasileña.', 'Comence mi carrera en television siendo niña.', 'Participe en novelas y peliculas.', 'Tambien soy muy conocida en las redes sociales.']],
    ['Larissa Manoela', 1, 'larissamanoela', ['Soy una actriz y cantante brasileña.', 'Me hice famosa en novelas y peliculas.', 'Participe en producciones para jovenes.', 'Tambien soy conocida en las redes sociales.']],
    ['Joao Guilherme', 1, 'joaoguilherme', ['Soy un actor y cantante brasileño.', 'Participe en novelas y series.', 'Tambien soy conocido por las redes sociales.', 'Tengo una carrera en la musica y la actuacion.']],
    ['Manu Gavassi', 1, 'manugavassi', ['Soy una cantante y actriz brasileña.', 'Participe en series y programas de television.', 'Tambien tengo una carrera musical.', 'Soy conocida por mi estilo y creatividad.']],
    ['Shakira', 1, 'shakira', ['Soy una cantante colombiana.', 'Naci en Barranquilla, Colombia.', 'Cante «Waka Waka» en el Mundial de 2010.', 'Soy conocida mundialmente por mi musica y mis bailes.']],
    ['Karol G', 1, 'karolg', ['Soy una cantante colombiana.', 'Mi nombre real es Carolina Giraldo.', 'Soy conocida por mi musica urbana.', 'Una de mis canciones famosas es «Tusa».']],
    ['J Balvin', 1, 'jbalvin', ['Soy un cantante colombiano.', 'Naci en Medellin, Colombia.', 'Soy conocido por mi musica urbana.', 'Una de mis canciones famosas es «Mi Gente».']],
    ['Neymar', 1, 'neymar', ['Soy un futbolista brasileño.', 'Naci en Mogi das Cruzes, Brasil.', 'Jogue para Santos, Barcelona y Paris Saint-Germain.', 'Gane una medalla de oro olimpica con Brasil.']],
    ['Vinicius Junior', 1, 'viniciusjunior', ['Soy un futbolista brasileño.', 'Juego como delantero.', 'Juego para el Real Madrid.', 'Gane la Champions League con mi club.']],
    ['Rodrygo', 1, 'rodrygo', ['Soy un futbolista brasileño.', 'Juego como delantero.', 'Juego para el Real Madrid.', 'Tambien represento a la seleccion brasileña.']],
    ['Endrick', 1, 'endrick', ['Soy un futbolista brasileño.', 'Naci en Brasilia.', 'Juego para el Real Madrid.', 'Me hice famoso jugando en Palmeiras.']],
    ['Raphinha', 1, 'raphinha', ['Soy un futbolista brasileño.', 'Juego como extremo.', 'Juego para el Barcelona.', 'Tambien juego para la seleccion brasileña.']],
    ['Alisson Becker', 1, 'alissonbecker', ['Soy un futbolista brasileño.', 'Juego como portero.', 'Juego para el Liverpool.', 'Gane la Champions League con el Liverpool.']],
    ['Richarlison', 1, 'richarlison', ['Soy un futbolista brasileño.', 'Juego como delantero.', 'Soy conocido por mi celebracion del pombo.', 'Juego para la seleccion brasileña.']],
    ['Gabriel Martinelli', 1, 'gabrielmartinelli', ['Soy un futbolista brasileño.', 'Juego como delantero.', 'Juego para el Arsenal.', 'Tambien represento a la seleccion brasileña.']],
    ['Lionel Messi', 1, 'lionelmessi', ['Soy un futbolista argentino.', 'Naci en Rosario, Argentina.', 'Gane la Copa del Mundo de 2022.', 'Tambien gane varias veces el Balon de Oro.']],
    ['Angel Di Maria', 1, 'angeldimaria', ['Soy un futbolista argentino.', 'Juego como extremo.', 'Gane la Copa del Mundo de 2022.', 'Joguei por clubes como Real Madrid y Benfica.']],
    ['Emiliano Martinez', 1, 'emilianomartinez', ['Soy un futbolista argentino.', 'Juego como portero.', 'Gane la Copa del Mundo de 2022.', 'Soy conocido como «Dibu».']],
    ['Lautaro Martinez', 1, 'lautaromartinez', ['Soy un futbolista argentino.', 'Juego como delantero.', 'Juego para el Inter de Milan.', 'Gane la Copa America y la Copa del Mundo con Argentina.']],
    ['Julian Alvarez', 1, 'julianalvarez', ['Soy un futbolista argentino.', 'Juego como delantero.', 'Juego para el Atletico de Madrid.', 'Gane la Copa del Mundo de 2022 con Argentina.']],
    ['Paulo Dybala', 1, 'paulodybala', ['Soy un futbolista argentino.', 'Juego como atacante.', 'Juego para la Roma.', 'Soy conocido por mi celebracion de la mascara.']],
    ['Luis Suarez', 1, 'luissuarez', ['Soy un futbolista uruguayo.', 'Juego como delantero.', 'Joguei con Messi y Neymar en Barcelona.', 'Gane varias veces la liga española.']],
    ['Federico Valverde', 1, 'federicovalverde', ['Soy un futbolista uruguayo.', 'Juego como mediocampista.', 'Juego para el Real Madrid.', 'Tambien represento a la seleccion uruguaya.']],
    ['Darwin Nunez', 1, 'darwinnunez', ['Soy un futbolista uruguayo.', 'Juego como delantero.', 'Juego para el Liverpool.', 'Tambien represento a la seleccion uruguaya.']],
    ['Alexis Sanchez', 1, 'alexissanchez', ['Soy un futbolista chileno.', 'Juego como delantero.', 'Tengo una larga carrera en Europa.', 'Gane la Copa America con Chile.']],
    ['Arturo Vidal', 1, 'arturovidal', ['Soy un futbolista chileno.', 'Juego como mediocampista.', 'Joguei por clubes como Juventus,Bayern y Barcelona.', 'Gane la Copa America con Chile.']],
    ['James Rodriguez', 1, 'jamesrodriguez', ['Soy un futbolista colombiano.', 'Juego como mediocampista.', 'Fui Bota de Oro del Mundial de 2014.', 'Tambien jugue en el Real Madrid.']],
    ['Luis Diaz', 1, 'luisdiaz', ['Soy un futbolista colombiano.', 'Juego como extremo.', 'Juego para el Liverpool.', 'Tambien represento a la seleccion colombiana.']],
    ['Radamel Falcao', 1, 'radamelfalcao', ['Soy un futbolista colombiano.', 'Juego como delantero.', 'Soy conocido como «El Tigre».', 'Joguei por clubes como Atletico de Madrid y Monaco.']],
    ['Sergio Ramos', 1, 'sergioramos', ['Soy un futbolista español.', 'Juego como defensor.', 'Fui capitan del Real Madrid.', 'Gane la Copa del Mundo de 2010 con España.']],
    ['Lamine Yamal', 1, 'lamineyamal', ['Soy un futbolista español.', 'Juego como extremo.', 'Juego para el Barcelona.', 'Me hice famoso siendo muy joven.']],
    ['Pedri', 1, 'pedri', ['Soy un futbolista español.', 'Juego como mediocampista.', 'Juego para el Barcelona.', 'Tambien represento a la seleccion española.']],
    ['Alvaro Morata', 1, 'alvaromorata', ['Soy un futbolista español.', 'Juego como delantero.', 'Joguei por Real Madrid,Juventus y Atletico de Madrid.', 'Tambien represento a la seleccion española.']],
    ['Carlos Tevez', 1, 'carlostevez', ['Soy un futbolista argentino.', 'Juego como delantero.', 'Joguei por Boca Juniors,Manchester United y Juventus.', 'Soy conocido como «El Apache».']],
    ['Ronaldinho', 1, 'ronaldinho', ['Soy un futbolista brasileño.', 'Joguei como mediocampista y atacante.', 'Gane el Balon de Oro en 2005.', 'Fui campeon del mundo con Brasil en 2002.']],
    ['Ronaldo Nazario', 1, 'ronaldo', ['Soy un futbolista brasileño.', 'Joguei como delantero.', 'Gane dos veces el Balon de Oro.', 'Fui campeon del mundo con Brasil en 2002.']],
    ['Kaka', 1, 'kaka', ['Soy un futbolista brasileño.', 'Joguei como mediocampista.', 'Gane el Balon de Oro en 2007.', 'Fui campeon del mundo con Brasil en 2002.']],
    ['Maluma', 1, 'maluma', ['Soy un cantante colombiano.', 'Naci en Medellin, Colombia.', 'Canto reggaeton y pop latino.', 'Una de mis canciones famosas es «Hawái».']],
    ['Sofia Vergara', 1, 'sofiavergara', ['Soy una actriz colombiana.', 'Naci en Barranquilla, Colombia.', 'Fui protagonista de «Modern Family».', 'Interprete al personaje Gloria.']],
    ['Carlos Vives', 1, 'carlosvives', ['Soy un cantante colombiano.', 'Naci en Santa Marta, Colombia.', 'Soy conocido por el vallenato y el pop.', 'Cante «La Bicicleta» con Shakira.']],
    ['Juanes', 1, 'juanes', ['Soy un cantante colombiano.', 'Mi nombre real es Juan Esteban Aristizabal.', 'Combino rock con musica latina.', 'Una de mis canciones famosas es «La Camisa Negra».']],
    ['Bad Bunny', 1, 'badbunny', ['Soy un cantante puertorriqueno.', 'Mi nombre real es Benito Martinez.', 'Soy uno de los grandes nombres del reggaeton.', 'Mi nombre artistico hace referencia a un conejo.']],
    ['Daddy Yankee', 1, 'daddyyankee', ['Soy un cantante puertorriqueno.', 'Soy uno de los pioneros del reggaeton.', 'Mi nombre real es Ramon Ayala.', 'Una de mis canciones famosas es «Gasolina».']],
    ['Don Omar', 1, 'donomar', ['Soy un cantante puertorriqueno.', 'Soy uno de los grandes nombres del reggaeton.', 'Mi nombre real es William Landron.', 'Una de mis canciones famosas es «Danza Kuduro».']],
    ['Luis Fonsi', 1, 'luisfonsi', ['Soy un cantante puertorriqueno.', 'Naci en San Juan, Puerto Rico.', 'Tengo una carrera musical internacional.', 'Mi gran exito fue «Despacito».']],
    ['Ricky Martin', 1, 'rickymartin', ['Soy un cantante puertorriqueno.', 'Forme parte del grupo Menudo.', 'Tengo una larga carrera internacional.', 'Una de mis canciones famosas es «Livin La Vida Loca».']],
    ['Pedro Pascal', 1, 'pedropascal', ['Soy un actor chileno.', 'Naci en Santiago de Chile.', 'Actue en «The Last of Us».', 'Tambien participe en «The Mandalorian».']],
    ['Tini', 1, 'tini', ['Soy una cantante y actriz argentina.', 'Mi nombre real es Martina Stoessel.', 'Me hice famosa por «Violetta».', 'Tambien tengo una exitosa carrera musical.']],
    ['Lali Esposito', 1, 'lali', ['Soy una cantante y actriz argentina.', 'Participe en «Casi Angeles».', 'Tambien tengo una carrera musical.', 'Soy conocida por mis canciones pop.']],
    ['Danna Paola', 1, 'dannapaola', ['Soy una cantante y actriz mexicana.', 'Comence mi carrera siendo niña.', 'Participe en la serie «Elite».', 'Tambien tengo una carrera musical.']],
    ['Thalia', 1, 'thalia', ['Soy una cantante y actriz mexicana.', 'Protagonice famosas telenovelas.', 'Tengo una larga carrera musical.', 'Soy conocida como la Reina del Pop Latino.']],
    ['Diego Luna', 1, 'diegoluna', ['Soy un actor mexicano.', 'Actue en peliculas internacionales.', 'Interprete a Cassian Andor.', 'Participe en el universo de Star Wars.']],
    ['Gael Garcia Bernal', 1, 'gaelgarcia', ['Soy un actor mexicano.', 'Tambien soy director y productor.', 'Actue en peliculas mexicanas e internacionales.', 'Interprete a Hector en «Coco».']],
    ['Nicole Wallace', 1, 'nicolewallace', ['Soy una actriz española.', 'Interprete a Noah en «Culpa Mia».', 'Mi personaje se enamora de Nick.', 'Soy conocida por la trilogia «Culpables».']],
    ['Gabriel Guevara', 1, 'gabrielguevara', ['Soy un actor español.', 'Interprete a Nick en «Culpa Mia».', 'Mi personaje es el hermanastro de Noah.', 'Tambien participe en series y peliculas.']],
    ['Rosalia', 1, 'rosalia', ['Soy una cantante española.', 'Combino flamenco con musica moderna.', 'Uno de mis albumes famosos es «Motomami».', 'Una de mis canciones conocidas es «Despecha».']],
    ['Enrique Iglesias', 1, 'enriqueiglesias', ['Soy un cantante español.', 'Soy hijo del cantante Julio Iglesias.', 'Tengo una larga carrera internacional.', 'Una de mis canciones famosas es «Bailando».']],
    ['Julio Iglesias', 1, 'julioiglesias', ['Soy un cantante español.', 'Tengo una larga carrera musical internacional.', 'Soy padre de Enrique Iglesias.', 'Soy conocido por mis canciones romanticas.']],
    ['Marc Anthony', 1, 'marcanthony', ['Soy un cantante de origen puertorriqueno.', 'Soy famoso por mi musica salsa.', 'Tambien soy actor.', 'Una de mis canciones famosas es «Vivir Mi Vida».']],
    ['Nicky Jam', 1, 'nickyjam', ['Soy un cantante puertorriqueno.', 'Tengo una larga carrera en el reggaeton.', 'Trabaje con Daddy Yankee.', 'Una de mis canciones famosas es «El Perdon».']],
    ['Ozuna', 1, 'ozuna', ['Soy un cantante puertorriqueno.', 'Soy conocido por el reggaeton y el trap latino.', 'Mi nombre real es Juan Ozuna.', 'Una de mis canciones famosas es «Se Preparo».']]
  ];
  const WORDS = ('AMIGO AMIGA CASAS AGUAS PADRE MADRE NINOS NINAS HOGAR MUNDO ' +
    'VIDAS NOCHE LUNES JUEGO LIBRO CARTA PELEA RISAS FELIZ ' +
    'ARROZ FRUTA CAFES LECHE JUGOS PIZZA TORTA PASTA SOPAS SALSA' +
    'TOROS OVEJA LOBOS OSOS MONOS TIGRE LEONA CEBRA PANDA MARES' +
    'BUENO MALOS BELLA BELLO NUEVO NUEVA LIBRE QUESO CARNE POLLO').split(' ').filter(w => w.length === 5);

  /* ---------- Utilidades de interfaz ---------- */
  function say(id, txt, cls = '') { const el = $(id); el.textContent = txt; el.className = 'msg ' + cls; }
  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function celebrate(host) {
    const box = document.createElement('div');
    box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    host.classList.add('won');
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('i');
      p.style.cssText = `left:${rnd(100)}%;background:${i % 2 ? 'var(--teal)' : 'var(--purple)'};animation-delay:${rnd(300)}ms;--x:${rnd(60) - 30}px`;
      box.append(p);
    }
    host.append(box);
    setTimeout(() => box.remove(), 1900);
  }

  /* ---------- Puntuación global (localStorage) ---------- */
  const STATS_KEY = 'juegaplus.stats.v1';
  const SCORE_FIELD = { puzzle: 'puzzleScore', quien: 'whoAmIScore', termo: 'termoScore' };
  const newStats = () => ({ totalScore: 0, gamesPlayed: 0, victories: 0, bestScore: 0, puzzleScore: 0, whoAmIScore: 0, termoScore: 0, discovered: [] });
  let playerStats = newStats();

  // Máximo 1000 puntos por partida (el Rompecabezas depende de la dificultad: 600/800/1000).
  // En Termo, perder da 20 puntos por cada letra verde del mejor intento.
  function calculateScore(game, d) {
    if (game === 'puzzle') {
      const base = LEVELS[d.n], cells = d.n * d.n; // menos movimientos y menos tiempo = más puntos
      return Math.max(50, Math.round(base - d.moves * base / (cells * 12) - d.secs * base / (cells * 40)));
    }
    if (game === 'quien') return Math.max(250, 1000 - (d.hints - 1) * 250);
    return d.won ? Math.max(100, 1000 - (d.attempts - 1) * 180) : d.greens * 20;
  }
  function loadStats() {
    try {
      const raw = JSON.parse(localStorage.getItem(STATS_KEY));
      if (!raw || typeof raw !== 'object') return;
      Object.keys(newStats()).forEach(k => {
        if (k !== 'discovered' && Number.isFinite(raw[k]) && raw[k] >= 0) playerStats[k] = Math.round(raw[k]);
      });
      if (Array.isArray(raw.discovered)) playerStats.discovered = raw.discovered.filter(id => COUNTRIES.some(c => c.id === id));
    } catch { /* datos corruptos: se empieza de cero */ }
  }
  function saveStats() { try { localStorage.setItem(STATS_KEY, JSON.stringify(playerStats)); } catch { /* sin almacenamiento */ } }
  function addScore(game, score) {
    playerStats.totalScore += score;
    playerStats[SCORE_FIELD[game]] += score;
    playerStats.bestScore = Math.max(playerStats.bestScore, score);
  }
  function registerGame() { playerStats.gamesPlayed++; }
  function registerVictory() { playerStats.victories++; }
  // Punto único de cierre: los tres juegos terminan siempre aquí.
  function finishGame(game, score, won) {
    addScore(game, score);
    registerGame();
    if (won) registerVictory();
    saveStats();
    updateScoreUI();
  }
  function resetStats() { playerStats = newStats(); saveStats(); updateScoreUI(); }
  function animateNumber(el, to) {
    const from = +el.dataset.v || 0;
    el.dataset.v = to;
    if (from === to || reducedMotion()) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / 500);
      el.textContent = Math.round(from + (to - from) * k);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  function updateScoreUI() {
    const s = playerStats;
    animateNumber($('#score-top'), s.totalScore);
    animateNumber($('#s-total'), s.totalScore);
    [['#s-games', 'gamesPlayed'], ['#s-wins', 'victories'], ['#s-best', 'bestScore'], ['#s-puzzle', 'puzzleScore'], ['#s-quien', 'whoAmIScore'], ['#s-termo', 'termoScore']]
      .forEach(([id, k]) => animateNumber($(id), s[k]));
    $('#s-found').textContent = `${s.discovered.length}/${COUNTRIES.length}`;
    Object.keys(SCORE_FIELD).forEach(g => { $('#bar-' + g).style.width = s.totalScore ? `${s[SCORE_FIELD[g]] / s.totalScore * 100}%` : '0%'; });
    refreshMap();
  }

  /* ---------- Navegación (SPA) ---------- */
  function showScreen(id, focus = true) {
    if (!SCREENS.includes(id)) id = 'inicio';
    SCREENS.forEach(s => { $('#' + s).hidden = s !== id; });
    const nav = SCREEN_NAV[id];
    $$('#menu button').forEach(b => b.dataset.nav === nav ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'));
    id === 'puzzle' ? resumeTimer() : pauseTimer();
    const target = pendingScroll === 'top' ? null : document.getElementById(pendingScroll);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else { window.scrollTo(0, 0); if (focus) $(`#${id} h1, #${id} h2`).focus({ preventScroll: true }); }
    pendingScroll = 'top';
    if (id === 'termo') focusTermo();
  }
  function go(id, scroll = 'top') {
    pendingScroll = scroll;
    if ((location.hash.slice(1) || 'inicio') === id) showScreen(id); else location.hash = id;
  }

  /* ---------- Rompecabezas de banderas ---------- */
  // [id del archivo, nombre, capital, región, idioma, curiosidad]
  const NUM = { espana: '724', mexico: '484', guatemala: '320', honduras: '340', 'el-salvador': '222', nicaragua: '558', 'costa-rica': '188', panama: '591', cuba: '192', 'republica-dominicana': '214', colombia: '170', venezuela: '862', ecuador: '218', peru: '604', bolivia: '068', chile: '152', argentina: '032', paraguay: '600', uruguay: '858', 'guinea-ecuatorial': '226' };
  const COUNTRIES = [
    ['espana', 'España', 'Madrid', 'Europa', 'Español', 'El español también se llama «castellano», por el antiguo Reino de Castilla.'],
    ['mexico', 'México', 'Ciudad de México', 'Norteamérica', 'Español y lenguas indígenas', 'Es el país con más hispanohablantes del mundo.'],
    ['argentina', 'Argentina', 'Buenos Aires', 'Sudamérica', 'Español', 'Es el país hispanohablante más extenso en superficie.'],
    ['chile', 'Chile', 'Santiago', 'Sudamérica', 'Español', 'Es uno de los países más largos y estrechos del mundo.'],
    ['colombia', 'Colombia', 'Bogotá', 'Sudamérica', 'Español', 'Es el único país de Sudamérica con costas en el Pacífico y en el Caribe.'],
    ['peru', 'Perú', 'Lima', 'Sudamérica', 'Español, quechua y aimara', 'Allí se encuentra Machu Picchu, una ciudadela inca del siglo XV.'],
    ['uruguay', 'Uruguay', 'Montevideo', 'Sudamérica', 'Español', 'Es uno de los países más pequeños de Sudamérica y compartir el mate es una costumbre muy popular.'],
    ['paraguay', 'Paraguay', 'Asunción', 'Sudamérica', 'Español y guaraní', 'Es uno de los pocos países de América donde una lengua indígena, el guaraní, es idioma oficial junto al español.'],
    ['bolivia', 'Bolivia', 'Sucre (sede del gobierno: La Paz)', 'Sudamérica', 'Español y lenguas indígenas', 'La Paz, sede del gobierno, está a más de 3 500 metros de altitud.'],
    ['ecuador', 'Ecuador', 'Quito', 'Sudamérica', 'Español', 'Su nombre se debe a que la línea del ecuador atraviesa su territorio.'],
    ['venezuela', 'Venezuela', 'Caracas', 'Sudamérica', 'Español', 'En su territorio está el Salto Ángel, la cascada más alta del mundo.'],
    ['costa-rica', 'Costa Rica', 'San José', 'Centroamérica', 'Español', 'Abolió su ejército en 1948 y es muy conocida por su biodiversidad.'],
    ['panama', 'Panamá', 'Ciudad de Panamá', 'Centroamérica', 'Español', 'El Canal de Panamá conecta los océanos Atlántico y Pacífico.'],
    ['nicaragua', 'Nicaragua', 'Managua', 'Centroamérica', 'Español', 'Allí está el lago Cocibolca, el más grande de Centroamérica.'],
    ['honduras', 'Honduras', 'Tegucigalpa', 'Centroamérica', 'Español', 'En Copán se conservan ruinas de una importante ciudad maya.'],
    ['guatemala', 'Guatemala', 'Ciudad de Guatemala', 'Centroamérica', 'Español', 'En Tikal aún se conservan grandes templos de la civilización maya.'],
    ['el-salvador', 'El Salvador', 'San Salvador', 'Centroamérica', 'Español', 'Es el país más pequeño de Centroamérica.'],
    ['republica-dominicana', 'República Dominicana', 'Santo Domingo', 'El Caribe', 'Español', 'Comparte la isla de La Española con Haití.'],
    ['cuba', 'Cuba', 'La Habana', 'El Caribe', 'Español', 'Es la isla más grande del Caribe.'],
    ['guinea-ecuatorial', 'Guinea Ecuatorial', 'Malabo', 'África', 'Español, francés y portugués', 'Es el único país de África donde el español es idioma oficial.']
  ].map(([id, name, cap, region, lang, fact]) => ({ id, name, cap, region, lang, fact, num: NUM[id] }));
  const LEVELS = { 3: 600, 4: 800, 5: 1000 }; // puntuación máxima por dificultad
  const flagSrc = id => (window.FLAG_DATA || {})[id] || `assets/flags/${id}.svg`;
  const P = { n: 3, mode: 'random', c: COUNTRIES[0], o: [], el: [], sel: -1, drag: -1, moves: 0, acc: 0, t0: 0, won: false };
  const elapsed = () => P.acc + (P.t0 ? Date.now() - P.t0 : 0);
  const secs = () => Math.floor(elapsed() / 1000);
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1);[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function randomCountry() { let c; do { c = COUNTRIES[rnd(COUNTRIES.length)]; } while (c === P.c); return c; }
  function pauseTimer() { if (P.t0) { P.acc += Date.now() - P.t0; P.t0 = 0; } }
  function resumeTimer() { if (P.moves > 0 && !P.won && !P.t0) P.t0 = Date.now(); }
  function buildPicker() {
    $('#p-picker').innerHTML = COUNTRIES.map(c =>
      `<button type="button" class="pick" data-country="${c.id}" aria-pressed="false"><img src="${flagSrc(c.id)}" alt="" width="56" height="56" loading="lazy"><span><b>${c.name}</b><small>Capital: ${c.cap}<br>Región: ${c.region} · Idioma: ${c.lang}</small></span></button>`).join('');
  }
  function syncOptions() {
    $$('[data-diff]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.diff === P.n)));
    $$('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === P.mode)));
    $$('.pick').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.country === P.c.id)));
    $('#p-picker').hidden = P.mode !== 'pick';
  }
  function initPuzzle() { startPuzzle(COUNTRIES[rnd(COUNTRIES.length)]); }
  function startPuzzle(country) {
    const n = P.n, total = n * n, src = flagSrc(country.id);
    P.c = country;
    do { P.o = shuffle([...Array(total).keys()]); } while (P.o.every((v, i) => v === i));
    Object.assign(P, { sel: -1, drag: -1, moves: 0, acc: 0, t0: 0, won: false });
    // Cada pieza muestra su porción de la bandera con background-size/position.
    P.el = Array.from({ length: total }, (_, id) => {
      const d = document.createElement('div');
      d.className = 'piece'; d.dataset.p = id; d.draggable = true; d.tabIndex = 0; d.setAttribute('role', 'button');
      d.style.backgroundImage = `url("${src}")`;
      d.style.backgroundSize = `${n * 100}% ${n * 100}%`;
      d.style.backgroundPosition = `${(id % n) / (n - 1) * 100}% ${Math.floor(id / n) / (n - 1) * 100}%`;
      return d;
    });
    const board = $('#board');
    board.style.setProperty('--n', n); board.classList.remove('win');
    board.replaceChildren(...P.o.map(id => P.el[id]));
    $('#p-country').textContent = country.name;
    $('#puzzle .panel').classList.remove('won');
    say('#p-msg', 'Selecciona una pieza y luego otra para intercambiarlas.');
    syncOptions(); updatePieceLabels(); updatePuzzleStats();
  }
  function updatePieceLabels() {
    P.o.forEach((id, pos) => {
      const e = P.el[id];
      e.setAttribute('aria-label', `Fila ${Math.floor(pos / P.n) + 1}, columna ${pos % P.n + 1}`);
      e.setAttribute('aria-pressed', String(pos === P.sel));
      e.classList.toggle('sel', pos === P.sel);
    });
  }
  function updatePuzzleStats() {
    $('#p-moves').textContent = P.moves;
    $('#p-time').textContent = fmt(secs());
    $('#p-score').textContent = calculateScore('puzzle', { n: P.n, moves: P.moves, secs: secs() });
  }
  function onPieceActivate(el) {
    if (P.won) return;
    const pos = P.o.indexOf(+el.dataset.p);
    if (P.sel < 0) { P.sel = pos; say('#p-msg', 'Pieza seleccionada. Elige otra pieza para intercambiarlas.'); }
    else if (P.sel === pos) { P.sel = -1; say('#p-msg', ''); }
    else return swapPieces(P.sel, pos);
    updatePieceLabels();
  }
  function glide(el, from) {
    if (reducedMotion()) return;
    const to = el.getBoundingClientRect();
    el.animate([{ transform: `translate(${from.left - to.left}px,${from.top - to.top}px)` }, { transform: 'none' }], { duration: 240, easing: 'ease' });
  }
  function swapPieces(a, b) {
    const ea = P.el[P.o[a]], eb = P.el[P.o[b]];
    const ra = ea.getBoundingClientRect(), rb = eb.getBoundingClientRect();
    const keepFocus = $('#board').contains(document.activeElement);
    [P.o[a], P.o[b]] = [P.o[b], P.o[a]];
    if (!P.t0) P.t0 = Date.now();
    P.moves++; P.sel = -1;
    $('#board').append(...P.o.map(id => P.el[id]));
    glide(ea, ra); glide(eb, rb);
    if (keepFocus) eb.focus({ preventScroll: true });
    say('#p-msg', 'Piezas intercambiadas.');
    updatePieceLabels(); updatePuzzleStats();
    checkPuzzleWin();
  }
  function checkPuzzleWin() {
    if (P.o.every((v, i) => v === i)) finishPuzzle();
  }
  function finishPuzzle() {
    P.won = true; P.acc = elapsed(); P.t0 = 0;
    const c = P.c, pts = calculateScore('puzzle', { n: P.n, moves: P.moves, secs: secs() });
    const isNew = !playerStats.discovered.includes(c.id);
    if (isNew) playerStats.discovered.push(c.id);
    finishGame('puzzle', pts, true);
    $('#board').classList.add('win');
    P.el.forEach(e => { e.draggable = false; });
    say('#p-msg', '¡Bandera completada!', 'ok');
    setTimeout(() => openModal({
      title: '🎉 ¡Bandera completada!',
      lead: `¡Excelente! Has reconstruido correctamente la bandera de ${c.name}.`,
      rows: [['🏳️ País', c.name], ['🔄 Movimientos', P.moves], ['⏱️ Tiempo', fmt(secs())], ['⭐ Puntuación', pts]],
      info: `<div class="info"><img src="${flagSrc(c.id)}" alt="Bandera de ${c.name}" width="64" height="64"><p><b>${c.name}</b><br><b>Capital:</b> ${c.cap}<br><b>Idioma:</b> ${c.lang}<br><b>Región:</b> ${c.region}</p></div>${isNew ? '<p class="disc">Descubriste un nuevo país. 🌎</p>' : ''}<button type="button" class="linkbtn" data-act="viewmap" data-id="${c.id}">Ver en el mapa →</button>`,
      fact: c.fact,
      actions: [['Siguiente bandera', 'nextflag', 'primary'], ['Volver a jugar', 'again', 'secondary'], ['Volver al inicio', 'home', 'ghost']]
    }), 350);
  }
  function onPuzzleOption(el) {
    if (el.dataset.diff) { P.n = +el.dataset.diff; startPuzzle(P.c); }
    else if (el.dataset.mode) { P.mode = el.dataset.mode; startPuzzle(P.mode === 'random' ? randomCountry() : P.c); }
    else startPuzzle(COUNTRIES.find(c => c.id === el.dataset.country));
  }
  function initPuzzleDrag() {
    const board = $('#board');
    board.addEventListener('dragstart', e => {
      const p = e.target.closest('.piece');
      if (!p || P.won) return e.preventDefault();
      P.drag = P.o.indexOf(+p.dataset.p);
      e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'pieza');
      p.classList.add('drag');
    });
    board.addEventListener('dragover', e => { if (P.drag >= 0 && e.target.closest('.piece')) e.preventDefault(); });
    board.addEventListener('drop', e => {
      const p = e.target.closest('.piece');
      if (!p || P.drag < 0) return;
      e.preventDefault();
      const from = P.drag, to = P.o.indexOf(+p.dataset.p);
      P.drag = -1;
      if (from !== to) swapPieces(from, to);
    });
    board.addEventListener('dragend', () => { P.drag = -1; $$('.piece.drag').forEach(x => x.classList.remove('drag')); });
  }

  /* ---------- ¿Quién soy? (carta física) ---------- */
  const Q = { deck: [], i: 0, st: {}, busy: false };
  const qCur = () => Q.deck[Q.i];
  const qState = () => (Q.st[qCur()] ||= { n: 1, over: false, flipped: false, pts: 0 });

  function initWhoAmI() {
    Q.deck = shuffle([...CHARS.keys()]); Q.i = 0; Q.st = {};
    renderCard(true);
  }
  function renderCard(clearInput) {
    const [name, real, , clues] = CHARS[qCur()], s = qState();
    $('#qwrap').setAttribute('aria-label', `Carta ${Q.i + 1} de ${Q.deck.length}, personaje secreto. Enter para girar, flechas para cambiar de carta.`);
    $('#q-type').textContent = real ? 'Personaje real' : 'Personaje ficticio';
    $('#q-n').textContent = s.n;
    $('#q-clues').innerHTML = clues.slice(0, s.n).map((c, i) => `<li${i === s.n - 1 ? ' class="new"' : ''}><b>#${i + 1}</b>${c}</li>`).join('');
    $('#q-count').textContent = `${s.n} de ${clues.length}`;
    $('#q-pts').textContent = s.over ? s.pts : calculateScore('quien', { hints: s.n });
    const rv = $('#q-reveal');
    rv.hidden = !s.over;
    if (s.over) rv.innerHTML = `<p class="rv">🎉 ¡Correcto!</p><p class="rname">Era ${name}</p><p class="rpts">⭐ +${s.pts} puntos</p>`;
    $('#q-more').disabled = s.over || s.n >= clues.length;
    ['#q-input', '#q-guess'].forEach(id => { $(id).disabled = s.over; });
    $('#q-play').hidden = s.over; $('#q-next').hidden = !s.over;
    if (clearInput) $('#q-input').value = '';
    say('#q-msg', s.over ? '¡Correcto! ¡Has descubierto quién soy!' : '', s.over ? 'ok' : '');
    setFlip(s.flipped, false);
  }
  function setFlip(flipped, animate = true) {
    const s = qState(), f = $('#qflip');
    s.flipped = flipped;
    if (!animate) f.classList.add('noflip');
    f.classList.toggle('flipped', flipped);
    if (!animate) { void f.offsetWidth; f.classList.remove('noflip'); }
    $('#q-front').toggleAttribute('inert', flipped);
    $('#q-back').toggleAttribute('inert', !flipped);
  }
  function showHint() {
    const s = qState();
    if (s.over || s.n >= CHARS[qCur()][3].length) return;
    s.n++;
    renderCard(false);
    setFlip(true);
    if (!reducedMotion()) $('#qwrap').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03) rotate(-1.2deg)' }, { transform: 'scale(1)' }], { duration: 260 });
    say('#q-msg', 'Nueva pista. Ahora puedes ganar menos puntos.');
    $('#q-input').focus({ preventScroll: true });
  }
  function checkWhoAmIAnswer(e) {
    e.preventDefault();
    const s = qState();
    if (s.over) return;
    const g = norm($('#q-input').value);
    if (!g) { say('#q-msg', 'Escribe una respuesta antes de adivinar.', 'err'); return; }
    const [name, , alias] = CHARS[qCur()];
    if (![name, ...alias.split('|')].filter(Boolean).map(norm).includes(g)) {
      shake($('#q-input')); shake($('#qwrap'));
      say('#q-msg', '❌ No es correcto. ¡Puedes intentarlo de nuevo!', 'err');
      return;
    }
    finishWhoAmI();
  }
  function finishWhoAmI() {
    const s = qState();
    s.over = true; s.pts = calculateScore('quien', { hints: s.n });
    finishGame('quien', s.pts, true);
    renderCard(false);
    setFlip(true);
    celebrate($('#quien .panel'));
    $('#q-next .btn').focus({ preventScroll: true });
  }
  // Cambia de carta: la actual sale hacia el lado contrario al gesto y la nueva entra.
  async function changeCard(dir) {
    if (Q.busy) return;
    Q.busy = true;
    const wrap = $('#qwrap'), anim = !reducedMotion();
    if (anim) {
      const out = wrap.animate([{ transform: wrap.style.transform || 'none', opacity: wrap.style.opacity || 1 },
      { transform: `translateX(${-dir * 120}%) rotate(${-dir * 18}deg)`, opacity: 0 }], { duration: 230, easing: 'ease-in', fill: 'forwards' });
      await out.finished.catch(() => { });
      out.cancel();
    }
    wrap.style.transform = ''; wrap.style.opacity = '';
    Q.i = (Q.i + dir + Q.deck.length) % Q.deck.length;
    renderCard(true);
    if (anim) await wrap.animate([{ transform: `translateX(${dir * 60}%) rotate(${dir * 8}deg)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: 'ease-out' }).finished.catch(() => { });
    Q.busy = false;
  }
  function initCardGestures() {
    const wrap = $('#qwrap'), D = { id: null, x0: 0, dx: 0, moved: false };
    const springBack = () => {
      wrap.style.transition = 'transform .28s cubic-bezier(.2,.9,.3,1.2), opacity .28s';
      wrap.style.transform = ''; wrap.style.opacity = '';
      setTimeout(() => { wrap.style.transition = ''; }, 300);
    };
    wrap.addEventListener('pointerdown', e => {
      if (Q.busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
      Object.assign(D, { id: e.pointerId, x0: e.clientX, dx: 0, moved: false });
    });
    wrap.addEventListener('pointermove', e => {
      if (e.pointerId !== D.id) return;
      D.dx = e.clientX - D.x0;
      if (!D.moved && Math.abs(D.dx) > 8) { D.moved = true; wrap.setPointerCapture(e.pointerId); wrap.classList.add('dragging'); }
      if (D.moved) {
        wrap.style.transform = `translateX(${D.dx}px) rotate(${D.dx * 0.06}deg)`;
        wrap.style.opacity = 1 - Math.min(Math.abs(D.dx) / 320, 0.55);
      }
    });
    const end = e => {
      if (e.pointerId !== D.id) return;
      const { dx, moved } = D;
      D.id = null; wrap.classList.remove('dragging');
      if (!moved) { if (e.type === 'pointerup') setFlip(!qState().flipped); return; }
      if (e.type === 'pointerup' && Math.abs(dx) > Math.max(80, wrap.offsetWidth * 0.25)) changeCard(dx < 0 ? 1 : -1);
      else springBack();
    };
    // Si el gesto es sobre todo horizontal, se bloquea el scroll del navegador para que la carta siga al dedo.
    let t0 = null;
    wrap.addEventListener('touchstart', e => { t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
    wrap.addEventListener('touchmove', e => {
      if (!t0 || !e.cancelable) return;
      const dx = e.touches[0].clientX - t0.x, dy = e.touches[0].clientY - t0.y;
      if (Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    }, { passive: false });
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', end);
    wrap.addEventListener('keydown', e => {
      if (e.target !== wrap) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip(!qState().flipped); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); changeCard(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); changeCard(-1); }
    });
  }

  /* ---------- Termo ---------- */
  const KEYS = [[...'QWERTYUIOP'], [...'ASDFGHJKLÑ'], [...'ZXCVBNM'], ['BACK', 'ENTER']];
  const KEY_LABEL = { BACK: 'BORRAR', ENTER: 'ENTER' };
  const KEY_ARIA = { BACK: 'Borrar letra', ENTER: 'Enviar palabra' };
  const LBL = { ok: 'en su lugar', pres: 'en otra posición', no: 'no está en la palabra' };
  const RANK = { no: 1, pres: 2, ok: 3 };
  const T = { w: '', row: 0, cur: '', over: false, last: '', pts: 0, greens: 0 };

  function buildTermoBoard() {
    $('#grid').innerHTML = Array.from({ length: 6 }, () =>
      `<div class="trow" role="row">${'<div class="cell" role="gridcell"></div>'.repeat(5)}</div>`).join('');
    $('#kb').innerHTML = KEYS.map(r => `<div class="krow">${r.map(k =>
      `<button type="button" class="key${k.length > 1 ? ' wide' : ''}" data-k="${k}" aria-label="${KEY_ARIA[k] || k}">${KEY_LABEL[k] || k}</button>`).join('')}</div>`).join('');
  }
  function initTermo() {
    let w; do { w = WORDS[rnd(WORDS.length)]; } while (w === T.last);
    Object.assign(T, { w, last: w, row: 0, cur: '', over: false, pts: 0, greens: 0 });
    $$('.cell').forEach(c => { c.textContent = ''; c.className = 'cell'; c.removeAttribute('data-s'); c.removeAttribute('aria-label'); c.style.animationDelay = ''; });
    $$('.key').forEach(k => { k.removeAttribute('data-s'); k.setAttribute('aria-label', KEY_ARIA[k.dataset.k] || k.dataset.k); });
    say('#t-msg', ''); $('#termo .panel').classList.remove('won');
    updateTermoStats();
  }
  function updateTermoStats() {
    $('#t-input').value = T.cur;
    $('#t-att').textContent = `${T.row}/6`;
    $('#t-pts').textContent = T.over ? T.pts : calculateScore('termo', { won: true, attempts: T.row + 1 });
  }
  function paintRow() {
    const r = $$('.trow')[T.row];
    if (!r) return;
    $$('.cell', r).forEach((c, i) => { c.textContent = T.cur[i] || ''; c.classList.toggle('fill', !!T.cur[i]); });
    $('#t-input').value = T.cur;
  }
  // Dos pasadas: primero verdes; luego amarillos limitados por las letras que aún quedan en la palabra secreta.
  function evaluate(g, w) {
    const res = Array(5).fill('no'), left = {};
    for (let i = 0; i < 5; i++) {
      if (g[i] === w[i]) res[i] = 'ok'; else left[w[i]] = (left[w[i]] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {
      if (res[i] === 'no' && left[g[i]] > 0) { res[i] = 'pres'; left[g[i]]--; }
    }
    return res;
  }
  function updateKeyboard(l, s) {
    const k = $(`.key[data-k="${l}"]`);
    if (k && (!k.dataset.s || RANK[s] > RANK[k.dataset.s])) { k.dataset.s = s; k.setAttribute('aria-label', `${l}, ${LBL[s]}`); }
  }
  function checkTermoGuess() {
    if (T.cur.length < 5) {
      shake($$('.trow')[T.row]);
      say('#t-msg', 'Faltan letras: la palabra tiene 5 letras.', 'err');
      return;
    }
    const res = evaluate(T.cur, T.w);
    $$('.cell', $$('.trow')[T.row]).forEach((c, i) => {
      c.classList.remove('fill');
      c.style.animationDelay = `${i * 0.12}s`;
      c.dataset.s = res[i];
      c.setAttribute('aria-label', `${T.cur[i]}, ${LBL[res[i]]}`);
    });
    res.forEach((s, i) => updateKeyboard(T.cur[i], s));
    T.greens = Math.max(T.greens, res.filter(s => s === 'ok').length);
    T.row++; T.cur = '';
    if (res.every(s => s === 'ok')) finishTermo(true);
    else if (T.row === 6) finishTermo(false);
    else say('#t-msg', '');
    updateTermoStats();
  }
  function finishTermo(won) {
    T.over = true;
    T.pts = calculateScore('termo', { won, attempts: T.row, greens: T.greens });
    finishGame('termo', T.pts, won);
    say('#t-msg', won ? '¡Excelente! ¡Has encontrado la palabra!' : `Fin del juego. La palabra era: ${T.w}`, won ? 'ok' : 'err');
    setTimeout(() => openModal(won ? {
      title: '🎉 ¡Excelente!', lead: '¡Has encontrado la palabra!',
      rows: [['🔁 Intentos', T.row], ['⭐ Puntuación', T.pts]],
      actions: [['Nuevo juego', 'newt', 'primary'], ['Cerrar', 'closemodal', 'ghost']]
    } : {
      title: 'Fin del juego', lead: `La palabra era:<br><b class="word">${T.w}</b>`, confetti: false,
      rows: [['⭐ Puntuación', T.pts]],
      actions: [['Nuevo juego', 'newt', 'primary'], ['Cerrar', 'closemodal', 'ghost']]
    }), 900);
  }
  function handleTermoInput(k) {
    if (T.over) return;
    if (k === 'BACK') { T.cur = T.cur.slice(0, -1); paintRow(); }
    else if (k === 'ENTER') checkTermoGuess();
    else if (/^[A-ZÑ]$/.test(k) && T.cur.length < 5) { T.cur += k; paintRow(); }
  }

  /* ---------- Modal de resultados ---------- */
  function openModal({ title, lead = '', rows = [], info = '', fact = '', actions = [], confetti = true }) {
    const dlg = $('#modal');
    $('#m-body').innerHTML = `<h3 id="m-title">${title}</h3>${lead ? `<p class="lead2">${lead}</p>` : ''}
    ${rows.length ? `<div class="rstats">${rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>` : ''}
    ${info}${fact ? `<p class="fact"><b>Dato:</b> ${fact}</p>` : ''}
    <div class="row">${actions.map(([label, act, cls]) => `<button type="button" class="btn ${cls}" data-act="${act}">${label}</button>`).join('')}</div>`;
    if (!dlg.open) dlg.showModal();
    if (confetti) celebrate($('#m-body'));
    $('#m-body .btn.primary')?.focus();
  }

  /* ---------- Mapa-múndi ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const byNum = Object.fromEntries(COUNTRIES.map(c => [c.num, c]));
  const M = { sel: null, view: WORLD.views.mundo.slice(), raf: 0 };
  function drawWorld(svg, interactive) {
    const frag = document.createDocumentFragment();
    WORLD.paths.forEach(([num, name, d]) => {
      const p = document.createElementNS(NS, 'path'), c = byNum[num];
      p.setAttribute('d', d);
      if (interactive) p.dataset.name = c ? c.name : name;
      if (c) {
        p.classList.add('hs'); p.dataset.id = c.id;
        if (interactive) { p.tabIndex = 0; p.setAttribute('role', 'button'); p.setAttribute('aria-label', `${c.name}, ${c.region}`); }
      }
      frag.append(p);
    });
    svg.replaceChildren(frag);
  }
  function refreshMap() {
    $$('#world .hs').forEach(p => {
      p.classList.toggle('seen', playerStats.discovered.includes(p.dataset.id));
      p.classList.toggle('sel', p.dataset.id === M.sel);
    });
    $$('.chip2').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.pick === M.sel));
      b.classList.toggle('seen', playerStats.discovered.includes(b.dataset.pick));
    });
  }
  function setMapView(name) {
    $$('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === name)));
    const to = WORLD.views[name], from = M.view.slice(), svg = $('#world');
    const apply = v => { M.view = v; svg.setAttribute('viewBox', v.join(' ')); };
    cancelAnimationFrame(M.raf);
    if (reducedMotion()) return apply(to);
    const t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / 450), e = 1 - (1 - k) ** 3;
      apply(from.map((f, i) => f + (to[i] - f) * e));
      if (k < 1) M.raf = requestAnimationFrame(step);
    };
    M.raf = requestAnimationFrame(step);
  }
  function selectCountry(id) {
    const c = COUNTRIES.find(x => x.id === id);
    M.sel = id; refreshMap();
    $('#map-card').innerHTML = `<div class="info"><img src="${flagSrc(c.id)}" alt="Bandera de ${c.name}" width="64" height="64"><p><b>${c.name}</b><br><b>Idioma:</b> ${c.lang}<br><b>Capital:</b> ${c.cap}<br><b>Región:</b> ${c.region}</p></div>
    <p class="fact"><b>Dato:</b> ${c.fact}</p>
    <button type="button" class="btn primary" data-act="playflag" data-id="${c.id}">Jugar con esta bandera →</button>`;
  }
  function selectOther(name) {
    M.sel = null; refreshMap();
    $('#map-card').innerHTML = `<b>${name}</b><p>No figura entre los 20 países con español oficial o nacional de este proyecto.</p>`;
  }
  function onMapPick(p) {
    if (!p.dataset.id) return selectOther(p.dataset.name);
    const keep = document.activeElement === p;
    $('#world').append(p); // el país elegido se dibuja encima para ver su contorno
    if (keep) p.focus({ preventScroll: true });
    selectCountry(p.dataset.id);
  }
  function moveTip(e) {
    const p = e.target.closest('path'), tip = $('#map-tip');
    if (!p) { tip.hidden = true; return; }
    const r = $('.worldwrap').getBoundingClientRect();
    tip.hidden = false; tip.textContent = p.dataset.id ? `${p.dataset.name} · Español` : p.dataset.name;
    tip.style.left = `${e.clientX - r.left}px`; tip.style.top = `${e.clientY - r.top}px`;
  }
  function initMap() {
    const svg = $('#world');
    drawWorld(svg, true); drawWorld($('#hero-map'), false);
    $('#map-list').innerHTML = COUNTRIES.map(c =>
      `<button type="button" class="chip2" data-pick="${c.id}" aria-pressed="false"><img src="${flagSrc(c.id)}" alt="" width="28" height="28" loading="lazy"><span>${c.name}</span></button>`).join('');
    svg.addEventListener('mousemove', moveTip);
    svg.addEventListener('mouseleave', () => { $('#map-tip').hidden = true; });
    svg.addEventListener('click', e => { const p = e.target.closest('path'); if (p) onMapPick(p); });
    svg.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('path')) { e.preventDefault(); onMapPick(e.target); }
    });
    $('#map-list').addEventListener('click', e => {
      const b = e.target.closest('[data-pick]');
      if (!b) return;
      const c = COUNTRIES.find(x => x.id === b.dataset.pick);
      selectCountry(c.id);
      setMapView(c.region === 'Europa' ? 'europa' : c.region === 'África' ? 'africa' : 'america');
    });
    $$('[data-view]').forEach(b => b.addEventListener('click', () => setMapView(b.dataset.view)));
    $$('[data-flag]').forEach(i => { i.src = flagSrc(i.dataset.flag); });
  }

  /* Entrada nativa: el <input> cubre el tablero; en el móvil abre el teclado del sistema. */
  const isTouch = () => matchMedia('(pointer: coarse)').matches;
  const cleanWord = v => v.replace(/ñ/gi, '\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0001/g, 'Ñ').toUpperCase().replace(/[^A-ZÑ]/g, '').slice(0, 5);
  function onTermoInput(e) {
    const clean = T.over ? '' : cleanWord(e.target.value);
    if (e.target.value !== clean) e.target.value = clean;
    T.cur = clean; paintRow();
  }
  function setKeyboard(show) {
    $('#kb').hidden = !show;
    $('#t-kbtoggle').setAttribute('aria-pressed', String(show));
  }
  function focusTermo() { if (!isTouch()) $('#t-input').focus({ preventScroll: true }); }
  function initTermoInput() {
    const input = $('#t-input');
    input.addEventListener('input', onTermoInput);
    input.addEventListener('focus', () => { if (isTouch()) setTimeout(() => $('#grid').scrollIntoView({ block: 'center', behavior: 'smooth' }), 300); });
    // Pulsar teclas/botones del juego no debe cerrar el teclado nativo.
    ['#kb', '[data-act=sendword]'].forEach(s => ['pointerdown', 'mousedown'].forEach(ev => $(s).addEventListener(ev, e => e.preventDefault())));
    $('#t-hint').textContent = isTouch() ? 'Toca el tablero para escribir con el teclado de tu celular y pulsa Enter para enviar.' : 'Escribe con tu teclado, pulsa Enter para enviar y Retroceso para borrar.';
    setKeyboard(!isTouch());
  }

  /* ---------- Reinicio y eventos ---------- */
  function resetGame(game) { ({ puzzle: initPuzzle, quien: initWhoAmI, termo: initTermo })[game](); }
  const ACTIONS = {
    shuffle: () => startPuzzle(P.c), again: () => startPuzzle(P.c),
    newp: () => startPuzzle(P.mode === 'random' ? randomCountry() : P.c), nextflag: () => startPuzzle(randomCountry()),
    hint: showHint, qprev: () => changeCard(-1), qnext: () => changeCard(1), qflip: () => setFlip(!qState().flipped),
    newt: () => { resetGame('termo'); focusTermo(); }, sendword: () => handleTermoInput('ENTER'), togglekb: () => setKeyboard($('#kb').hidden),
    home: () => go('inicio'), closemodal: () => { },
    playflag: el => { P.mode = 'pick'; go('puzzle'); startPuzzle(COUNTRIES.find(c => c.id === el.dataset.id)); },
    viewmap: el => { go('mapa'); selectCountry(el.dataset.id); },
    resetstats: () => openModal({
      title: '¿Reiniciar estadísticas?', lead: 'Se borrarán tu puntuación, tus victorias y tus países descubiertos.', confetti: false,
      actions: [['Sí, reiniciar', 'confirmreset', 'primary'], ['Cancelar', 'closemodal', 'ghost']]
    }),
    confirmreset: () => resetStats()
  };
  function onClick(e) {
    const nav = e.target.closest('[data-go]');
    if (nav) return go(nav.dataset.go, nav.dataset.scroll || 'top');
    const act = e.target.closest('[data-act]');
    if (act) {
      if (act.closest('dialog')) $('#modal').close();
      ACTIONS[act.dataset.act](act);
      if (act.dataset.act === 'newt') act.blur();
      return;
    }
    const piece = e.target.closest('.piece');
    if (piece) return onPieceActivate(piece);
    const opt = e.target.closest('[data-diff],[data-mode],[data-country]');
    if (opt) return onPuzzleOption(opt);
    const key = e.target.closest('.key');
    if (key) handleTermoInput(key.dataset.k);
  }
  function onKeydown(e) {
    if (e.target.classList.contains('piece') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); return onPieceActivate(e.target); }
    if ($('#termo').hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.id === 't-input') {
      if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); handleTermoInput('ENTER'); }
      return;
    }
    const plain = /^[ñÑ]$/.test(e.key) ? 'Ñ' : e.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(); // á → A, ñ se conserva
    const k = e.key === 'Enter' ? 'ENTER' : e.key === 'Backspace' ? 'BACK' : plain;
    if (!(k === 'ENTER' || k === 'BACK' || /^[A-ZÑ]$/.test(k))) return;
    if (k === 'ENTER' && e.target.closest('button:not(.key)')) return; // otros botones usan su Enter nativo
    e.preventDefault();
    handleTermoInput(k);
  }
  function initApp() {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('hashchange', () => showScreen(location.hash.slice(1)));
    $('#q-form').addEventListener('submit', checkWhoAmIAnswer);
    loadStats();
    buildPicker(); initPuzzleDrag(); initMap();
    initCardGestures(); initTermoInput();
    buildTermoBoard();
    ['puzzle', 'quien', 'termo'].forEach(resetGame);
    updateScoreUI();
    setInterval(() => { if (!$('#puzzle').hidden && !P.won) updatePuzzleStats(); }, 500);
    showScreen(location.hash.slice(1) || 'inicio', false);
  }
  try { initApp(); } catch (err) { console.error('Error al iniciar la aplicación:', err); }
})();
