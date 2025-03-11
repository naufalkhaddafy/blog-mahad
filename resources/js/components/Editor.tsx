import JoditEditor from 'jodit-react';
import { useRef } from 'react';

const config = {
    height: 600,
    saveModeInStorage: false,
    uploader: { insertImageAsBase64URI: true },
};

const Editor = ({
    content,
    setContent,
}: {
    content?: string;
    setContent: (value: string) => void;
}) => {
    const editor = useRef(null);

    return (
        <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
            // onChange={(newContent) => setContent(newContent)}
        />
    );
};

export default Editor;
