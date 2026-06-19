# 📖 Explication du fichier main.tf

## 🎯 Vue d'ensemble

Le fichier `main.tf` est le fichier principal de configuration Terraform. Il définit **toutes les ressources AWS** qui seront créées : VPC, sous-réseaux, groupe de sécurité, instance EC2, etc.

---

## 📋 Table des matières

1. [Configuration Terraform](#configuration-terraform)
2. [Provider AWS](#provider-aws)
3. [Récupération de l'AMI](#récupération-de-lami)
4. [VPC](#vpc)
5. [Internet Gateway](#internet-gateway)
6. [Subnet Public](#subnet-public)
7. [Route Table](#route-table)
8. [Security Group](#security-group)
9. [Instance EC2](#instance-ec2)

---

## 🔧 Configuration Terraform

```hcl
terraform {
  required_version = ">= 1.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

**Qu'est-ce que c'est ?**
- Déclare les **dépendances** de Terraform
- Spécifie le **provider AWS** (le plugin qui gère AWS)
- Version minimum de Terraform : `>= 1.3`
- Version du provider AWS : `~> 5.0` (entre 5.0 et 5.99)

**Pourquoi ?**
- Assure que tout le monde utilise les mêmes versions
- Évite les incompatibilités

---

## ☁️ Provider AWS

```hcl
provider "aws" {
  region = var.aws_region
}
```

**Qu'est-ce que c'est ?**
- Configure la connexion à **AWS**
- Utilise la région définie dans `variables.tf` : `us-west-2`
- Les **credentials AWS** viennent de `aws configure` (fichier `~/.aws/credentials`)

**Résultat :**
Terraform se connecte à AWS région `us-west-2` avec vos identifiants.

---

## 📥 Récupération de l'AMI

```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
```

**Qu'est-ce que c'est ?**
- **AMI** = Amazon Machine Image (image système préconfigurée)
- Ce bloc **récupère** l'AMI Amazon Linux 2 la plus récente
- Ne **crée pas** une ressource, elle la **cherche** sur AWS

**Filtres :**
- `most_recent = true` : prendre la version la plus récente
- `owners = ["amazon"]` : vérifiée par Amazon (sécurisée)
- `name = "amzn2-ami-hvm-*-x86_64-gp2"` : pattern pour Amazon Linux 2, 64-bit

**Résultat :**
`data.aws_ami.amazon_linux.id` = AMI ID de Amazon Linux 2 la plus récente

**Exemple :**
```
ami-0c55b159cbfafe1f0
```

---

## 🌐 VPC

```hcl
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name        = "${var.project}-vpc"
    Owner       = "demo-terra"
    Environment = "dev"
  }
}
```

**Qu'est-ce que c'est ?**
- **VPC** = Virtual Private Cloud (réseau isolé sur AWS)
- Crée un réseau privé pour votre infrastructure

**Paramètres :**
- `cidr_block = "10.0.0.0/16"` : plage d'adresses IP privées (65536 IPs disponibles)
- `enable_dns_support = true` : active DNS dans le VPC
- `enable_dns_hostnames = true` : les instances reçoivent des noms DNS

**Tags :**
- `Name = "portfolio-vpc"` : nom visible dans AWS console
- `Owner = "demo-terra"` : propriétaire
- `Environment = "dev"` : environnement de développement

**Résultat :**
`aws_vpc.main.id` = VPC ID
```
vpc-0a1b2c3d
```

---

## 🚪 Internet Gateway

```hcl
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name  = "${var.project}-igw"
    Owner = "demo-terra"
  }
}
```

**Qu'est-ce que c'est ?**
- **IGW** = Internet Gateway (passerelle vers Internet)
- Permet à votre VPC de communiquer avec Internet

**Paramètres :**
- `vpc_id = aws_vpc.main.id` : attaché au VPC créé précédemment

**Besoin :**
- Sans IGW, l'instance EC2 ne peut pas accéder à Internet
- Sans IGW, Internet ne peut pas accéder à l'instance EC2

**Résultat :**
`aws_internet_gateway.main.id` = IGW ID
```
igw-0xyz1234abc
```

---

## 🔗 Subnet Public

```hcl
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = {
    Name  = "${var.project}-subnet-public"
    Owner = "demo-terra"
  }
}
```

**Qu'est-ce que c'est ?**
- **Subnet** = sous-réseau (subdivision du VPC)
- Définit où les instances seront lancées

**Paramètres :**
- `cidr_block = "10.0.1.0/24"` : sous-réseau (256 IPs, de 10.0.1.0 à 10.0.1.255)
- `availability_zone = "us-west-2a"` : zone géographique (toujours finit par a, b, c...)
- `map_public_ip_on_launch = true` : **IMPORTANT** : assigne une IP publique aux instances

**Sans `map_public_ip_on_launch` :**
- L'instance aurait une IP privée (10.0.1.x)
- Pas accessible depuis Internet

**Résultat :**
`aws_subnet.public.id` = Subnet ID
```
subnet-0xyz1234abc
```

---

## 📍 Route Table

```hcl
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = {
    Name  = "${var.project}-rt-public"
    Owner = "demo-terra"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}
```

**Qu'est-ce que c'est ?**
- **Route Table** = table de routage (définit où vont les paquets)

**Paramètres de la route :**
- `cidr_block = "0.0.0.0/0"` : **tous les paquets** (vers Internet)
- `gateway_id = aws_internet_gateway.main.id` : via l'Internet Gateway

**Signification :**
"Tous les paquets vers Internet (0.0.0.0/0) passent par l'IGW"

**Association :**
- Attache la route table au subnet
- Sans cela, le subnet n'aurait pas de règles de routage

**Flux :**
```
Instance EC2 (10.0.1.42)
  ↓
Veut envoyer vers Internet
  ↓
Consulte Route Table
  ↓
Voit : "0.0.0.0/0 → IGW"
  ↓
Envoie via IGW → Internet
```

---

## 🔒 Security Group

```hcl
resource "aws_security_group" "ec2" {
  name   = "${var.project}-sg-ec2"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name  = "${var.project}-sg-ec2"
    Owner = "demo-terra"
  }
}
```

**Qu'est-ce que c'est ?**
- **Security Group** = pare-feu (règles d'accès réseau)

**Règle Ingress (Entrant) :**
```
De : n'importe où (0.0.0.0/0)
Port : 80 (HTTP)
Protocole : TCP
Vers : l'instance EC2
```
✅ Permet d'accéder à votre site web sur le port 80

**Règle Egress (Sortant) :**
```
De : l'instance EC2
Port : tous (0 à 0)
Protocole : tous (-1)
Vers : partout (0.0.0.0/0)
```
✅ Permet à l'instance de communiquer vers l'extérieur

**Résultat :**
- ✅ Votre site est accessible sur `http://IP:80`
- ✅ L'instance peut faire des requêtes sortantes

---

## 💻 Instance EC2

```hcl
resource "aws_instance" "demo" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    echo "<h1>Portfolio Binetou - Terraform OK !</h1>" > /var/www/html/index.html
  EOF

  tags = {
    Name  = "${var.project}-ec2"
    Owner = "demo-terra"
  }
}
```

**Qu'est-ce que c'est ?**
- **Instance EC2** = serveur virtuel (machine sur AWS)

**Paramètres :**
- `ami = data.aws_ami.amazon_linux.id` : utilise l'AMI Amazon Linux 2 récupérée plus haut
- `instance_type = "t3.micro"` : type de serveur (t3.micro = petit, gratuit dans free tier)
- `subnet_id = aws_subnet.public.id` : lancer l'instance dans le subnet public
- `vpc_security_group_ids = [aws_security_group.ec2.id]` : appliquer le groupe de sécurité

**User Data (script de démarrage) :**
```bash
#!/bin/bash
yum update -y                    # Mettre à jour le système
yum install -y httpd             # Installer Apache HTTP Server
systemctl start httpd            # Démarrer le serveur web
systemctl enable httpd           # L'autoriser à redémarrer après reboot
echo "<h1>..." > /var/www/html/index.html  # Créer une page HTML
```

**Résultat :**
- Une instance EC2 démarre automatiquement
- Apache (serveur web) est installé et lancé
- Une page "Portfolio Binetou - Terraform OK !" est accessible

---

## 🔗 Dépendances implicites

Terraform comprend automatiquement l'ordre :

```
1. aws_vpc.main
   ↓
2. aws_internet_gateway.main (besoin du VPC)
   ↓
3. aws_subnet.public (besoin du VPC)
   ↓
4. aws_route_table.public (besoin du VPC et IGW)
   ↓
5. aws_route_table_association.public (besoin de la route table et du subnet)
   ↓
6. aws_security_group.ec2 (besoin du VPC)
   ↓
7. aws_instance.demo (besoin du subnet et du SG)
```

**Vous n'avez rien à faire** - Terraform gère les dépendances !

---

## 🚀 Résumé

| Ressource | Rôle |
|-----------|------|
| **VPC** | Crée un réseau privé |
| **IGW** | Permet Internet ↔ VPC |
| **Subnet** | Zone dans le VPC pour les instances |
| **Route Table** | Dirige le trafic vers IGW |
| **Security Group** | Pare-feu (port 80 ouvert) |
| **EC2** | Serveur web avec Apache |

**Après `terraform apply` :**
```
✅ VPC créé (10.0.0.0/16)
✅ IGW attaché
✅ Subnet public créé (10.0.1.0/24)
✅ Route table configurée
✅ Security Group ouvert sur port 80
✅ Instance EC2 lancée avec Apache
✅ Page web accessible
```

---

**Créé le** : 12 juin 2026  
**Version** : 1.0.0
![alt text](image.png)