pipeline{
    agent any

    tools {
        nodejs 'node20'
    }

    environment{
        IMAGE_NAME = "avvatni/bloggingapplication-app"
        DOCKERHUB_CREDS = credentials('dockerhub-creds-id')
        NODE_ENV = "test"

        MONGO_URL = credentials('MONGO_URL')
        JWT_SECRET = credentials('jwt-secret-id')
    }
    stages{
        stage('Checkout'){
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies'){
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests'){
            steps {
                sh 'npm test'
            }
        }

        stage('Build docker image'){
            steps {
                sh """
                docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Push docker image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds-id',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
        )]) {
            sh '''
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
              docker push avvatni/bloggingapplication-app:${BUILD_NUMBER}
              docker push avvatni/bloggingapplication-app:latest
            '''
        }
    }
}

    }
    post {
        always {
            sh 'docker logout || true'
            sh 'docker image prune -f || true'
        }
        success {
            echo "CI pipeline completed successfully"
        }
        failure {
            echo "CI pipeline failed"
        }
    }
}