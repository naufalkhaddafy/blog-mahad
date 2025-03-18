// import { SetStateAction } from 'react';
// import Select from 'react-select';
// import { twMerge } from 'tailwind-merge';

// type MultiSelectProps = {
//     options: Array<MultiSelectParams>;
//     value: Array<MultiSelectParams>;
//     onChange: SetStateAction<any>;
//     className?: string;
//     placeholder?: string;
// } & Record<string, any>;

// export type MultiSelectParams = {
//     value: number;
//     label: string;
// };

// const customStyles = {
//     control: (provided: object) => ({
//         ...provided,
//         borderRadius: '0.6rem',
//         borderColor: '#E5E7EB',
//         '&:hover': {
//             borderColor: '',
//         },
//     }),
//     option: (provided: object) => ({}),
//     multiValue: (provided: object) => ({
//         ...provided,
//         borderRadius: '0.375rem',
//     }),
// };

// const MultiSelect = ({
//     options,
//     value,
//     onChange,
//     className,
//     placeholder,
//     ...props
// }: MultiSelectProps) => {
//     return (
//         <Select
//             {...props}
//             options={options}
//             value={value}
//             onChange={onChange}
//             placeholder={placeholder || 'Pilih...'}
//             styles={customStyles}
//             classNames={{
//                 control: () =>
//                     twMerge(
//                         'bg-transparent shadow-xs text-sm px-0.5 text-black rounded-2xl dark:bg-transparent',
//                     ),
//                 menu: () => twMerge('bg-transparent text-black px-1.5 dark:bg-black'),
//                 option: ({ isFocused, isSelected }) =>
//                     twMerge(
//                         'px-3 py-2 rounded-sm cursor-pointer text-sm py-1.5 dark:hover:text-white',
//                         isFocused && 'bg-accent',
//                         isSelected && 'bg-accent ',
//                     ),
//                 multiValue: () => twMerge('bg-accent text-md bg-accent'),
//             }}
//             className={twMerge('w-full', className)}
//         ></Select>
//     );
// };

// export default MultiSelect;
