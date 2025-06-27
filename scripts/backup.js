#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

class N8nBackup {
  constructor() {
    this.config = {
      workflowsPath: './workflows',
      credentialsPath: './credentials',
      dataPath: './data',
      backupPath: './backups',
      maxBackups: 10,
      compressBackups: true
    };
  }

  async backup() {
    console.log('💾 Starting n8n backup...');
    
    try {
      this.validatePaths();
      await this.createBackup();
      await this.cleanupOldBackups();
      
      console.log('✅ Backup completed successfully!');
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      process.exit(1);
    }
  }

  validatePaths() {
    console.log('🔍 Validating paths...');
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.config.backupPath)) {
      fs.mkdirSync(this.config.backupPath, { recursive: true });
      console.log(`📁 Created backup directory: ${this.config.backupPath}`);
    }
    
    // Check if source directories exist
    const sourceDirs = [
      this.config.workflowsPath,
      this.config.credentialsPath,
      this.config.dataPath
    ];
    
    sourceDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.warn(`⚠️ Warning: Source directory not found: ${dir}`);
      }
    });
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `n8n-backup-${timestamp}`;
    const backupDir = path.join(this.config.backupPath, backupName);
    
    console.log(`📦 Creating backup: ${backupName}`);
    
    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Copy workflows
    if (fs.existsSync(this.config.workflowsPath)) {
      console.log('📄 Backing up workflows...');
      execSync(`cp -r ${this.config.workflowsPath} ${backupDir}/`);
    }
    
    // Copy credentials
    if (fs.existsSync(this.config.credentialsPath)) {
      console.log('🔐 Backing up credentials...');
      execSync(`cp -r ${this.config.credentialsPath} ${backupDir}/`);
    }
    
    // Copy data (database, etc.)
    if (fs.existsSync(this.config.dataPath)) {
      console.log('💾 Backing up data...');
      execSync(`cp -r ${this.config.dataPath} ${backupDir}/`);
    }
    
    // Create metadata file
    const metadata = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      source: 'n8n-backup-script',
      directories: {
        workflows: fs.existsSync(this.config.workflowsPath),
        credentials: fs.existsSync(this.config.credentialsPath),
        data: fs.existsSync(this.config.dataPath)
      }
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'backup-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    // Compress backup if enabled
    if (this.config.compressBackups) {
      console.log('🗜️ Compressing backup...');
      execSync(`cd ${this.config.backupPath} && tar -czf ${backupName}.tar.gz ${backupName}`);
      execSync(`rm -rf ${backupDir}`);
      console.log(`📦 Compressed backup: ${backupName}.tar.gz`);
    }
    
    console.log(`✅ Backup created: ${backupName}`);
  }

  async cleanupOldBackups() {
    console.log('🧹 Cleaning up old backups...');
    
    const backups = fs.readdirSync(this.config.backupPath)
      .filter(file => {
        const filePath = path.join(this.config.backupPath, file);
        return fs.statSync(filePath).isDirectory() || file.endsWith('.tar.gz');
      })
      .map(file => {
        const filePath = path.join(this.config.backupPath, file);
        return {
          name: file,
          path: filePath,
          mtime: fs.statSync(filePath).mtime
        };
      })
      .sort((a, b) => b.mtime - a.mtime);
    
    // Remove old backups beyond maxBackups limit
    if (backups.length > this.config.maxBackups) {
      const toDelete = backups.slice(this.config.maxBackups);
      
      for (const backup of toDelete) {
        console.log(`🗑️ Removing old backup: ${backup.name}`);
        if (fs.statSync(backup.path).isDirectory()) {
          execSync(`rm -rf "${backup.path}"`);
        } else {
          fs.unlinkSync(backup.path);
        }
      }
      
      console.log(`✅ Removed ${toDelete.length} old backups`);
    }
  }

  async restore(backupName) {
    console.log(`🔄 Restoring from backup: ${backupName}`);
    
    const backupPath = path.join(this.config.backupPath, backupName);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupName}`);
    }
    
    // If it's a compressed backup, extract it first
    let extractPath = backupPath;
    if (backupName.endsWith('.tar.gz')) {
      console.log('📦 Extracting compressed backup...');
      const extractDir = backupPath.replace('.tar.gz', '');
      execSync(`cd ${this.config.backupPath} && tar -xzf ${backupName}`);
      extractPath = extractDir;
    }
    
    // Restore workflows
    const workflowsBackup = path.join(extractPath, 'workflows');
    if (fs.existsSync(workflowsBackup)) {
      console.log('📄 Restoring workflows...');
      if (fs.existsSync(this.config.workflowsPath)) {
        execSync(`rm -rf ${this.config.workflowsPath}`);
      }
      execSync(`cp -r ${workflowsBackup} ${this.config.workflowsPath}`);
    }
    
    // Restore credentials
    const credentialsBackup = path.join(extractPath, 'credentials');
    if (fs.existsSync(credentialsBackup)) {
      console.log('🔐 Restoring credentials...');
      if (fs.existsSync(this.config.credentialsPath)) {
        execSync(`rm -rf ${this.config.credentialsPath}`);
      }
      execSync(`cp -r ${credentialsBackup} ${this.config.credentialsPath}`);
    }
    
    // Restore data
    const dataBackup = path.join(extractPath, 'data');
    if (fs.existsSync(dataBackup)) {
      console.log('💾 Restoring data...');
      if (fs.existsSync(this.config.dataPath)) {
        execSync(`rm -rf ${this.config.dataPath}`);
      }
      execSync(`cp -r ${dataBackup} ${this.config.dataPath}`);
    }
    
    console.log('✅ Restore completed successfully!');
  }

  listBackups() {
    console.log('📋 Available backups:');
    
    const backups = fs.readdirSync(this.config.backupPath)
      .filter(file => {
        const filePath = path.join(this.config.backupPath, file);
        return fs.statSync(filePath).isDirectory() || file.endsWith('.tar.gz');
      })
      .map(file => {
        const filePath = path.join(this.config.backupPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          mtime: stats.mtime
        };
      })
      .sort((a, b) => b.mtime - a.mtime);
    
    backups.forEach((backup, index) => {
      const size = (backup.size / 1024 / 1024).toFixed(2);
      console.log(`${index + 1}. ${backup.name} (${size} MB) - ${backup.mtime.toLocaleString()}`);
    });
  }
}

// Run backup
if (require.main === module) {
  const backup = new N8nBackup();
  const command = process.argv[2];
  
  switch (command) {
    case 'restore':
      const backupName = process.argv[3];
      if (!backupName) {
        console.error('❌ Please specify backup name to restore');
        process.exit(1);
      }
      backup.restore(backupName);
      break;
    case 'list':
      backup.listBackups();
      break;
    default:
      backup.backup();
  }
}

module.exports = N8nBackup; 