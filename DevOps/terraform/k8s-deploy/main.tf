# Déploiement Kubernetes via Terraform
# Remplace les commandes kubectl manuelles par des modules Terraform
# Modules : namespace → configmap → services → mongodb → deployments

terraform {
  required_version = ">= 1.3"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

# Connexion au cluster via kubeconfig local
provider "kubernetes" {
  config_path    = var.kubeconfig_path
  config_context = var.kube_context
}
# 1. Namespace
module "namespace" {
  source    = "./modules/namespace"
  namespace = var.namespace
}

# 2. ConfigMap + Secret
module "configmap" {
  source         = "./modules/configmap"
  namespace      = module.namespace.namespace_name
  node_env       = var.node_env
  app_port       = var.app_port
  mongo_uri      = var.mongo_uri
  cors_origin    = var.cors_origin
  mongo_password = var.mongo_password

  depends_on = [module.namespace]
}

# 3. Services
module "services" {
  source    = "./modules/services"
  namespace = module.namespace.namespace_name
  nodeport  = var.frontend_nodeport

  depends_on = [module.namespace]
}

# 4. MongoDB
module "mongodb" {
  source         = "./modules/mongodb"
  namespace      = module.namespace.namespace_name
  mongo_password = var.mongo_password

  depends_on = [module.services]
}

# 5. Deployments backend + frontend
module "deployments" {
  source            = "./modules/deployments"
  namespace         = module.namespace.namespace_name
  backend_image     = "${var.dockerhub_user}/${var.backend_image}:${var.image_tag}"
  frontend_image    = "${var.dockerhub_user}/${var.frontend_image}:${var.image_tag}"
  backend_replicas  = var.backend_replicas
  frontend_replicas = var.frontend_replicas

  depends_on = [module.mongodb, module.configmap]
}
