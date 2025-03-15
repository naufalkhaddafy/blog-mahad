import { PostProps } from '@/pages/Posts/Partials/Type';
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share';

const SocialMediaShare = ({ post }: { post: PostProps }) => {
    const shareUrl = window.location.href;
    return (
        <div className="flex items-center gap-1">
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

            <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon className="size-5 rounded hover:brightness-75 lg:size-7" />
            </LinkedinShareButton>
        </div>
    );
};

export default SocialMediaShare;
