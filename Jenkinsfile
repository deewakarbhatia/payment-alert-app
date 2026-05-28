pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  environment {
    DOCKER_HUB = 'deewakarbhatia'
    IMAGE_BACKEND = "${DOCKER_HUB}/payment-backend"
    IMAGE_FRONTEND = "${DOCKER_HUB}/payment-frontend"
  }

  stages {

    stage('Checkout') {
      steps {
        echo 'Checking out code from GitHub...'
        checkout scm
      }
    }



    stage('Docker Build') {
      steps {
        echo 'Building Docker images...'
        sh "docker build -t ${IMAGE_BACKEND}:latest ./backend"
        sh "docker build -t ${IMAGE_FRONTEND}:latest ./frontend"
      }
    }

    stage('Docker Push') {
      steps {
        echo 'Pushing images to Docker Hub...'
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'USER',
          passwordVariable: 'PASS'
        )]) {
          sh "echo $PASS | docker login -u $USER --password-stdin"
          sh "docker push ${IMAGE_BACKEND}:latest"
          sh "docker push ${IMAGE_FRONTEND}:latest"
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying application...'
        // Deployment via docker-compose skipped in Jenkins container to avoid Windows host path conflicts.
        // In a real production environment, this would trigger a Kubernetes deployment or remote SSH script.
        echo 'Deployment simulated successfully!'
      }
    }

  }

  post {
    success {
      echo '✅ Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed!'
    }
  }
}