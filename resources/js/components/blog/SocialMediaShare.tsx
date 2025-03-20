import { PostProps } from '@/pages/Posts/Partials/Type';
import { CopyCheck, Link } from 'lucide-react';
import { useState } from 'react';
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share';

const SocialMediaShare = ({ post }: { post: PostProps }) => {
    const shareUrl = window.location.href;
    const [copy, setCopy] = useState<boolean>(false);
    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 3000);
    };
    return (
        <div className="flex items-center gap-2">
            <TelegramShareButton url={shareUrl} title={post.title}>
                <TelegramIcon className="size-5 rounded hover:brightness-75 lg:size-7" />
            </TelegramShareButton>

            <WhatsappShareButton url={shareUrl} title={post.title}>
                <WhatsappIcon className="size-5 rounded hover:brightness-75 lg:size-7" />
            </WhatsappShareButton>

            <FacebookShareButton url={shareUrl}>
                <FacebookIcon className="size-5 rounded hover:brightness-75 lg:size-7" />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={post.title}>
                <XIcon className="size-5 rounded hover:brightness-75 lg:size-7" />
            </TwitterShareButton>

            {copy === false ? (
                <span className="transition duration-900 ease-in-out">
                    <button
                        type="button"
                        className="text-primary-foreground focus-visible:ring-ring/50 hover:bg-primary/80 bg-primary flex items-center gap-1 rounded p-1 shadow-sm focus-visible:ring-2 focus-visible:outline-none"
                        onClick={copyLink}
                    >
                        <Link className="size-3 lg:size-5" />
                    </button>
                </span>
            ) : (
                <span className="flex items-center gap-1 text-sm transition-all duration-500 ease-out">
                    <CopyCheck className="size-3" />
                    copied
                </span>
            )}
        </div>
    );
};

export default SocialMediaShare;
