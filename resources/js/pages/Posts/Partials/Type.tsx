import { TagProps } from '@/pages/Tags/Partials/Type';

export type PostForm = {
    user_id: number;
    category: number;
    title: string;
    description: string;
    image: string;
    slug: string;
    status: string;
    tags: Array<TagProps>;
};

export type PostProps = {
    id: number;
    user_id: number;
    category: number;
    title: string;
    description: string;
    image: string;
    slug: string;
    status: string;
    tags: Array<TagProps>;
};
