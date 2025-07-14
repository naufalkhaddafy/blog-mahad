<?php

namespace App\Http\Controllers;

use App\Enums\ChannelStatus;
use App\Http\Resources\ChannelResource;
use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class RadioController extends Controller
{
    public function index()
    {
        $dataChannel = Channel::whereNotIn('status', [ChannelStatus::Unactive])->get();

        $includeStats = $dataChannel->map(function ($channel) {
            $keyName = Str::slug($channel->name);
            $keyRedisChannel = "shoutcast:channel:{$keyName}:last_data";
            $cachedData = Redis::get($keyRedisChannel);

            if ($cachedData) {
                $data = json_decode($cachedData, true);
            }

            return [
                ...$data ?? [],
            ];
        });

        return Inertia('Blogs/Radio/Index', [
            "channels" => ChannelResource::collection($includeStats),
            'meta' => (object) [
                'title' => 'Radio Online - kajianislamsangatta.com',
                'description' => 'Simak Kajian Islam Ilmiah di Radio Islam Sangatta - kajianislamsangatta.com',
                'url' => url()->current(),
            ],
        ]);
    }
}
