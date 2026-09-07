# Engaging Web Experience

copia este html tal cual

Quiero añadir animaciones y detalles de interacción a la página, sin cambiar en ningún caso los colores, la paleta, el contenido/textos ni la estructura o el orden de las secciones. Solo se trata de dar más vida y dinamismo visual. Por favor implementa:

Entrada de la sección hero: que el titular principal aparezca con un efecto de entrada suave y escalonado (por ejemplo, palabra por palabra o línea por línea con un ligero desvanecimiento + desplazamiento hacia arriba), y que el párrafo y los botones aparezcan justo después con un pequeño retraso.

Scroll reveal en todas las secciones: cada bloque de contenido (tarjetas, textos, imágenes) debe aparecer con un fade-in + desplazamiento sutil hacia arriba cuando entra en el viewport al hacer scroll, en lugar de aparecer todo de golpe.

Micro-interacciones en botones: efecto hover con leve elevación/escala y una sombra que se intensifica al pasar el cursor; en desktop, un pequeño efecto "magnético" donde el botón sigue levemente el cursor al acercarse (sin afectar el texto ni el color).

Tarjetas con tilt 3D sutil: en las tarjetas de servicios, testimonios o "por qué trabajar conmigo", añade un ligero efecto de inclinación 3D que sigue el cursor al pasar por encima (perspectiva suave, nada exagerado), solo en dispositivos con mouse (no en móvil/touch).

Contadores animados: si hay cifras o estadísticas (años de experiencia, número de proyectos, etc.), que se animen contando desde 0 hasta el valor final cuando la sección entra en pantalla.

Barra de progreso de scroll: una barra fina y discreta en la parte superior de la página que se llena según el avance del scroll del usuario.

Transiciones entre secciones: pequeños efectos de parallax o profundidad en fondos/formas decorativas para dar sensación de profundidad al hacer scroll (muy sutil, no debe marear ni distraer).

Accesibilidad: todas las animaciones deben respetar prefers-reduced-motion, desactivándose o reduciéndose para usuarios que tengan esa preferencia activada en su sistema.

Importante: no cambies la paleta de colores actual, no cambies ningún texto ni copy, y no reordenes ni elimines ninguna sección existente. Esto es exclusivamente sobre animación, movimiento y micro-interacciones.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pagina-magda-3.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/190d5dcf-6519-4b9e-b49c-bacbc1223971).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
