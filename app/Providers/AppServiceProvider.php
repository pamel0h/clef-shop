<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AuthService;
use App\Services\CartService;
use App\Services\OrderService;
use App\Formatters\ProductFormatter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->singleton(ProductFormatter::class, function ($app) {
            return new ProductFormatter();
        });

        $this->app->singleton(AuthService::class, function () {
            return new AuthService();
        });

        // $this->app->singleton(CartService::class, function () {
        //     return new CartService();
        // });

        // Регистрация CartService с зависимостью ProductFormatter
        $this->app->singleton(CartService::class, function ($app) {
            return new CartService($app->make(ProductFormatter::class));
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
