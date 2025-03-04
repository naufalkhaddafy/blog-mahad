<?php

namespace App\Enums\PostType;

enum PostType: string
{
    case POSTER = 'poster';
    case ARTICLE = 'article';
    case QNA = 'qna';
}
