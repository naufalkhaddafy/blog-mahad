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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Airplay, AudioLines, FolderTree, LayoutGrid, Newspaper, Radio, Tags } from 'lucide-react';
import AppLogo from './app-logo';

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
        url: '',
        icon: Radio,
    },
    {
        title: 'Live Stream',
        url: '',
        icon: AudioLines,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         url: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         url: 'https://laravel.com/docs/starter-kits',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
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
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
