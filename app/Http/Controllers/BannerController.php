<?php

namespace App\Http\Controllers;

use App\Http\Requests\BannerRequest;
use App\Models\Banner;
use App\Http\Resources\BannerResource;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia('Banner/Index', [
            "banner" => BannerResource::collection(Banner::query()->orderBy('order')->get()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function reorder()
    {
        $type = Request()->type;
        if ($type == "order") {
            $items = Request()->items;
            foreach ($items as $itemData) {
                Banner::where('id', $itemData['id'])
                    ->update(['order' => $itemData['order']]);
            }
        } elseif ($type == 'active') {
            Banner::find(Request()->id)->update(["status" => Request()->status]);
        }


        flashMessage("Success", "Berhasil merubah data banner");
        return back();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BannerRequest $request)
    {
        $fileName = str()->slug($request->title) . '.' . $request->file('image')->getClientOriginalExtension();

        Banner::create([
            'title' => $request->title,
            'url' => $request->url,
            'status' => $request->status,
            "image" =>  $request->file("image")->storeAs("images/banner", $fileName, 'public'),
        ]);

        flashMessage("Success", "Berhasil menambahkan banner");

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BannerRequest $request, Banner $banner)
    {
        if ($request->hasFile('image')  && !empty($banner->image) && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $fileName = $request->file('image') ? str()->slug($request->title) . '.' . $request->file('image')->getClientOriginalExtension() : $request->image;


        $banner->update([
            'title' => $request->title,
            'url' => $request->url,
            "status" => $request->status,
            "image" => $request->file('image') ? $request->file("image")->storeAs("images/banner", $fileName, 'public') : $banner->image,
        ]);

        flashMessage("Success", "Berhasil merubah data banner");
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        if (!empty($banner->image) && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        flashMessage("Success", "Berhasil menghapus banner ");

        return back();
    }
}
