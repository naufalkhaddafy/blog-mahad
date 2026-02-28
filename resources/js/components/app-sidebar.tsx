import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Airplay,
    AudioLines,
    FolderTree,
    LayoutGrid,
    Newspaper,
    Radio,
    Server,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

const Blog: NavItem[] = [
    {
        title: 'Banner',
        url: '/banner',
        icon: Airplay,
    },
    {
        title: 'Postingan',
        url: '/posts',
        icon: Newspaper,
    },
    {
        title: 'Kategori',
        url: '/category',
        icon: FolderTree,
    },
    {
        title: 'Tag',
        url: '/tag',
        icon: Tags,
    },
];

const radioMenu: NavItem[] = [
    {
        title: 'Channel',
        url: '/channels',
        icon: Radio,
    },
    {
        title: 'Live Stream',
        url: '/radio/live-stream',
        icon: AudioLines,
    },
];

const systemMenu: NavItem[] = [
    {
        title: 'Visitor Stats',
        url: '/visitors',
        icon: Activity,
    },
    {
        title: 'System Logs',
        url: '/log',
        icon: Server,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Manajemen User',
        url: '/users',
        icon: Users,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isSuperAdmin = auth.roles?.includes('super-admin');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} title="Platform" />
                <NavMain items={Blog} title="Blog" />
                <NavMain items={radioMenu} title="Radio" />
                <NavMain items={systemMenu.filter((item) => isSuperAdmin || item.url !== '/log')} title="Sistem" />
            </SidebarContent>

            <SidebarFooter>
                {isSuperAdmin && <NavFooter items={footerNavItems} className="mt-auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
