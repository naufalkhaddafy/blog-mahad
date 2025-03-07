import { SetStateAction } from 'react';
import Select from 'react-select';
import { twMerge } from 'tailwind-merge';

type MultiSelectProps = {
    options: Array<MultiSelectParams>;
    value: Array<MultiSelectParams>;
    onChange: SetStateAction<any>;
    className?: string;
    placeholder?: string;
};

export type MultiSelectParams = {
    value: string;
    label: string;
};

const customStyles = {
    control: (provided: object) => ({
        ...provided,
        borderRadius: '0.6rem',
        borderColor: '#E5E7EB',
        '&:hover': {
            borderColor: '',
        },
    }),
    option: (provided: object) => ({}),
    multiValue: (provided: object) => ({
        ...provided,
        borderRadius: '0.375rem',
    }),
};

const MultiSelect = ({ options, value, onChange, className, placeholder }: MultiSelectProps) => {
    return (
        <Select
            isMulti
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Pilih...'}
            styles={customStyles}
            classNames={{
                control: () => twMerge('bg-white shadow-xs text-sm px-0.5 text-black rounded-2xl '),
                menu: () => twMerge('bg-black text-black px-1.5'),
                option: ({ isFocused, isSelected }) =>
                    twMerge(
                        'px-3 py-2 rounded-sm cursor-pointer text-sm py-1.5',
                        isFocused && 'bg-accent',
                        isSelected && 'bg-blue-500 text-white',
                    ),
                multiValue: () => twMerge('bg-accent text-md bg-accent'),
            }}
            className={twMerge('w-full py-0.5', className)}
        />
    );
};

export default MultiSelect;
