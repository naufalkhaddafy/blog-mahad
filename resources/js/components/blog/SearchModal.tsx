import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Link, router } from '@inertiajs/react';
import { BookOpen, Loader2, Radio, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchResult {
    title: string;
    slug: string;
    imageSrc: string | null;
    category: string | null;
    created_at: string;
}

export const SearchModal = ({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [open]);

    const fetchResults = useCallback((q: string) => {
        if (q.length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(q)}`)
            .then((res) => res.json())
            .then((data) => setResults(data))
            .catch(() => setResults([]))
            .finally(() => setIsLoading(false));
    }, []);

    const handleChange = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchResults(value), 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onOpenChange(false);
            router.get('/belajar-islam', { search: query.trim() });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg [&>button]:hidden">
                <DialogTitle className="sr-only">Pencarian</DialogTitle>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="flex items-center border-b px-4">
                    <Search className="text-muted-foreground h-5 w-5 shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Cari kajian, artikel, audio..."
                        className="flex-1 border-0 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-gray-400"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setResults([]);
                                inputRef.current?.focus();
                            }}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                        </div>
                    )}

                    {!isLoading && query.length >= 2 && results.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                            Tidak ditemukan hasil untuk "<span className="font-medium">{query}</span>"
                        </div>
                    )}

                    {!isLoading && results.length > 0 && (
                        <div className="py-2">
                            <p className="px-4 pb-2 text-xs font-medium text-gray-400 uppercase">Hasil Pencarian</p>
                            {results.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/${item.slug}`}
                                    onClick={() => onOpenChange(false)}
                                    className="hover:bg-accent flex items-center gap-3 px-4 py-2.5 transition-colors"
                                >
                                    {item.imageSrc ? (
                                        <img
                                            src={item.imageSrc}
                                            alt={item.title}
                                            className="h-10 w-14 shrink-0 rounded-md object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                                            <Search className="h-4 w-4 text-green-600" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{item.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.category && <span>{item.category} · </span>}
                                            {item.created_at}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Quick Links */}
                    <div className="border-t px-4 py-3">
                        <p className="pb-2 text-xs font-medium text-gray-400 uppercase">Akses Cepat</p>
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/radio-online"
                                onClick={() => onOpenChange(false)}
                                className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20 dark:hover:border-green-800"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <Radio className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Radio</p>
                                    <p className="text-[10px] text-gray-500">Streaming</p>
                                </div>
                            </Link>
                            <Link
                                href="/al-quran"
                                onClick={() => onOpenChange(false)}
                                className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20 dark:hover:border-green-800"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                    <BookOpen className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Al-Quran</p>
                                    <p className="text-[10px] text-gray-500">Tanpa Iklan</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
