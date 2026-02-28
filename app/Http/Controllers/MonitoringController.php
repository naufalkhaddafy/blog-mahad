<?php

namespace App\Http\Controllers;

use App\Models\PageVisit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class MonitoringController extends Controller
{
    public function visitors(Request $request)
    {
        $today = Carbon::today()->toDateString();
        $startDate = $request->input('start_date', Carbon::now()->subDays(14)->toDateString());
        $endDate = $request->input('end_date', $today);
        
        $totalPageVisits = PageVisit::count();
        $todayPageVisits = PageVisit::where('visited_date', $today)->count();
        
        // Unique visitors today (by session_id)
        $todayUniqueVisitors = PageVisit::where('visited_date', $today)
                                        ->distinct('session_id')
                                        ->count('session_id');

        $totalUniqueVisitors = PageVisit::distinct('session_id')->count('session_id');

        // Stats for chart / Daily Visits
        $dailyVisitsQuery = PageVisit::selectRaw('visited_date, count(*) as total_views');
        
        if ($startDate) {
            $dailyVisitsQuery->where('visited_date', '>=', $startDate);
        }
        if ($endDate) {
            $dailyVisitsQuery->where('visited_date', '<=', $endDate);
        }
            
        $dailyVisits = $dailyVisitsQuery->groupBy('visited_date')
            ->orderBy('visited_date', 'asc')
            ->get();

        // Top 5 halaman paling banyak dikunjungi
        $topPagesQuery = PageVisit::selectRaw('url, count(*) as total_views');
        
        if ($startDate) {
            $topPagesQuery->where('visited_date', '>=', $startDate);
        }
        if ($endDate) {
            $topPagesQuery->where('visited_date', '<=', $endDate);
        }

        $topPages = $topPagesQuery->groupBy('url')
            ->orderByDesc('total_views')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                $parsed = parse_url($item->url);
                $item->path = $parsed['path'] ?? '/';
                return $item;
            });
        $visitorStatsQuery = PageVisit::selectRaw('visited_date, count(DISTINCT session_id) as visitors, count(*) as page_views');
        
        if ($startDate) {
            $visitorStatsQuery->where('visited_date', '>=', $startDate);
        }
        if ($endDate) {
            $visitorStatsQuery->where('visited_date', '<=', $endDate);
        }
            
        $visitorStats = $visitorStatsQuery->groupBy('visited_date')
            ->orderBy('visited_date', 'asc')
            ->get();

        $recentVisitsQuery = PageVisit::with('user:id,name');
        
        if ($startDate) {
            $recentVisitsQuery->where('visited_date', '>=', $startDate);
        }
        if ($endDate) {
            $recentVisitsQuery->where('visited_date', '<=', $endDate);
        }

        $recentVisits = $recentVisitsQuery->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('monitoring/visitors', [
            'stats' => [
                'totalPageVisits' => $totalPageVisits,
                'todayPageVisits' => $todayPageVisits,
                'totalUniqueVisitors' => $totalUniqueVisitors,
                'todayUniqueVisitors' => $todayUniqueVisitors,
            ],
            'dailyVisits' => $dailyVisits,
            'topPages' => $topPages,
            'recentVisits' => $recentVisits,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    public function logs(Request $request)
    {
        // Read recent logs
        $logPath = storage_path('logs/laravel.log');
        $logs = [];
        if (File::exists($logPath)) {
            $file = file($logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $logs = array_slice($file, -500); // show slightly more lines
            $logs = array_reverse($logs);
        }

        return Inertia::render('monitoring/logs', [
            'logs' => $logs,
        ]);
    }
}
