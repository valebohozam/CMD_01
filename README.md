🔄 1. Subir avances a GitHub

Abre tu terminal y navega a tu proyecto:

cd ruta/a/tu/proyecto


Inicializa Git (si no lo has hecho):

git init


Agrega los archivos al staging area:

git add .


Haz un commit con un mensaje descriptivo:

git commit -m "Agregado avance del proyecto"


Conecta tu repositorio local con GitHub (solo la primera vez):

git remote add origin https://github.com/tuUsuario/tuRepositorio.git


Sube tus cambios a GitHub:

git push -u origin main


(si tu rama se llama diferente, como master o dev, usa ese nombre en vez de main)
