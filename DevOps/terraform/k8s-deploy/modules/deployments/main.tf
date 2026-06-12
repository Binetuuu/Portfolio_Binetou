variable "namespace"          {}
variable "backend_image"      {}
variable "frontend_image"     {}
variable "backend_replicas"   { default = 2 }
variable "frontend_replicas"  { default = 2 }

# Deployment Backend
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "portfolio-backend"
    namespace = var.namespace
  }

  spec {
    replicas = var.backend_replicas

    selector {
      match_labels = { app = "backend" }
    }

    template {
      metadata {
        labels = { app = "backend" }
      }

      spec {
        container {
          name              = "backend"
          image             = var.backend_image
          image_pull_policy = "Always"

          port { container_port = 5000 }

          env {
            name = "NODE_ENV"
            value_from {
              config_map_key_ref {
                name = "portfolio-config"
                key  = "NODE_ENV"
              }
            }
          }

          env {
            name = "PORT"
            value_from {
              config_map_key_ref {
                name = "portfolio-config"
                key  = "PORT"
              }
            }
          }

          env {
            name = "MONGO_URI"
            value_from {
              config_map_key_ref {
                name = "portfolio-config"
                key  = "MONGO_URI"
              }
            }
          }

          env {
            name = "CORS_ORIGIN"
            value_from {
              config_map_key_ref {
                name = "portfolio-config"
                key  = "CORS_ORIGIN"
              }
            }
          }

          resources {
            requests = {
              cpu    = "250m"
              memory = "256Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/api/projets"
              port = 5000
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/api/projets"
              port = 5000
            }
            initial_delay_seconds = 15
            period_seconds        = 5
          }
        }
      }
    }
  }
}

# Deployment Frontend
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "portfolio-frontend"
    namespace = var.namespace
  }

  spec {
    replicas = var.frontend_replicas

    selector {
      match_labels = { app = "frontend" }
    }

    template {
      metadata {
        labels = { app = "frontend" }
      }

      spec {
        container {
          name              = "frontend"
          image             = var.frontend_image
          image_pull_policy = "Always"

          port { container_port = 80 }

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "250m"
              memory = "256Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 15
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 10
            period_seconds        = 5
          }
        }
      }
    }
  }
}

output "backend_deployment"  { value = kubernetes_deployment.backend.metadata[0].name }
output "frontend_deployment" { value = kubernetes_deployment.frontend.metadata[0].name }
