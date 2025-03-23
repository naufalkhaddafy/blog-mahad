import { createContext, useContext, useEffect, useState } from 'react';

export type BookmarkProps = {
    slug: string;
    title: string;
    image: string;
};
type BookmarkContextType = {
    bookmarks: BookmarkProps[];
    addBookmark: (newBookmark: BookmarkProps) => void;
    removeBoomark: (slug: string) => void;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
    const getStoredBookmarks = (): BookmarkProps[] => {
        const saved = localStorage.getItem('bookmarks');
        return saved ? JSON.parse(saved) : [];
    };

    const [bookmarks, setBookmarks] = useState<BookmarkProps[]>(getStoredBookmarks());

    useEffect(() => {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const addBookmark = (newBookmark: BookmarkProps) => {
        const stored = getStoredBookmarks();
        if (stored.some((b) => b.slug === newBookmark.slug)) return;
        const updatedBookmarks = [...stored, newBookmark];
        setBookmarks(updatedBookmarks);
    };

    const removeBoomark = (slug: string) => {
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.slug !== slug));
    };

    const value: BookmarkContextType = {
        bookmarks,
        addBookmark,
        removeBoomark,
    };

    return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

const useBookmark = () => {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmark must be used within a BookmarkProvider');
    }
    return context;
};

export default useBookmark;
