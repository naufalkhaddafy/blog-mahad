<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChannelRequest;
use App\Http\Resources\ChannelResource;
use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ChannelController extends Controller
{
    public function index()
    {
        return Inertia('Channels/Index', [
            "channels" => ChannelResource::collection(Channel::all()),
        ]);
    }

    public function store(ChannelRequest $request)
    {
        $fileName = $request->file('image') ? str()->slug($request->name) . '.' . $request->file('image')->getClientOriginalExtension() : '';

        Channel::create([
            'name' => $request->name,
            'description' => $request->description,
            'url' => $request->url,
            'status' => $request->status,
            'image' => $request->file('image') ? $request->file('image')->storeAs('images/channel', $fileName, 'public') : $request->image,
        ]);

        flashMessage('Success', 'Berhasil Menambahkan Channel');

        return back();
    }

    public function update(ChannelRequest $request, Channel $channel)
    {
        $urlValidate = filter_var($request->image, FILTER_VALIDATE_URL) !== false;

        if ($request->hasFile('image') || $urlValidate  && !empty($channel->image) && Storage::disk('public')->exists($channel->image)) {
            Storage::disk('public')->delete($channel->image);
        }

        $fileName = $request->file('image') ? str()->slug($request->name) . '.' . $request->file('image')->getClientOriginalExtension() : '';

        $channel->update([
            'name' => $request->name,
            'description' => $request->description,
            'url' => $request->url,
            'status' => $request->status,
            'image' => $request->file('image') ? $request->file('image')->storeAs('images/channel', $fileName, 'public') : ($urlValidate ? $request->image : $channel->image),
        ]);

        flashMessage('Success', 'Berhasil Mengubah Channel');

        return back();
    }

    public function destroy(Channel $channel)
    {
        if (!empty($channel->image) && Storage::disk('public')->exists($channel->image)) {
            Storage::disk('public')->delete($channel->image);
        }
        $channel->delete();

        flashMessage('Success', "Berhasil menghapus channel radio");

        return back();
    }

    public function status(Request $request)
    {
        Channel::find($request->id)->update(['status' => $request->status]);

        flashMessage('Success', "Berhasil mengubah Channel Radio");

        return back();
    }

    public function liveStream()
    {
        $dataChannel = Channel::whereIn('status', [\App\Enums\ChannelStatus::Live])->get();

        $includeStats = $dataChannel->map(function ($channel) {
            $keyName = \Illuminate\Support\Str::slug($channel->name);
            $keyRedisChannel = "shoutcast:channel:{$keyName}:last_data";
            $cachedData = \Illuminate\Support\Facades\Redis::get($keyRedisChannel);

            if ($cachedData) {
                $data = json_decode($cachedData, true);
            }

            return [
                ...$data ?? [],
                'channel_name' => $channel->name,
                'channel_url' => $channel->url,
                'channel_image' => $channel->image,
            ];
        });

        return Inertia::render('monitoring/live-stream', [
            'channels' => $includeStats,
        ]);
    }
}
