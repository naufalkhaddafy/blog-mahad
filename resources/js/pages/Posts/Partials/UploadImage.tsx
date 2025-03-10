import InputError from '@/components/input-error';
import { ImageUp, XIcon } from 'lucide-react';
import { useState } from 'react';

export default function UploadImage({
    setData,
    errors,
    data,
}: {
    setData: any;
    errors: any;
    data: string;
}) {
    const [imagePreview, setImagePreview] = useState<string>(data || '');
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('image', e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    const fileDelete = () => {
        setImagePreview('');
        setData('image', null);
    };

    return (
        <div className="w-full">
            {imagePreview ? (
                <>
                    <div className="relative">
                        <button
                            onClick={fileDelete}
                            className="absolute top-0 right-0 mt-4 mr-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/50 px-2 py-1 text-xs text-white uppercase hover:bg-gray-900/70"
                        >
                            <XIcon className="h-6 w-6 stroke-2" />
                        </button>
                        <img
                            className="mb-4 w-full rounded-lg"
                            width="1280"
                            height="720"
                            src={imagePreview}
                            alt="Preview"
                        />
                    </div>
                    {errors?.image && (
                        <div className="mb-5">
                            <InputError message={errors.image} />
                        </div>
                    )}
                </>
            ) : (
                <label htmlFor="image" className="block">
                    <div className="hover:border-primary-500 flex aspect-16/9 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 transition hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center">
                            <ImageUp className="inline h-6 w-6 stroke-[1.5] text-gray-400" />
                            <div className="my-2 text-sm text-gray-800">Upload image</div>
                            <div className="text-2xl text-gray-500">1280 × 720 (16:9)</div>
                        </div>
                    </div>
                    <input
                        type="file"
                        onChange={onFileChange}
                        name="image"
                        id="image"
                        className="sr-only"
                    />
                </label>
            )}
        </div>
    );
}
