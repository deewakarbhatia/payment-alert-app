output "ec2_public_ip" {
  value       = aws_instance.payment_server.public_ip
  description = "Public IP of the EC2 server"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.payment_exports.bucket
  description = "S3 bucket name for exports"
}