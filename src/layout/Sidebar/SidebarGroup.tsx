import React from "react";
import { MenuItem } from "../../constants/menuConfig";
import SidebarItem from "./SidebarItem";

interface SidebarGroupProps {
  items: MenuItem[];
  depth?: number;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ items, depth = 0 }) => {
  return (
    <ul className={`mt-1 space-y-0.5`}>
      {items.map((item) => (
        <SidebarItem key={item.id} item={item} depth={depth} />
      ))}
    </ul>
  );
};

export default SidebarGroup;
