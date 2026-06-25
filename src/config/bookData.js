/**
 * CONFIGURACIÓN DEL LIBRO DE RECUERDOS
 * 
 * Este archivo es lo ÚNICO que necesitas editar para cambiar el contenido.
 * 
 * TIPOS DE PÁGINA DISPONIBLES:
 * 
 * 'cover'          → Portada o contraportada
 * 'text'           → Texto editorial (soporta múltiples estilos)
 * 'dynamic-time'   → Texto con hora dinámica
 * 'photo'          → Fotos con presentación física automática
 * 'mixed'          → Combinación de texto y fotos
 * 'discovery'      → Contenido oculto que se revela al interactuar
 * 'letter'         → Carta desplegable
 * 'panoramic'      → Imagen que cruza ambas páginas (usar en pares)
 * 
 * ESTILOS DE TEXTO:
 * 'quote'          → Cita grande y elegante
 * 'handwritten'    → Nota manuscrita
 * 'poem'           → Poema distribuido
 * 'editorial'      → Texto editorial con tipografía variada
 * 'floating'       → Fragmentos flotantes por la página
 * 'diagonal'       → Texto en diagonal
 * 'giant-word'     → Una sola palabra enorme decorativa
 * 
 * PRESENTACIÓN DE FOTOS (se elige automáticamente por seed, o puedes forzar):
 * 'auto'           → El sistema elige (recomendado)
 * 'string-pins'    → Cuerda con pinzas
 * 'taped'          → Cinta adhesiva
 * 'clipped'        → Clips metálicos
 * 'sewn'           → Cosidas con hilo
 * 'polaroid-strip' → Tira de cabina
 * 'envelope'       → Dentro de un sobre
 * 'postcard'       → Tipo postal
 * 'found'          → Foto encontrada/envejecida
 * 'floating-frame' → Marco flotante
 * 'folded-corner'  → Esquina doblada
 * 'stacked'        → Apiladas
 * 'under-vellum'   → Bajo papel vegetal
 * 'mosaic'         → Mosaico irregular
 * 'chain'          → Cadena de recuerdos
 * 'mini-album'     → Mini álbum dentro del álbum
 */
/**
 * CONFIGURACIÓN DEL LIBRO DE RECUERDOS
 */

const fondoStickers = '/pages/fondo-stickers.png';

export const finalLetterText = `Gabriela, veo tus ojos y me abandonan los problemas,

La ùnica que satisface mi desorden

Queda perfecto todo lo que realizas

En cristal quisiera cuidarte

Dices que mis palabras nada van a cambiar,
quizá pienses que mis palabras se las llevará el viento,
pero nunca es así, cuando se dice con sentimiento.
Que no es mentira que me tienes envuelto.

Si las dudas invaden tu decisión

el arreglo lo encuentro

Los celos y toxicidad la dejaré aparte

Verte sé que no es fácil, estoy dispuesto

Si fue algo fugaz, esperemos a que sea permanente
Todos los días necesito verte, busco adueñarme de la casualidad.
Yo puedo irte a ver, dime dónde tú estás,
no importa si quieres salir de mañana.
Da la oportunidad, por ti voy a pasar,

días mejores vendrán

forma parte de nuestro nudo

Sé que soy molesto, pero siendo sincero

eres la chica perfecta para mi cuento

déjame ser quien te trate como la princesa que eres.
y así un “no” salga de ti, pensar en eso en mi mente no cabe.

Recostada en mí todo se siente mejor

Detrás de ti seguiré estando y estuve,
esto no lo hago con cualquiera, es contigo nada más.`;

/**
 * CONFIGURACIÓN DEL LIBRO DE RECUERDOS
 */

/**
 * CONFIGURACIÓN DEL LIBRO DE RECUERDOS
 */
const asset = (path) => `/cueck/${path.replace(/^\/+/, '')}`
export const bookConfig = {
  meta: {
    dedicatedTo: 'Gabriela',
    from: 'Con todo mi cariño',
  },

  pages: [
    {
      type: 'cover',
      background: asset('/pages/backgrounds/bc_1.png'),
      title: 'Para Gabriela',
      subtitle: 'Gamboa',
      style: 'front',
    },

    {
      type: 'mixed',
      background: asset('/pages/backgrounds/bc_2.png'),
      style: 'editorial',
      presentation: 'stacked',
      content: `La penumbra del cine`,
      images: [asset('/fotos/1.jpg'), asset('/fotos/2.jpg')],
      captions: ['sin avisar', 'se quedó'],
    },

    {
      type: 'mixed',
      background: asset('/pages/backgrounds/bc_3.png'),
      style: 'quote',
      presentation: 'polaroid-strip',
      content: `La penumbra del cine`,
      images: [asset('/fotos/3.jpg'), asset('/fotos/4.jpg')],
      captions: ['última hora', 'croqueta'],
    },

    {
      type: 'mixed',
      background: asset('/pages/backgrounds/bc_4.png'),
      style: 'handwritten',
      presentation: 'taped',
      content: `Lgante`,
      images: [asset('/fotos/5.jpg'), asset('/fotos/6.jpg')],
      captions: ['que mire como mira su celular', 'cuando te robé algo'],
    },

    {
      type: 'mixed',
      background: asset('/pages/backgrounds/bc_5.png'),
      style: 'floating',
      presentation: 'floating-frame',
      content: `Antes de que te enojes.`,
      images: [asset('/fotos/7.jpg'), asset('/fotos/1.jpg')],
      captions: ['la más linda', 'modelito'],
    },

    {
      type: 'cover',
      background: asset('/pages/backgrounds/bc_6.png'),
      title: '¿Continuamos?',
      subtitle: 'tú decides',
      style: 'back',
    },
  ],
}