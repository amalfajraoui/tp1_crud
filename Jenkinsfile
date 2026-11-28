pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t tp1-crud-backend:jenkins ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t tp1-crud-frontend:jenkins ./frontend'
            }
        }
    }

    post {
        success {
            echo 'CI/CD Jenkins: Build termine avec succes!'
        }

        failure {
            echo 'Erreur pendant le Pipeline Jenkins.'
        }
    }
}
