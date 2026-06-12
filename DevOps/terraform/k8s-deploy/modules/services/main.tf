variable "namespace" {}
variable "nodeport"  { default = 30080 }

# Service MongoDB ClusterIP
resource "kubernetes_service" "mongodb_service" {
  metadata {
    name      = "mongodb-service"
    namespace = var.namespace
  }
  spec {
    selector = { app = "mongodb" }
    port {
      port        = 27017
      target_port = 27017
    }
    type = "ClusterIP"
  }
}

# Service MongoDB Headless (pour StatefulSet)
resource "kubernetes_service" "mongodb_headless" {
  metadata {
    name      = "mongodb-headless"
    namespace = var.namespace
  }
  spec {
    selector   = { app = "mongodb" }
    cluster_ip = "None"
    port {
      port        = 27017
      target_port = 27017
    }
  }
}

# Service Backend ClusterIP
resource "kubernetes_service" "backend_service" {
  metadata {
    name      = "backend-service"
    namespace = var.namespace
  }
  spec {
    selector = { app = "backend" }
    port {
      port        = 80
      target_port = 5000
    }
    type = "ClusterIP"
  }
}

# Service Frontend NodePort
resource "kubernetes_service" "frontend_service" {
  metadata {
    name      = "frontend-service"
    namespace = var.namespace
  }
  spec {
    selector = { app = "frontend" }
    port {
      port        = 80
      target_port = 80
      node_port   = var.nodeport
    }
    type = "NodePort"
  }
}

output "mongodb_service_name"  { value = kubernetes_service.mongodb_service.metadata[0].name }
output "backend_service_name"  { value = kubernetes_service.backend_service.metadata[0].name }
output "frontend_service_name" { value = kubernetes_service.frontend_service.metadata[0].name }
