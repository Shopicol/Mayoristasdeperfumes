#!/bin/sh
# =====================================================================
#  SEGURO DE PUBLICACIÓN
#  Antes de publicar, comprueba que los archivos sean de ESTA tienda.
#  Si algo no coincide (por ejemplo, se subió el index.html de la otra tienda,
#  o el del admin en la raíz), este programa FALLA, Vercel NO publica,
#  y el sitio sigue funcionando con su última versión buena.
#
#  La identidad la pone vercel.json con:  TIENDA=mayoristas   o   TIENDA=shopicol
#  Para quitar este seguro: borra vercel.json del repo.
# =====================================================================
FALLO=0
malo() { echo "  X $1"; FALLO=1; }

case "$TIENDA" in
  mayoristas) MARCA="Mayoristas de Perfumes"; OTRA="Shopicol";                REF="lgslddmymksbukdcmdpd"; OTRAREF="cajadcmwdahfwmgqlgae"; CARRITO="mpv_cart_v1" ;;
  shopicol)   MARCA="Shopicol Bacano";        OTRA="Mayoristas de Perfumes"; REF="cajadcmwdahfwmgqlgae"; OTRAREF="lgslddmymksbukdcmdpd"; CARRITO="shopicol_cart_v1" ;;
  *) echo "SEGURO: falta indicar la tienda (TIENDA=mayoristas o TIENDA=shopicol) en vercel.json."; exit 1 ;;
esac

echo "SEGURO DE PUBLICACION - revisando que los archivos sean de: $MARCA"

# --- la página principal debe ser la TIENDA de esta marca (no el admin, no la otra tienda) ---
if [ ! -f index.html ]; then malo "falta index.html en la raiz"
else
  grep -qF "$MARCA" index.html                  || malo "index.html (raiz) no dice \"$MARCA\": parece ser de otra tienda o del admin"
  grep -qF 'id="productGrid"' index.html        || malo "index.html (raiz) no tiene el catalogo de productos: no es la tienda"
  grep -qF 'id="loginEmail"' index.html         && malo "index.html (raiz) es la pantalla de inicio de sesion del ADMIN; el admin va en la carpeta admin/"
  grep -qiF "$OTRA" index.html                  && malo "index.html (raiz) menciona \"$OTRA\": es de la otra tienda"
fi

# --- el admin debe estar en admin/ y ser de esta marca ---
if [ ! -f admin/index.html ]; then malo "falta admin/index.html"
else
  grep -qF 'id="loginEmail"' admin/index.html   || malo "admin/index.html no es la pantalla del admin (no tiene el inicio de sesion)"
  grep -qF "$MARCA" admin/index.html            || malo "admin/index.html no dice \"$MARCA\": es de otra tienda"
fi
[ -f admin/admin.js ] || malo "falta admin/admin.js"

# --- la conexion a la base de datos debe ser la de esta tienda ---
if [ ! -f config.js ]; then malo "falta config.js"
else
  grep -qF "$REF" config.js                     || malo "config.js no apunta a la base de datos de esta tienda"
  grep -qF "$OTRAREF" config.js                 && malo "config.js apunta a la base de datos de la OTRA tienda"
fi

# --- el programa de la tienda debe ser el de esta marca ---
if [ ! -f script.js ]; then malo "falta script.js"
else
  grep -qF "$CARRITO" script.js                 || malo "script.js no es el de esta tienda (no usa $CARRITO)"
fi

if [ "$FALLO" -ne 0 ]; then
  echo ""
  echo "SEGURO: NO SE PUBLICA. Hay archivos que no son de $MARCA (ver arriba)."
  echo "        El sitio sigue con su ultima version buena. Corrige el archivo equivocado y vuelve a subirlo."
  exit 1
fi
echo "  OK: todo coincide con $MARCA. Se publica."
