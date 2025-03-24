export type TagProps = {
    id?: number;
    name: string;
    slug: string;
};

export type TagPropsSelect = {
    value: string;
    label: string;
    slug: string;
} & string[];
