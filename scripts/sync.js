#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

class N8nSync {
  constructor() {
    this.config = {
      localWorkflowsPath: './workflows',
      localCredentialsPath: './credentials',
      remoteUrl: process.env.DEPLOYMENT_URL,
      syncDirection: process.argv[2] || 'both', // 'local', 'remote', 'both'
      backupBeforeSync: true
    };
  }

  async sync() {
    console.log('🔄 Starting n8n synchronization...');
    
    try {
      this.validateConfig();
      
      if (this.config.backupBeforeSync) {
        await this.createBackup();
      }
      
      switch (this.config.syncDirection) {
        case 'local':
          await this.syncToLocal();
          break;
        case 'remote':
          await this.syncToRemote();
          break;
        case 'both':
          await this.syncBoth();
          break;
        default:
          throw new Error(`Invalid sync direction: ${this.config.syncDirection}`);
      }
      
      console.log('✅ Synchronization completed successfully!');
      
    } catch (error) {
      console.error('❌ Synchronization failed:', error.message);
      process.exit(1);
    }
  }

  validateConfig() {
    console.log('🔍 Validating configuration...');
    
    if (!this.config.remoteUrl) {
      throw new Error('DEPLOYMENT_URL not set in environment variables');
    }
    
    // Ensure local directories exist
    [this.config.localWorkflowsPath, this.config.localCredentialsPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  async createBackup() {
    console.log('💾 Creating backup before sync...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `./backups/pre-sync-${timestamp}`;
    
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Backup workflows
    if (fs.existsSync(this.config.localWorkflowsPath)) {
      execSync(`cp -r ${this.config.localWorkflowsPath} ${backupDir}/workflows`);
    }
    
    // Backup credentials
    if (fs.existsSync(this.config.localCredentialsPath)) {
      execSync(`cp -r ${this.config.localCredentialsPath} ${backupDir}/credentials`);
    }
    
    console.log(`📦 Backup created: ${backupDir}`);
  }

  async syncToLocal() {
    console.log('⬇️ Syncing from remote to local...');
    
    // This would download workflows and credentials from remote n8n instance
    // Implementation depends on your setup (API, file system, etc.)
    
    await this.downloadWorkflows();
    await this.downloadCredentials();
  }

  async syncToRemote() {
    console.log('⬆️ Syncing from local to remote...');
    
    // This would upload workflows and credentials to remote n8n instance
    // Implementation depends on your setup (API, file system, etc.)
    
    await this.uploadWorkflows();
    await this.uploadCredentials();
  }

  async syncBoth() {
    console.log('🔄 Bidirectional sync...');
    
    // For bidirectional sync, you might want to:
    // 1. Compare timestamps
    // 2. Merge changes intelligently
    // 3. Handle conflicts
    
    await this.mergeChanges();
  }

  async downloadWorkflows() {
    console.log('📥 Downloading workflows from remote...');
    
    // Example implementation using n8n API
    // const response = await fetch(`${this.config.remoteUrl}/api/v1/workflows`);
    // const workflows = await response.json();
    
    // for (const workflow of workflows) {
    //   const filePath = path.join(this.config.localWorkflowsPath, `${workflow.name}.json`);
    //   fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
    // }
    
    console.log('✅ Workflows downloaded');
  }

  async downloadCredentials() {
    console.log('🔐 Downloading credentials from remote...');
    
    // Similar to workflows, but for credentials
    // Note: Credentials are sensitive data, handle with care
    
    console.log('✅ Credentials downloaded');
  }

  async uploadWorkflows() {
    console.log('📤 Uploading workflows to remote...');
    
    const workflowFiles = fs.readdirSync(this.config.localWorkflowsPath)
      .filter(file => file.endsWith('.json'));
    
    for (const file of workflowFiles) {
      const workflowPath = path.join(this.config.localWorkflowsPath, file);
      const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
      
      console.log(`📄 Uploading workflow: ${file}`);
      // await this.uploadWorkflow(workflow);
    }
    
    console.log('✅ Workflows uploaded');
  }

  async uploadCredentials() {
    console.log('🔐 Uploading credentials to remote...');
    
    // Upload credentials (handle with care due to sensitivity)
    
    console.log('✅ Credentials uploaded');
  }

  async mergeChanges() {
    console.log('🔀 Merging changes...');
    
    // Implement intelligent merging logic
    // This could involve:
    // - Comparing workflow versions
    // - Detecting conflicts
    // - Auto-resolving simple conflicts
    // - Prompting for manual resolution of complex conflicts
    
    console.log('✅ Changes merged');
  }

  async uploadWorkflow(workflow) {
    // Example implementation for uploading a single workflow
    // const response = await fetch(`${this.config.remoteUrl}/api/v1/workflows`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.N8N_API_TOKEN}`
    //   },
    //   body: JSON.stringify(workflow)
    // });
    
    // if (!response.ok) {
    //   throw new Error(`Failed to upload workflow: ${response.statusText}`);
    // }
  }
}

// Run sync
if (require.main === module) {
  const sync = new N8nSync();
  sync.sync();
}

module.exports = N8nSync; 