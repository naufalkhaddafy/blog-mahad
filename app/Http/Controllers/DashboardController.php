<?php

namespace App\Http\Controllers;

use App\Enums\ChannelStatus;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Channel;
use App\Models\PageVisit;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $qna = Category::where('slug', 'tanya-jawab')->first();

        // Page Visit Statistics
        $today = Carbon::today()->toDateString();
        $weekAgo = Carbon::now()->subDays(7)->toDateString();

        $visitsToday = PageVisit::where('visited_date', $today)->count();
        $visitsWeek = PageVisit::where('visited_date', '>=', $weekAgo)->count();
        $visitsTotal = PageVisit::count();

        // Top 5 halaman paling banyak dikunjungi (7 hari terakhir)
        $topPages = PageVisit::where('visited_date', '>=', $weekAgo)
            ->selectRaw('url, count(*) as total_views')
            ->groupBy('url')
            ->orderByDesc('total_views')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                // Ambil path saja dari full URL agar lebih ringkas
                $parsed = parse_url($item->url);
                $item->path = $parsed['path'] ?? '/';
                return $item;
            });

        // Data kunjungan 7 hari terakhir untuk chart
        $dailyVisits = PageVisit::where('visited_date', '>=', $weekAgo)
            ->selectRaw('visited_date, count(*) as total_views')
            ->groupBy('visited_date')
            ->orderBy('visited_date')
            ->get();

        return inertia('dashboard', [
            'posts' => count(Post::all()),
            'banner' => count(Banner::all()),
            'channel' => count(Channel::whereNotIn('status', [ChannelStatus::Unactive])->get()),
            'qna' => count(Post::where('category_id', $qna->id)->where('status', 'pending')->get()),
            'visitsToday' => $visitsToday,
            'visitsWeek' => $visitsWeek,
            'visitsTotal' => $visitsTotal,
            'topPages' => $topPages,
            'dailyVisits' => $dailyVisits,
        ]);
    }
}
