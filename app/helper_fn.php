<?php

use Illuminate\Support\Str;

if (!function_exists('flashMessage')) {
    function flashMessage($title, $message, $type = 'success')
    {
        session()->flash('flash_message', [
            'title' => $title,
            'message' => $message,
            'type' => $type
        ]);
    }
}

if (!function_exists('limitText')) {
    function limitText($text, $limit = 100)
    {
        return Str::limit(strip_tags($text), $limit);
    }
}
