import { TagProps, TagPropsSelect } from '@/pages/Tags/Partials/Type';

export type PostForm = {
    user_id: number;
    title: string;
    description: string;
    image: string;
    slug: string;
    status: string;
    tags?: Array<TagProps>;
};

export type PageSettingsProps = {
    title: string;
    description: string;
    url: string;
    method: string;
};

export type PostProps = {
    id?: number;
    user?: {
        id: number;
        name: string;
    };
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    title: string;
    description: string;
    image: string;
    imageSrc: string;
    slug: string;
    status: string;
    created_at: string;
    views: number;
    tags: Array<TagPropsSelect>;
};
