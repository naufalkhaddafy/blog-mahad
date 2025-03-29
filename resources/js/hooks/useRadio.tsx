import { createContext, useContext, useState } from 'react';

export type channelParams = {
    id: number;
    name: string;
    url: string;
    description: string;
    status?: string;
    image: string;
    stats?: {
        name: string;
        listeners: number;
        description: string;
    };
};
type RadioContextType = {
    channel: channelParams;
    onPlay: boolean;
    setChannelPlay: (channelPlay?: channelParams) => void;
};

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider = ({ children }: { children: React.ReactNode }) => {
    const [channel, setChannel] = useState<channelParams | null>();
    const [onPlay, setOnPlay] = useState<boolean>(false);

    const setChannelPlay = (value?: channelParams | null) => {
        setChannel(value);
        setOnPlay(!onPlay);
    };

    const value: RadioContextType = {
        channel: channel ?? {
            id: 0,
            name: '',
            url: '',
            description: '',
            status: '',
            image: '',
            stats: {
                listeners: 0,
                name: '',
                description: '',
            },
        },
        setChannelPlay,
        onPlay,
    };

    return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
};

const useRadio = () => {
    const context = useContext(RadioContext);
    if (!context) {
        throw new Error('useBookmark must be used within a BookmarkProvider');
    }
    return context;
};

export default useRadio;
