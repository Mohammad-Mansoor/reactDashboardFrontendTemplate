/**
 * HARDWARE SENSING SUBSYSTEM
 * 
 * Handles GPU detection (WebGL), Physical Resolution calculations, 
 * and browser capability sensing with robust fail-safes.
 */

export class HardwareSensing {
  /**
   * Get Physical Screen Resolution (Logic * DPR)
   */
  public static getPhysicalResolution(): { width: number, height: number, density: number } {
    const dpr = window.devicePixelRatio || 1;
    return {
      width: Math.round(window.screen.width * dpr),
      height: Math.round(window.screen.height * dpr),
      density: dpr
    };
  }

  /**
   * Enhanced GPU Detection with robust fallbacks
   */
  public static getGPURenderer(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      // Logic for older browsers or privacy-hardened environments
      return 'Software/Legacy (No WebGL)';
    }

    try {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      
      if (debugInfo) {
        return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }

      // Fallback: Check for vendor-specific traits if debug info is blocked
      const vendor = (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).VENDOR);
      const renderer = (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).RENDERER);
      
      if (vendor || renderer) {
        return `${vendor || 'Unknown Provider'} - ${renderer || 'Generic Renderer'}`;
      }

      return 'Standard WebGL (Identity Masked)';
    } catch (e) {
      return 'WebGL Present (Inaccessible)';
    }
  }

  /**
   * Get Standard Hardware Metrics
   */
  public static getStandardMetrics() {
    return {
      cpuCores: navigator.hardwareConcurrency || 0,
      memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown',
      platform: navigator.platform,
      touchPoints: navigator.maxTouchPoints || 0
    };
  }
}
