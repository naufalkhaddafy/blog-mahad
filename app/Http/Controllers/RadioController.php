<?php

namespace App\Http\Controllers;

use App\Enums\ChannelStatus;
use App\Http\Resources\ChannelResource;
use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RadioController extends Controller
{
    public function index()
    {
        $dataChannel = Channel::whereNotIn('status', [ChannelStatus::Unactive])->get();

        $includeStats = $dataChannel->map(function ($channel) {
            try {
                $response = Http::get($channel->url . '/stats');
                $xmlString = $response->body();
                $xml = simplexml_load_string($xmlString);
                $currentListeners = (string) $xml->CURRENTLISTENERS;
                $serverTitle = (string) $xml->SERVERTITLE;
                $songTitle = (string) $xml->SONGTITLE;
                return [
                    ...$channel->toArray(),
                    'listeners' => $currentListeners,
                    'nameServer' => $serverTitle,
                    'descriptionServer' => $songTitle,

                ];
            } catch (\Exception $e) {
                return [
                    ...$channel->toArray(),
                    'listeners' => 0,
                    'nameServer' => null,
                    'descriptionServer' => null,

                ];
            }
        });

        return Inertia('Blogs/Radio/Index', [
            "channels" => ChannelResource::collection($includeStats)
        ]);
    }
}
