pipeline {
    agent {
        docker {
            image 'oven/bun:latest'
            args '-v /var/lib/jenkins/.bun-cache:/root/.bun/install/cache'
        }
    }

    environment {
        // Define global environment variables
        NODE_ENV = 'production'
        // Example: Retrieve secrets from Jenkins Credentials
        // SHOPIFY_API_KEY = credentials('shopify-api-key')
        // DB_URL = credentials('database-url')
    }

    options {
        // 'timestamps' is provided by the "Timestamps" plugin
        timestamps()
        
        // 'timeout' is a built-in workflow feature, but often works with plugins
        timeout(time: 1, unit: 'HOURS')
        
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Setup') {
            steps {
                script {
                    echo 'Checking environment...'
                    sh 'bun --version'
                }
                echo 'Installing Project Dependencies...'
                // Install all dependencies for workspace (backend + frontend)
                sh 'bun install --frozen-lockfile'
            }
        }

        stage('Quality Checks') {
            failFast true
            parallel {
                stage('Backend Analysis') {
                    steps {
                        dir('backend-express') {
                            echo 'Running Backend Biome Check (Lint & Format)...'
                            sh 'bun run check'
                            // strict type checking
                            echo 'Running Type Check...'
                            sh 'bun run build' 
                        }
                    }
                }
                stage('Frontend Analysis') {
                    steps {
                        dir('frontend') {
                            echo 'Running Frontend Lint...'
                            sh 'bun run lint'
                        }
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend-express') {
                            echo 'Building Backend for Production...'
                            sh 'bun run build'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            echo 'Building Frontend for Production...'
                            sh 'bun run build'
                        }
                    }
                }
            }
        }

        stage('Prepare Artifacts') {
            steps {
                // Example: archiving the built assets
                // archiveArtifacts artifacts: 'backend-express/dist/**, frontend/dist/**', fingerprint: true, allowEmptyArchive: true
                echo 'Artifacts prepared (skipped archive for now)'
            }
        }

        stage('Deploy') {
            // Only deploy if we are on the main branch
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Production...'
                
                // --- DEPLOYMENT EXAMPLES ---
                
                // Option 1: Docker Build & Push
                // sh 'docker build -t my-app-backend ./backend-express'
                // sh 'docker push myregistry/my-app-backend:latest'

                // Option 2: Serverless / Cloud Provider
                // sh 'bun run deploy:aws' 
                
                // Option 3: SSH Deploy
                // sshagent(['my-ssh-creds']) {
                //    sh 'scp -r ./dist user@server:/var/www/app'
                // }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Pipeline Succeeded!'
            // To use plugins, you generally invoke their specific step command.
            // Example: "Slack Notification Plugin"
            // You must install the plugin in "Manage Jenkins" -> "Plugins" first.
            // slackSend channel: '#deployments', color: 'good', message: "Build Succeeded: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        failure {
            echo '❌ Pipeline Failed!'
            // slackSend channel: '#deployments', color: 'danger', message: "Build Failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        changed {
            echo '⚠️ Pipeline Status Changed'
        }
    }
}
// -------------------------------------------------------------------------
// HOW TO USE PLUGINS IN JENKINSFILE:
// 1. Install the Plugin: Go to "Manage Jenkins" > "Plugins" > "Available Plugins" and install the one you need (e.g., "Slack Notification", "Docker Pipeline", "Credentials Binding").
// 2. Use the Step: Once installed, the plugin adds a new step command (like `slackSend`, `docker`, `withCredentials`) that you can call directly in your `steps {}` block.
// 3. Documentation: Each plugin has a documentation page on plugins.jenkins.io showing its arguments (e.g., `channel:`, `message:`, `credentialsId:`).
// -------------------------------------------------------------------------
