# Expense Tracker Deployment Guide

This guide will help you deploy the "Expense Tracker" web application on an AWS EC2 instance using Docker.

## Prerequisites

1. AWS Account
2. AWS CLI configured
3. SSH key pair for accessing the EC2 instance
4. Basic knowledge of Docker and EC2

## Steps

## 1. Launch an EC2 Instance

1. **Log in to the AWS Management Console.**
2. **Navigate to the EC2 Dashboard.**
3. **Launch a new EC2 instance:**
   - Choose an Amazon Machine Image (AMI): **Ubuntu Server 20.04 LTS (HVM)**
   - Choose an Instance Type: **t2.micro** (Free tier eligible)
   - Configure Instance Details: Default settings are fine.
   - Add Storage: Default settings are fine.
   - Add Tags: (Optional)
   - Configure Security Group:
     - Add a rule to allow HTTP traffic on port 80
     - Add a rule to allow SSH traffic on port 22
   - Review and Launch
   - Select your existing key pair or create a new one.

### 2. Connect to Your EC2 Instance

```sh
ssh -i /path/to/your-key-pair.pem ubuntu@your-ec2-public-dns
```
## 3. Install Docker
Update the package list and install prerequisites:
```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```
Add Docker's official GPG key:
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```
Add Docker's stable repository:
```
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
Install Docker:
```
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```
Verify Docker installation:
```
docker --version
```
## 4. Add Your User to the Docker Group
```
sudo usermod -aG docker ${USER}
```
Log out and log back in to apply the changes.
## 5. Deploy the Application
Create a directory for your application:
```
mkdir ~/expense-tracker
cd ~/expense-tracker
```
Create your Dockerfile:
# Dockerfile
```
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```







