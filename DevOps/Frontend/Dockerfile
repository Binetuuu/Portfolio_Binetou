# Image de base Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers statiques vers le répertoire Nginx
COPY public /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Nginx démarre automatiquement avec l'image
CMD ["nginx", "-g", "daemon off;"]
