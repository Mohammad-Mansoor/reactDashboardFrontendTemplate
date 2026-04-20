import DeviceDetector from 'device-detector-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import CryptoJS from 'crypto-js';
import { APPLE_PHYSICAL_MAP } from './constants';
import { HardwareSensing } from './hardware';

/**
 * PRODUCTION-GRADE DEVICE INTELLIGENCE ENGINE
 * 
 * Optimized for:
 * 1. Single-pass async initialization (Performance)
 * 2. Physical resolution mapping (Accuracy)
 * 3. Fingerprint obfuscation (Security)
 */

export interface DeviceMetadata {
  fingerprint: string;
  deviceName: string;
  deviceType: string;
  os: string;
  browser: string;
  // Full Hardware (Buffered for login/registration)
  fullHardware: {
    resolution: string;
    gpu: string;
    cpu: number;
    memory: string;
    platform: string;
  };
}

class DeviceIntelligence {
  private static metadata: DeviceMetadata | null = null;
  private static detector = new DeviceDetector();

  /**
   * One-time Async Initialization
   */
  public static async init(): Promise<DeviceMetadata> {
    if (this.metadata) return this.metadata;

    const fpPromise = FingerprintJS.load();
    const ua = navigator.userAgent;
    
    const [fp, result] = await Promise.all([
      fpPromise.then(agent => agent.get()),
      Promise.resolve(this.detector.parse(ua))
    ]);

    const hardware = HardwareSensing.getStandardMetrics();
    const gpu = HardwareSensing.getGPURenderer();
    const physical = HardwareSensing.getPhysicalResolution();
    
    // Security: Obfuscate Fingerprint for transit
    const obfuscatedFingerprint = CryptoJS.SHA256(fp.visitorId).toString();

    this.metadata = {
      fingerprint: obfuscatedFingerprint,
      deviceType: result.device?.type || 'desktop',
      os: `${result.os?.name || 'Unknown'} ${result.os?.version || ''}`.trim(),
      browser: `${result.client?.name || 'Unknown'} ${result.client?.version || ''}`.trim(),
      deviceName: this.inferDeviceName(result, physical, gpu),
      fullHardware: {
        resolution: `${physical.width}x${physical.height} @${physical.density}x`,
        gpu,
        cpu: hardware.cpuCores,
        memory: hardware.memory,
        platform: hardware.platform
      }
    };

    return this.metadata;
  }

  /**
   * Get Cached Metrics (Safe for interceptors)
   */
  public static getCachedMetadata(): DeviceMetadata | null {
    return this.metadata;
  }

  /**
   * Accurate Device Inference
   */
  private static inferDeviceName(result: any, physical: { width: number, height: number, density: number }, gpu: string): string {
    const os = result.os?.name;
    const model = result.device?.model || '';
    const brand = result.device?.brand || '';

    // 1. Apple Resolution Spanning
    if (os === 'iOS' || (os === 'Mac OS' && navigator.maxTouchPoints > 0) || os === 'Mac OS' || os === 'Mac') {
        const resKey = `${physical.width}x${physical.height}`;
        const mapped = APPLE_PHYSICAL_MAP[resKey];
        if (mapped) {
           return gpu.toLowerCase().includes('apple') ? `${mapped} (Silicon)` : mapped;
        }
    }

    // 2. Comprehensive Brand Mapping (Matomo DB)
    if (brand || model) {
      return `${brand} ${model}`.trim();
    }

    // 3. Desktop Fallback
    if (os === 'Windows') return 'Windows PC';
    if (os === 'Linux') return 'Linux Workstation';

    return 'Generic Desktop';
  }
}

export default DeviceIntelligence;
