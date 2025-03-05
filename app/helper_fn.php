<?php

function flashMessage($title, $message, $type = 'success')
{
    session()->flash('flash_message', [
        'title' => $title,
        'message' => $message,
        'type' => $type
    ]);
}
