/**
 * APPLE PHYSICAL HARDWARE REPOSITORY
 * 
 * Maps Physical Resolutions (Logical Width * DPR x Logical Height * DPR) 
 * to human-readable device groups to avoid ambiguous misidentification.
 */

export const APPLE_PHYSICAL_MAP: Record<string, string> = {
  // iPhone Models (Physical Resolution)
  '1290x2796': 'iPhone Pro Max (14/15 series)',
  '1179x2556': 'iPhone Pro/Base (14/15 series)',
  '1284x2778': 'iPhone Pro Max/Plus (12/13/14 series)',
  '1170x2532': 'iPhone Pro/Base (12/13/14 series)',
  '1125x2436': 'iPhone Pro/mini (X/XS/11Pro/12mini/13mini)',
  '1242x2688': 'iPhone Pro Max/Plus (XS/11 series)',
  '828x1792': 'iPhone Base (11/XR series)',
  '1242x2208': 'iPhone Plus (6/7/8 series)',
  '750x1334': 'iPhone Base (6/7/8/SE series)',
  '640x1136': 'iPhone SE/5 series',

  // iPad Models (Physical Resolution)
  '2048x2732': 'iPad Pro (12.9-inch)',
  '1668x2388': 'iPad Pro (11-inch)',
  '1668x2224': 'iPad Pro (10.5-inch) / Air (3rd gen)',
  '1640x2360': 'iPad Air (4/5 series)',
  '1620x2160': 'iPad Base (7/8/9 series)',
  '1536x2048': 'iPad Base/mini (5/6 gen)',
  '1488x2266': 'iPad mini (6th gen)',

  // MacBook / iMac Profiles
  '3456x2234': 'MacBook Pro (16-inch, Silicon)',
  '3024x1964': 'MacBook Pro (14-inch, Silicon)',
  '2560x1664': 'MacBook Air (13-inch, M2/M3)',
  '2880x1800': 'MacBook Pro (15-inch, Retina)',
  '4480x2520': 'iMac (24-inch, Silicon)',
  '5120x2880': 'iMac (27-inch, 5K)',
};

export const ESSENTIAL_HEADERS = [
  'x-device-name',
  'x-device-type',
  'x-os',
  'x-browser',
  'x-fingerprint',
];
