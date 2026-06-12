variable "namespace"      {}
variable "node_env"       {}
variable "app_port"       {}
variable "mongo_uri"      {}
variable "cors_origin"    {}
variable "mongo_password" { sensitive = true }

# ConfigMap - valeurs non sensibles
resource "kubernetes_config_map" "portfolio_config" {
  metadata {
    name      = "portfolio-config"
    namespace = var.namespace
  }

  data = {
    NODE_ENV    = var.node_env
    PORT        = var.app_port
    MONGO_URI   = var.mongo_uri
    CORS_ORIGIN = var.cors_origin
  }
}

# Secret - valeurs sensibles
resource "kubernetes_secret" "mongodb_secret" {
  metadata {
    name      = "mongodb-secret"
    namespace = var.namespace
  }

  data = {
    MONGO_PASSWORD = base64encode(var.mongo_password)
  }
}
