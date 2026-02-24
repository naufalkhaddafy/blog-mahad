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

        // Period filter (1d, 7d, 30d, 365d)
        $period = $request->input('period', '7d');
        $periodDays = match ($period) {
            '1d' => 0,
            '30d' => 30,
            '365d' => 365,
            default => 7,
        };
        $periodStart = Carbon::now()->subDays($periodDays)->toDateString();

        $visitsToday = PageVisit::where('visited_date', $today)->count();
        $visitsWeek = PageVisit::where('visited_date', '>=', $weekAgo)->count();
        $visitsTotal = PageVisit::count();

        // Top 5 halaman paling banyak dikunjungi (berdasarkan period)
        $topPages = PageVisit::where('visited_date', '>=', $periodStart)
            ->selectRaw('url, count(*) as total_views')
            ->groupBy('url')
            ->orderByDesc('total_views')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $parsed = parse_url($item->url);
                $item->path = $parsed['path'] ?? '/';
                return $item;
            });

        // Data kunjungan untuk chart (berdasarkan period)
        $dailyVisits = PageVisit::where('visited_date', '>=', $periodStart)
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
            'period' => $period,
        ]);
    }
}
