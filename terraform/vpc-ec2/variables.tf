variable "aws_region" {
  description = "Région AWS"
  default     = "us-east-1"
}

variable "project" {
  description = "Nom du projet"
  default     = "portfolio"
}

variable "vpc_cidr" {
  description = "CIDR du VPC"
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR du subnet public"
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "Type d'instance EC2"
  default     = "t3.micro"
  validation {
    condition     = contains(["t3.micro", "t3.small", "t3.medium"], var.instance_type)
    error_message = "Type autorisé : t3.micro, t3.small, t3.medium."
  }
}
