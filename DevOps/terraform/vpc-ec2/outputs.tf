output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_id" {
  value = aws_subnet.public.id
}

output "instance_id" {
  value = aws_instance.demo.id
}

output "public_ip" {
  value = aws_instance.demo.public_ip
}

output "private_ip" {
  value = aws_instance.demo.private_ip
}

output "ami_used" {
  value = data.aws_ami.amazon_linux.id
}

output "security_group" {
  value = aws_security_group.ec2.id
}

output "url_test" {
  value = "http://${aws_instance.demo.public_ip}"
}
