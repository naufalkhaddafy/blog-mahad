<?php

namespace App\Enums;

enum PostStatus: string
{
    case PUBLISH = 'publish';
    case ARCHIVED = 'archived';
    case PENDING = 'pending';
}
