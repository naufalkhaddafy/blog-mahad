<?php

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'category_id' => Category::inRandomOrder()->first()->id,
            'title' => fake()->text(50),
            'description' => fake()->word(),
            'image' => now(),
            'status' => fake()->randomElement(PostStatus::cases())->value,
        ];
    }
    public function withTags()
    {
        return $this->afterCreating(function (Post $post) {
            $tags = Tag::inRandomOrder()->limit(rand(1, 5))->pluck('id');
            $post->tags()->attach($tags);
        });
    }
}
