terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}
provider "aws" {
  region = var.region
}

# Security Group
resource "aws_security_group" "payment_sg" {
  name        = "payment-app-sg"
  description = "Allow web traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
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
    Name = "payment-app-sg"
  }
}

# EC2 Instance
resource "aws_instance" "payment_server" {
  ami                    = "ami-0989fb15ce71ba39e"
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.payment_sg.id]

  tags = {
    Name = "payment-alert-server"
  }
}

# S3 Bucket
resource "aws_s3_bucket" "payment_exports" {
  bucket = "payment-alert-exports-${random_id.bucket_id.hex}"

  tags = {
    Name = "payment-exports"
  }
}

resource "random_id" "bucket_id" {
  byte_length = 4
}