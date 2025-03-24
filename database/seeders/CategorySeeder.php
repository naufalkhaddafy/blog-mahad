<?php

namespace Database\Seeders;

use App\Models\Category;
use GuzzleHttp\Promise\Create;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ["name" => "Artikel",],
            ["name" => "Tanya Jawab"],
            ["name" => "Info Taklim"],
            ["name" => "Info Dauroh"],
            ["name" => "Poster"],
            ["name" => "Info Mahad"],
            ["name" => "Audio"],
            ["name" => "E-Book"],
        ];

        collect($data)->each(function ($d) {
            Category::create($d);
        });
    }
}
