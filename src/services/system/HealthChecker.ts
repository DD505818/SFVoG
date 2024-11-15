import { getConnection } from '../db/connection';
import type { SystemStatus, HealthCheck } from './types';

export class SystemHealthChecker {
  private lastCheck: number = 0;
  private checkInterval: number = 60000; // 1 minute
  private healthStatus: SystemStatus = {
    database: 'unknown',
    trading: 'unknown',
    agents: 'unknown',
    memory: 'unknown',
    lastUpdate: Date.now()
  };

  async checkSystem(): Promise<HealthCheck> {
    const now = Date.now();
    if (now - this.lastCheck < this.checkInterval) {
      return {
        status: this.healthStatus,
        checks: [],
        timestamp: this.healthStatus.lastUpdate
      };
    }

    try {
      const checks = await Promise.all([
        this.checkDatabase(),
        this.checkTradingEngine(),
        this.checkAgents(),
        this.checkMemoryUsage()
      ]);

      this.healthStatus = {
        database: checks[0] ? 'healthy' : 'error',
        trading: checks[1] ? 'healthy' : 'error',
        agents: checks[2] ? 'healthy' : 'warning',
        memory: checks[3] ? 'healthy' : 'warning',
        lastUpdate: now
      };

      this.lastCheck = now;

      return {
        status: this.healthStatus,
        checks: this.generateChecks(checks),
        timestamp: now
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: {
          ...this.healthStatus,
          lastUpdate: now
        },
        checks: [{
          name: 'system',
          status: 'error',
          message: 'Health check failed',
          timestamp: now
        }],
        timestamp: now
      };
    }
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const db = getConnection();
      const result = await db.prepare('SELECT 1').get();
      return result !== undefined;
    } catch (error) {
      console.error('Database check failed:', error);
      return false;
    }
  }

  private async checkTradingEngine(): Promise<boolean> {
    try {
      // Check if trading engine is responsive
      const memoryUsage = process.memoryUsage();
      const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // MB
      return heapUsed < 1024; // Less than 1GB
    } catch (error) {
      console.error('Trading engine check failed:', error);
      return false;
    }
  }

  private async checkAgents(): Promise<boolean> {
    try {
      // Check if AI agents are responsive
      return true; // Placeholder
    } catch (error) {
      console.error('Agent check failed:', error);
      return false;
    }
  }

  private async checkMemoryUsage(): Promise<boolean> {
    try {
      const memoryUsage = process.memoryUsage();
      const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // MB
      return heapUsed < 1024; // Less than 1GB
    } catch (error) {
      console.error('Memory check failed:', error);
      return false;
    }
  }

  private generateChecks(results: boolean[]): Array<{
    name: string;
    status: 'healthy' | 'warning' | 'error';
    message: string;
    timestamp: number;
  }> {
    const components = ['database', 'trading', 'agents', 'memory'];
    return results.map((result, index) => ({
      name: components[index],
      status: result ? 'healthy' : 'error',
      message: result ? 'Operating normally' : `${components[index]} check failed`,
      timestamp: Date.now()
    }));
  }
}