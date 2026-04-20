import { MenuItem } from "../constants/menuConfig";

/**
 * Checks if a path or any of its children match the current pathname
 */
export const isChildActive = (item: MenuItem, pathname: string): boolean => {
  if (item.path && pathname === item.path) return true;
  if (item.children) {
    return item.children.some((child) => isChildActive(child, pathname));
  }
  return false;
};

/**
 * Returns a list of parent IDs that should be open for a given pathname
 */
export const getActiveParentIds = (items: MenuItem[], pathname: string): string[] => {
  const activeIds: string[] = [];

  const findActive = (item: MenuItem, parents: string[]): boolean => {
    if (item.path && pathname === item.path) {
      activeIds.push(...parents);
      return true;
    }
    if (item.children) {
      return item.children.some((child) => findActive(child, [...parents, item.id]));
    }
    return false;
  };

  items.forEach((item) => findActive(item, []));
  return Array.from(new Set(activeIds));
};

/**
 * Filters menu items based on permissions
 */
export const filterMenuItems = (items: MenuItem[], permissions: any): MenuItem[] => {
  return items
    .filter((item) => {
      if (!item.permissions || item.permissions.length === 0) return true;
      // Simple logic: user must have ALL listed permissions
      // Assuming permissions structure like: { resource: { action: true } }
      return item.permissions.every((p) => {
        const [resource, action] = p.split(":");
        return permissions[resource]?.[action];
      });
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuItems(item.children, permissions) : undefined,
    }));
};
