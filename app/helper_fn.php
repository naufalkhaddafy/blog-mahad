<?php

use Illuminate\Support\Str;

function flashMessage($title, $message, $type = 'success')
{
    session()->flash('flash_message', [
        'title' => $title,
        'message' => $message,
        'type' => $type
    ]);
}

function limitText($text, $limit = 100)
{
    return Str::limit(strip_tags($text), $limit);
}
