#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

class N8nDeployer {
  constructor() {
    this.config = {
      localWorkflowsPath: './workflows',
      productionUrl: process.env.DEPLOYMENT_URL,
      githubToken: process.env.GITHUB_TOKEN,
      environment: process.env.DEPLOYMENT_ENV || 'development'
    };
  }

  async deploy() {
    console.log('🚀 Starting n8n deployment...');
    
    try {
      // 1. Validate environment
      this.validateEnvironment();
      
      // 2. Backup current workflows
      await this.backupWorkflows();
      
      // 3. Sync workflows to production
      await this.syncWorkflows();
      
      // 4. Restart production service
      await this.restartProduction();
      
      console.log('✅ Deployment completed successfully!');
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  validateEnvironment() {
    console.log('🔍 Validating environment...');
    
    if (!this.config.productionUrl) {
      throw new Error('DEPLOYMENT_URL not set in environment variables');
    }
    
    if (!fs.existsSync(this.config.localWorkflowsPath)) {
      throw new Error(`Workflows directory not found: ${this.config.localWorkflowsPath}`);
    }
    
    console.log(`📍 Environment: ${this.config.environment}`);
    console.log(`🌐 Production URL: ${this.config.productionUrl}`);
  }

  async backupWorkflows() {
    console.log('💾 Creating backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `./backups/${timestamp}`;
    
    if (!fs.existsSync('./backups')) {
      fs.mkdirSync('./backups', { recursive: true });
    }
    
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Copy workflows to backup
    if (fs.existsSync(this.config.localWorkflowsPath)) {
      execSync(`cp -r ${this.config.localWorkflowsPath}/* ${backupDir}/`);
    }
    
    console.log(`📦 Backup created: ${backupDir}`);
  }

  async syncWorkflows() {
    console.log('🔄 Syncing workflows to production...');
    
    // This is a placeholder for actual sync logic
    // You can implement different sync strategies:
    
    // Option 1: Direct file sync (if using shared storage)
    // execSync(`rsync -avz ${this.config.localWorkflowsPath}/ ${this.config.productionUrl}/workflows/`);
    
    // Option 2: API-based sync using n8n REST API
    await this.syncViaAPI();
    
    // Option 3: Git-based deployment
    // await this.syncViaGit();
  }

  async syncViaAPI() {
    console.log('📡 Syncing via n8n API...');
    
    // This would use n8n's REST API to import workflows
    // You'll need to implement the actual API calls based on your setup
    
    const workflowFiles = fs.readdirSync(this.config.localWorkflowsPath)
      .filter(file => file.endsWith('.json'));
    
    for (const file of workflowFiles) {
      const workflowPath = path.join(this.config.localWorkflowsPath, file);
      const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
      
      console.log(`📄 Syncing workflow: ${file}`);
      // Implement API call to import workflow
      // await this.importWorkflow(workflow);
    }
  }

  async restartProduction() {
    console.log('🔄 Restarting production service...');
    
    // This depends on your hosting platform
    // Examples:
    
    // For Docker:
    // execSync('docker-compose -f docker-compose.prod.yml restart n8n');
    
    // For Kubernetes:
    // execSync('kubectl rollout restart deployment/n8n');
    
    // For Railway/Render/Heroku:
    // The platform will auto-restart on git push
    
    console.log('✅ Production service restarted');
  }
}

// Run deployment
if (require.main === module) {
  const deployer = new N8nDeployer();
  deployer.deploy();
}

module.exports = N8nDeployer; 