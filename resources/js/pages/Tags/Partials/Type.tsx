export type TagProps = {
    id?: number;
    name: string;
};

export type TagPropsSelect = {
    value: string;
    label: string;
} & string[];
