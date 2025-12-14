pipeline{
    agent any
    environment{
        IMAGE_NAME = "avvatni/bloggingapplication-app"
        DOCKERHUB_CREDS = credentials('dockerhub-creds-id')
        NODE_ENV = "test"

        MONGO_URI = credentials('MONGO_URL')
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

        stage('Push docker image'){
            steps {
                sh """ 
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                docker push ${IMAGE_NAME}:latest
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