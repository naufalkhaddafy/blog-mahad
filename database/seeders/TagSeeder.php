<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ["name" => "Aqidah"],
            ["name" => "Fiqih"],
            ["name" => "Muamalah"],
            ["name" => "Pemuda"],
            ["name" => "Tafsir"],

        ];

        collect($data)->each(function ($d) {
            Tag::create($d);
        });
    }
}
