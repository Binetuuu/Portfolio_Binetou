# Jenkins Simple - Portfolio

## Configuration Minimale

### 1. Prérequis Jenkins
- Plugin : **Docker Pipeline**
- Plugin : **Pipeline**
- Plugin : **Git**

### 2. Credentials Docker Hub
Dans Jenkins → Manage Credentials :
- Type : `Username with password`
- ID : `docker-hub-credentials`
- Username : `binetuuu`
- Password : `[votre mot de passe Docker Hub]`

### 3. Créer le Job
1. New Item → Pipeline
2. Repository URL : `https://github.com/votre-username/Portfolio_Binetou.git`
3. Script Path : `DevOps/Jenkinsfile`

## Pipeline Simple

Le pipeline fait seulement :

1. **Checkout** - Récupère le code
2. **Build & Test** - Construit et teste avec le `docker-compose.yml` existant
3. **Push** - Publie sur Docker Hub (branches main/master seulement)
4. **Deploy** - Déploie avec confirmation manuelle

## Commandes

```bash
# Le pipeline utilise votre docker-compose.yml existant
docker-compose up -d    # Pour tester
docker-compose down     # Pour arrêter
```

## Workflow

- **Toutes branches** → Build + Test
- **main/master** → Build + Test + Push + Deploy

**C'est tout !** Simple et efficace. 🚀