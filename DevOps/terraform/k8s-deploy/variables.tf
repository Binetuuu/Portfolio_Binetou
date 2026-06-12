# Cluster et namespace
variable "kubeconfig_path" {
  description = "Chemin vers le fichier kubeconfig"
  default     = "~/.kube/config"
}

variable "kube_context" {
  description = "Contexte Kubernetes cible"
  default     = "minikube"
}

variable "namespace" {
  description = "Namespace applicatif"
  default     = "portfolio"
}

# Images Docker
variable "dockerhub_user" {
  description = "Nom d'utilisateur Docker Hub"
  default     = "binetuuu"
}

variable "backend_image" {
  description = "Nom de l'image backend"
  default     = "portfolio-backend"
}

variable "frontend_image" {
  description = "Nom de l'image frontend"
  default     = "portfolio-frontend"
}

variable "image_tag" {
  description = "Tag des images Docker"
  default     = "latest"
}

# Configuration applicative
variable "node_env" {
  description = "Environnement Node.js"
  default     = "production"
}

variable "app_port" {
  description = "Port applicatif backend"
  default     = "5000"
}

variable "mongo_uri" {
  description = "URI de connexion MongoDB"
  default     = "mongodb://mongodb-0.mongodb-headless:27017/portfolio"
}

variable "cors_origin" {
  description = "Origine CORS autorisée"
  default     = "http://localhost:30080"
}

variable "frontend_nodeport" {
  description = "NodePort pour le frontend"
  default     = 30080
}

# Secrets
variable "mongo_password" {
  description = "Mot de passe MongoDB"
  sensitive   = true
  default     = "mongopass123"
}

# Réplicas
variable "backend_replicas" {
  description = "Nombre de réplicas backend"
  default     = 2
}

variable "frontend_replicas" {
  description = "Nombre de réplicas frontend"
  default     = 2
}
