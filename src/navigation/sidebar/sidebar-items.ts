import { LucideIcon, Contact2 } from 'lucide-react';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: 'BSIT',
    items: [{ title: 'BSIT', url: '/dashboard/BSIT', icon: Contact2 }],
  },
  {
    id: 2,
    label: 'BSBA',
    items: [{ title: 'BSBA', url: '/dashboard/BSBA', icon: Contact2 }],
  },
  {
    id: 3,
    label: 'BSA',
    items: [{ title: 'BSA', url: '/dashboard/BSA', icon: Contact2 }],
  },
  {
    id: 4,
    label: 'BEE',
    items: [{ title: 'BEE', url: '/dashboard/BEE', icon: Contact2 }],
  },
  {
    id: 5,
    label: 'BSCRIM',
    items: [{ title: 'BSCRIM', url: '/dashboard/BSCRIM', icon: Contact2 }],
  },
];
