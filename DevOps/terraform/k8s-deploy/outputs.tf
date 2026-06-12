output "frontend_url" {
  description = "URL d'accès au frontend"
  value       = "http://localhost:${var.frontend_nodeport}"
}

output "namespace" {
  description = "Namespace déployé"
  value       = module.namespace.namespace_name
}

output "kubectl_pods" {
  description = "Commande pour voir les pods"
  value       = "kubectl get pods -n ${var.namespace}"
}

output "kubectl_services" {
  description = "Commande pour voir les services"
  value       = "kubectl get services -n ${var.namespace}"
}

output "backend_logs" {
  description = "Commande pour voir les logs backend"
  value       = "kubectl logs -l app=backend -n ${var.namespace}"
}

output "test_api" {
  description = "Commande pour tester l'API backend"
  value       = "kubectl exec -it -n ${var.namespace} deployment/portfolio-backend -- curl http://localhost:5000/api/projets"
}
