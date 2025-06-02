<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AuthService;
use App\Services\CartService;
use App\Services\OrderService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->singleton(AuthService::class, function () {
            return new AuthService();
        });

        $this->app->singleton(CartService::class, function () {
            return new CartService();
        });
        $this->app->singleton(OrderService::class, function () {
            return new OrderService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
