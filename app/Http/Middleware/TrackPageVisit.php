<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\PageVisit;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TrackPageVisit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Hanya track request GET dan response sukses (misal halaman web yang valid)
        if ($request->isMethod('GET') && $response->getStatusCode() === 200 && !$request->ajax()) {
            
            // Jangan track request ke aset/file
            if (preg_match('/\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/i', $request->path())) {
                return $response;
            }

            $sessionId = request()->hasSession() ? $request->session()->getId() : Str::slug($request->ip() ?? 'unknown');
            $url = $request->fullUrl();
            $today = Carbon::today()->toDateString();
            
            // Opsional: cegah duplikat per session per URL per hari
            $isVisited = PageVisit::where('url', $url)
                ->where('session_id', $sessionId)
                ->where('visited_date', $today)
                ->exists();

            if (!$isVisited) {
                PageVisit::create([
                    'url' => $url,
                    'ip_address' => $request->ip(),
                    'user_agent' => substr($request->userAgent() ?? '', 0, 500),
                    'session_id' => $sessionId,
                    'user_id' => auth()->check() ? auth()->id() : null,
                    'referer' => $request->headers->get('referer'),
                    'visited_date' => $today,
                ]);
            }
        }

        return $response;
    }
}
