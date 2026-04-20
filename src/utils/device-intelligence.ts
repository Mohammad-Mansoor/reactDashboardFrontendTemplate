import DeviceDetector from 'device-detector-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * ADVANCED PRODUCTION-GRADE DEVICE INTELLIGENCE SYSTEM (V2.2)
 * 
 * Includes:
 * 1. Apple Resolution Mapping (iPhone/iPad/Mac)
 * 2. High-Entropy Client Hints (Accurate Windows 11 & Brand detection)
 * 3. GPU-based hardware guessing
 */

interface DeviceMetrics {
  fingerprint: string;
  deviceName: string;
  deviceType: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  resolution: string;
  pixelRatio: number;
  viewport: string;
  gpu: string;
  cpuCores: number;
  memory: string;
  platform: string;
  brand: string;
}

const APPLE_HARDWARE_MAP: Record<string, string> = {
  '430x932@3': 'iPhone 15 Pro Max / 14 Pro Max',
  '393x852@3': 'iPhone 15 Pro / 15 / 14 Pro',
  '428x926@3': 'iPhone 14 Plus / 13 Pro Max / 12 Pro Max',
  '390x844@3': 'iPhone 14 / 13 / 13 Pro / 12 / 12 Pro',
  '375x812@3': 'iPhone 13 mini / 12 mini / 11 Pro / XS / X',
  '414x896@3': 'iPhone 11 Pro Max / XS Max',
  '414x896@2': 'iPhone 11 / XR',
  '414x736@3': 'iPhone 8 Plus / 7 Plus / 6s Plus',
  '375x667@2': 'iPhone SE (2nd/3rd gen) / 8 / 7 / 6s',
  '320x568@2': 'iPhone SE (1st gen) / 5s / 5c',
  '1024x1366@2': 'iPad Pro 12.9-inch',
  '834x1194@2': 'iPad Pro 11-inch',
  '834x1112@2': 'iPad Pro 10.5-inch / iPad Air (3rd gen)',
  '820x1180@2': 'iPad Air (4th/5th gen)',
  '810x1080@2': 'iPad (7th/8th/9th gen)',
  '768x1024@2': 'iPad (5th/6th gen) / iPad mini (4th/5th gen)',
  '744x1133@2': 'iPad mini (6th gen)',
  '1728x1117@2': 'MacBook Pro 16-inch (Apple Silicon)',
  '1512x982@2': 'MacBook Pro 14-inch (Apple Silicon)',
  '1440x900@2': 'MacBook Air 13-inch / Pro 13-inch',
  '1280x832@2': 'MacBook Air (M2/M3)',
  '1680x1050@2': 'MacBook Pro 15-inch',
  '2240x1260@2': 'iMac 24-inch (Apple Silicon)',
  '2560x1440@2': 'iMac 27-inch',
};

class DeviceIntelligence {
  private static instance: DeviceMetrics | null = null;
  private static fpPromise = FingerprintJS.load();
  private static detector = new DeviceDetector();

  public static async getMetrics(): Promise<DeviceMetrics> {
    if (this.instance) return this.instance;

    const ua = navigator.userAgent;
    const result = this.detector.parse(ua);
    const fp = await this.fpPromise;
    const fpResult = await fp.get();

    const gpu = this.getGPURenderer();
    const dpr = window.devicePixelRatio || 1;
    const screenRes = `${window.screen.width}x${window.screen.height}`;

    let modelHint = "";
    let platformVersionHint = "";
    let brandHint = "";

    if ((navigator as any).userAgentData) {
      try {
        const highEntropy = await (navigator as any).userAgentData.getHighEntropyValues(['model', 'platformVersion', 'uaFullVersion']);
        modelHint = highEntropy.model || "";
        platformVersionHint = highEntropy.platformVersion || "";
        const brands = (navigator as any).userAgentData.brands;
        brandHint = brands?.find((b: any) => !b.brand.includes('Not') && !b.brand.includes('Brand'))?.brand || "";
      } catch (e) {}
    }

    const metrics: DeviceMetrics = {
      fingerprint: fpResult.visitorId,
      deviceType: result.device?.type || (ua.includes('Mobi') ? 'mobile' : 'desktop'),
      brand: brandHint || result.device?.brand || '',
      os: result.os?.name || 'Unknown OS',
      osVersion: platformVersionHint || result.os?.version || 'Unknown',
      browser: result.client?.name || 'Unknown Browser',
      browserVersion: result.client?.version || 'Unknown',
      resolution: screenRes,
      pixelRatio: dpr,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      gpu: gpu,
      cpuCores: navigator.hardwareConcurrency || 0,
      memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown',
      platform: navigator.platform,
      deviceName: this.generateFriendlyName(result, dpr, gpu, modelHint, platformVersionHint),
    };

    this.instance = metrics;
    return metrics;
  }

  public static init(): Promise<DeviceMetrics> {
    return this.getMetrics();
  }

  public static getCachedMetadata(): DeviceMetrics | null {
    return this.instance;
  }

  private static getGPURenderer(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'Software / No WebGL';
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown GPU';
    } catch (e) {
      return 'Unknown GPU';
    }
  }

  private static generateFriendlyName(result: any, dpr: number, gpu: string, modelHint?: string, platformVersion?: string): string {
    const os = result.os?.name;
    const model = modelHint || result.device?.model || '';
    const brand = result.device?.brand || '';

    if (os === 'iOS' || (os === 'Mac OS' && navigator.maxTouchPoints > 0) || os === 'Mac OS' || os === 'Mac') {
       const resKey = `${window.screen.width}x${window.screen.height}@${Math.round(dpr)}`;
       const mappedModel = APPLE_HARDWARE_MAP[resKey];
       if (mappedModel) {
          if (os.includes('Mac') && gpu.toLowerCase().includes('apple')) return `${mappedModel} (M-Series)`;
          return mappedModel;
       }
    }

    if (os === 'Windows' || navigator.platform.includes('Win')) {
      const isWin11 = platformVersion && parseInt(platformVersion.split('.')[0]) >= 13;
      const baseName = isWin11 ? 'Windows 11 PC' : 'Windows PC';
      
      if (modelHint && modelHint !== "" && !modelHint.includes('PC')) {
        return `${modelHint} (${baseName})`;
      }
      return baseName;
    }

    if ((brand || model) && result.device?.type !== 'desktop') {
      return `${brand} ${model}`.trim();
    }

    if (os === 'Linux') return 'Linux Workstation';
    return `${result.client?.name || 'Unknown Browser'} on ${os || 'Unknown OS'}`;
  }
}

export default DeviceIntelligence;
