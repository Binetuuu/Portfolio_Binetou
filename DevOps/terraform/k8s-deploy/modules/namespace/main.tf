variable "namespace" {
  description = "Nom du namespace"
}

resource "kubernetes_namespace" "portfolio" {
  metadata {
    name = var.namespace
    labels = {
      app = var.namespace
    }
  }
}

output "namespace_name" {
  value = kubernetes_namespace.portfolio.metadata[0].name
}
