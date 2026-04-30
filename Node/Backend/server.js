// importer le package http
const http=require('http');
// Creation d'un serveur web.la methode end pour afficher une reponse de type string en l'appelant
const server = http.createServer((req, res) => {
     res.end('voici la reponse du serveur');
});

// on ecoute la requette envoyer
server.listen(process.env.PORT || 3000);
