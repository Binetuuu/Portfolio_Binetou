variable "namespace" {}

variable "mongo_password" {
  sensitive = true
}

resource "kubernetes_stateful_set" "mongodb" {
  metadata {
    name      = "mongodb"
    namespace = var.namespace
  }

  spec {
    service_name = "mongodb-headless"
    replicas     = 1

    selector {
      match_labels = {
        app = "mongodb"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongodb"
        }
      }

      spec {
        container {
          name  = "mongodb"
          image = "mongo:6.0"

          port {
            container_port = 27017
          }

          # Base de données créée au démarrage
          env {
            name  = "MONGO_INITDB_DATABASE"
            value = "portfolio"
          }

          # Utilisateur administrateur MongoDB
          env {
            name  = "MONGO_INITDB_ROOT_USERNAME"
            value = "admin"
          }

          # Mot de passe administrateur MongoDB
          env {
            name = "MONGO_INITDB_ROOT_PASSWORD"

            value_from {
              secret_key_ref {
                name = "mongodb-secret"
                key  = "MONGO_PASSWORD"
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
            exec {
              command = [
                "mongosh",
                "--eval",
                "db.adminCommand('ping')"
              ]
            }

            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            exec {
              command = [
                "mongosh",
                "--eval",
                "db.adminCommand('ping')"
              ]
            }

            initial_delay_seconds = 15
            period_seconds        = 5
          }

          volume_mount {
            name       = "mongodb-data"
            mount_path = "/data/db"
          }
        }
      }
    }

    volume_claim_template {
      metadata {
        name = "mongodb-data"
      }

      spec {
        access_modes = ["ReadWriteOnce"]

        resources {
          requests = {
            storage = "1Gi"
          }
        }
      }
    }
  }
}

output "mongodb_statefulset" {
  value = kubernetes_stateful_set.mongodb.metadata[0].name
}
