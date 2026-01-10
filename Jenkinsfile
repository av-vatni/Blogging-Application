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
                    sh """
                    echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                    docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                set -e

                NAMESPACE=blogify-dev
                APP_NAME=blogify-app
                IMAGE=${IMAGE_NAME}:${BUILD_NUMBER}

                echo "▶ Ensuring namespace exists"
                kubectl get ns \$NAMESPACE || kubectl create ns \$NAMESPACE

                echo "▶ Applying secrets"
                kubectl apply -f k8s/secrets.yml -n \$NAMESPACE

                echo "▶ Deploying MongoDB"
                kubectl apply -f k8s/mongo-deployment.yml -n \$NAMESPACE

                echo "▶ Deploying application"
                kubectl apply -f k8s/app-deployment.yml -n \$NAMESPACE
                kubectl apply -f k8s/app-service.yml -n \$NAMESPACE

                echo "▶ Updating image"
                kubectl set image deployment/\$APP_NAME \\
                \$APP_NAME=\$IMAGE \\
                -n \$NAMESPACE

                echo "▶ Waiting for rollout"
                kubectl rollout status deployment/\$APP_NAME -n \$NAMESPACE --timeout=5m
                """
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