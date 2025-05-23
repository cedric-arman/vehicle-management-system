'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { sidebarItems } from '@/navigation/sidebar/sidebar-items';
import Image from 'next/image';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const data = {
  user: {
    name: 'Administrator',
    email: 'admin@example.com',
    avatar: 'https://github.com/shadcn.png',
  },
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-center py-4">
          <Image src="/logo.png" alt="LOGO" width={80} height={80} priority />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
