export type Collection = { slug:string; name:string; eyebrow:string; description:string; material:string; image:string };
export type Product = { slug:string; name:string; collection:string; room:string; type:string; price:string; status:string; tagline?:string; stats:[string,string,string][]; description:string; materials:string[]; dimensions:string; images:string[] };

export const heroImage = "/hero-stahle.png";
export const collections: Collection[] = [
 {slug:"obsidian",name:"Obsidian",eyebrow:"Metal + vidrio",description:"Geometrías precisas, metal oscuro y reflejos profundos. Una colección de presencia arquitectónica.",material:"Metal negro y vidrio ahumado",image:"/productos/mesa-obsidian-i/portada.png"},
 {slug:"savia",name:"Savia",eyebrow:"Metal + madera",description:"La calidez de la madera se encuentra con la firmeza del metal en piezas serenas y contemporáneas.",material:"Metal y madera natural",image:"/colecciones/savia-v2.webp"},
 {slug:"aurea",name:"Áurea",eyebrow:"Metal + piedra",description:"Superficies minerales y detalles metálicos para interiores elegantes, luminosos y atemporales. Mármol, granito, cuarzo o porcelánico según el carácter y presupuesto de cada pieza.",material:"Metal y superficies minerales",image:"/colecciones/aurea-v2.webp"},
 {slug:"vertice",name:"Vértice",eyebrow:"Diseño en metal",description:"Líneas funcionales y estructuras honestas donde el metal se convierte en protagonista: espejos, organización, piezas de baño y soluciones para recibir.",material:"Metal y geometría funcional",image:"/productos/vertice/vinera-reserva/principal.jfif"}
];
export const rooms = [
 {slug:"sala",name:"Sala",detail:"Mesas · Consolas · TV",image:"/ambientes/sala.webp"},
 {slug:"comedor",name:"Comedor",detail:"Mesas · Barras · Auxiliares",image:"/ambientes/comedor.webp"},
 {slug:"dormitorio",name:"Dormitorio",detail:"Burós · Bancas · Consolas",image:"/ambientes/dormitorio.webp"},
 {slug:"cocina",name:"Cocina",detail:"Islas · Repisas · Bancos",image:"/ambientes/cocina.webp"},
 {slug:"bano",name:"Baño",detail:"Lavabos · Repisas · Toalleros",image:"/ambientes/bano.webp"},
 {slug:"oficina",name:"Oficina",detail:"Escritorios · Estanterías",image:"/ambientes/oficina.webp"}
];
export const products: Product[] = [{
 slug:"mesa-obsidian-i",name:"Mesa de centro Eclipse",collection:"obsidian",room:"sala",type:"Mesa de centro",price:"Precio por confirmar",status:"Fabricación bajo pedido",stats:[["01","Metal","negro satinado"],["02","Vidrio","ahumado templado"],["03","Medidas","120 × 70 × 40 cm"]],
 tagline:"El punto de encuentro de tu sala.",
 description:"Una pieza que transforma el centro de la sala. Eclipse combina la transparencia del vidrio ahumado con una estructura metálica de líneas cruzadas. Su geometría cambia según el ángulo desde el que se observa, creando una presencia elegante sin recargar el espacio. Diseñada para reunir momentos, miradas y conversaciones alrededor de una pieza con carácter.",
 materials:["Estructura de acero en tubo cuadrado de 40 × 40 mm","Pintura electrostática negra satinada","Vidrio templado ahumado de 10 mm con bordes pulidos","Apoyos protectores para el vidrio y el piso"],dimensions:"120 × 70 × 40 cm (largo × ancho × alto). Medidas personalizables bajo cotización.",
 images:[
  "/productos/mesa-obsidian-i/portada.png",
  "/productos/mesa-obsidian-i/vista-perspectiva.jpg",
  "/productos/mesa-obsidian-i/vista-lateral-amplia.png",
  "/productos/mesa-obsidian-i/vista-frontal.png",
  "/productos/mesa-obsidian-i/vista-superior.png",
  "/productos/mesa-obsidian-i/detalle-vidrio.png"
 ]
},{
 slug:"mesa-raiz",name:"Mesa de comedor Raíz",collection:"savia",room:"comedor",type:"Mesa de comedor",price:"Precio por confirmar",status:"Fabricación bajo pedido",stats:[["01","Madera","tono nogal"],["02","Metal","negro mate"],["03","Uso","comedor"]],
 tagline:"La calidez que reúne a todos.",
 description:"Raíz nace del encuentro entre una cubierta de madera natural y una base metálica de líneas firmes. Una mesa pensada para reunir personas, conversaciones y momentos alrededor de un material que hace que cada espacio se sienta más propio.",
 materials:["Cubierta de madera natural de tono nogal","Estructura de acero en perfil cuadrado","Acabado negro mate de alta resistencia","Protección para conservar la veta de la madera"],dimensions:"Medidas personalizables según el comedor y el número de personas.",
 images:[
  "/productos/mesa-raiz/Gemini_Generated_Image_gysw21gysw21gysw.jfif",
  "/productos/mesa-raiz/Gemini_Generated_Image_rlim26rlim26rlim.jfif",
  "/productos/mesa-raiz/Gemini_Generated_Image_iwtwm2iwtwm2iwtw.jfif",
  "/productos/mesa-raiz/Gemini_Generated_Image_a460yca460yca460.jfif",
  "/productos/mesa-raiz/Gemini_Generated_Image_m2pffcm2pffcm2pf.jfif",
  "/productos/mesa-raiz/Gemini_Generated_Image_sg2z73sg2z73sg2z.jfif",
  "/productos/mesa-raiz/Gemini_Generated_Image_u8ky1ju8ky1ju8ky.jfif",
  "/productos/mesa-raiz/Gemini_Generated_Image_dh0ixwdh0ixwdh0i.jfif"
 ]
},{
 slug:"mesa-umbral",name:"Mesa de centro Umbral",collection:"aurea",room:"sala",type:"Mesa de centro",price:"Precio por confirmar",status:"Fabricación bajo pedido",stats:[["01","Cubierta","piedra a elegir"],["02","Estructura","acero negro"],["03","Acabado","a medida"]],
 tagline:"Donde la piedra encuentra su estructura.",
 description:"Umbral combina la profundidad de una cubierta mineral con una base metálica de geometría precisa. Puede fabricarse con mármol natural o con alternativas de gran presencia visual y mejor control de presupuesto, como granito, cuarzo compacto o porcelánico de gran formato.",
 materials:["Cubierta disponible en mármol, granito, cuarzo compacto o porcelánico sinterizado","Estructura de acero en perfil cuadrado","Acabado negro satinado de alta resistencia","Protectores inferiores para el piso"],dimensions:"Medidas personalizables según el espacio, el material elegido y la proporción de la sala.",
 images:[
  "/productos/mesa-umbral/Gemini_Generated_Image_g4m730g4m730g4m7.jfif",
  "/productos/mesa-umbral/Gemini_Generated_Image_ehhltehhltehhlte.jfif",
  "/productos/mesa-umbral/Gemini_Generated_Image_wgd64wgd64wgd64w.jfif",
  "/productos/mesa-umbral/Gemini_Generated_Image_fypm2bfypm2bfypm.jfif",
  "/productos/mesa-umbral/Gemini_Generated_Image_6xir1h6xir1h6xir.jfif",
  "/productos/mesa-umbral/Gemini_Generated_Image_wvhhfrwvhhfrwvhh.jfif"
  ]
 },{
 slug:"espejo-trama",name:"Espejo Trama",collection:"vertice",room:"dormitorio",type:"Espejo de cuerpo completo",price:"Precio por confirmar",status:"Fabricación bajo pedido",stats:[["01","Estructura","acero negro"],["02","Formato","cuerpo completo"],["03","Uso","entrada o dormitorio"]],
 tagline:"Una nueva perspectiva para tu espacio.",description:"Un espejo de líneas puras que amplía la luz y aporta estructura al ambiente. Su marco metálico crea una trama geométrica que convierte una pieza cotidiana en un gesto arquitectónico.",materials:["Marco doble de acero en perfil cuadrado","Acabado negro mate electrostático","Espejo de alta definición","Sistema de fijación reforzado"],dimensions:"Medidas personalizables según el muro y el ambiente.",images:[
  "/productos/vertice/espejo-trama/portada.png",
  "/productos/vertice/espejo-trama/Gemini_Generated_Image_sq6divsq6divsq6d.jfif",
  "/productos/vertice/espejo-trama/02-lateral.jfif",
  "/productos/vertice/espejo-trama/Gemini_Generated_Image_tecpngtecpngtecp.jfif",
  "/productos/vertice/espejo-trama/Gemini_Generated_Image_cccxqwcccxqwcccx.jfif"
 ]
 },{
 slug:"toallero-mano",name:"Toallero Nudo",collection:"vertice",room:"bano",type:"Toallero de mano",price:"Precio por confirmar",status:"Fabricación bajo pedido",stats:[["01","Estructura","acero negro"],["02","Formato","barra mural"],["03","Uso","baño"]],
 tagline:"El orden también puede tener carácter.",description:"Una pieza compacta y precisa que mantiene la toalla a mano y aporta un detalle arquitectónico al baño.",materials:["Acero en perfil cuadrado","Acabado negro mate electrostático","Anclaje oculto de pared"],dimensions:"Medidas personalizables según el muro.",images:[
  "/productos/vertice/toallero-mano/portada.jfif",
  "/productos/vertice/toallero-mano/Gemini_Generated_Image_lukcrmlukcrmlukc.jfif",
 "/productos/vertice/toallero-mano/Gemini_Generated_Image_mh5l9mh5l9mh5l9m.jfif",
  "/productos/vertice/toallero-mano/03-vista.jfif"
 ]
},{
 slug:"vinera-reserva",name:"Vinera Reserva",collection:"vertice",room:"cocina",type:"Vinera mural",price:"Precio por confirmar",status:"Fabricación bajo pedido",stats:[["01","Estructura","acero negro mate"],["02","Capacidad","botellas y copas"],["03","Instalación","mural y a medida"]],
 tagline:"Todo lo que compartes, en su lugar.",description:"Vinera Reserva organiza botellas, copas y licores en una sola pieza mural de presencia limpia. Su estructura metálica aprovecha la pared y convierte el rincón del desayunador en un punto práctico para recibir, servir y disfrutar. Concepto de diseño Stahlé disponible para fabricación personalizada.",materials:["Estructura de acero en perfil cuadrado","Acabado negro mate electrostático","Repisas y soportes metálicos para botellas","Porta copas inferior integrado"],dimensions:"Aproximadamente 80 × 150 × 25 cm (ancho × alto × profundidad). Medidas y distribución personalizables bajo cotización.",images:[
  "/productos/vertice/vinera-reserva/principal.jfif",
  "/productos/vertice/vinera-reserva/Gemini_Generated_Image_n1day6n1day6n1da.jfif",
  "/productos/vertice/vinera-reserva/Gemini_Generated_Image_f02quzf02quzf02q.jfif",
  "/productos/vertice/vinera-reserva/Gemini_Generated_Image_c7rertc7rertc7re.jfif",
  "/productos/vertice/vinera-reserva/Gemini_Generated_Image_6e7smr6e7smr6e7s.jfif",
  "/productos/vertice/vinera-reserva/Gemini_Generated_Image_xcz26mxcz26mxcz2.jfif"
 ]
 }];
export const getCollection=(slug:string)=>collections.find(c=>c.slug===slug);
export const getProduct=(slug:string)=>products.find(p=>p.slug===slug);
