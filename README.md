✅ 1. Clonar el repositorio (solo la primera vez):
git clone https://github.com/usuario/repositorio.git
cd repositorio

🔄 2. Actualizar tu repositorio local (mantenerlo al día):
a. Cambiar a la rama dev y actualizarla:
git checkout dev
git pull origin dev

b. Ir a tu rama individual y actualizarla con los últimos cambios:
git checkout feature/Valeria  # o tu rama correspondiente
git merge dev

Si hay conflictos, resuélvelos, guarda los cambios y haz:

git add .
git commit -m "Resuelto conflicto con dev"

⬆️ 3. Subir tus avances:
a. Asegúrate de estar en tu rama:
git checkout feature/Valeria

b. Agrega, commitea y sube:
git add .
git commit -m "Descripción de los avances"
git push origin feature/Valeria

🔁 4. Cuando termines tu tarea:

Haz un pull request (PR) desde tu rama (feature/Valeria) hacia dev en GitHub, para que tus cambios se integren al desarrollo general.
