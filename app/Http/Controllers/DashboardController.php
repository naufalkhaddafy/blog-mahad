<?php

namespace App\Http\Controllers;

use App\Enums\ChannelStatus;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Channel;
use App\Models\Post;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $qna =  Category::where('slug', 'tanya-jawab')->first();
        return inertia('dashboard', [
            'posts' => count(Post::all()),
            'banner' => count(Banner::all()),
            'channel' => count(Channel::whereNotIn('status', [ChannelStatus::Unactive])->get()),
            'qna' => count(Post::where('category_id', $qna->id)->where('status', 'pending')->get())
        ]);
    }
}
