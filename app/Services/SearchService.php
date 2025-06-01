<?php

namespace App\Services;

use App\Models\Item;

class SearchService
{
    public function search(?string $query, ?string $id)
    {
        $queryBuilder = Item::query();

        if ($id) {
            $queryBuilder->where('_id', $id);
        } elseif ($query) {
            $queryBuilder->where('name', 'like', "%{$query}%")
                ->orWhere('description.ru', 'like', "%{$query}%")
                ->orWhere('description.en', 'like', "%{$query}%")
                ->orWhere('brand', 'like', "%{$query}%")
                ->orWhere('specs', 'like', "%{$query}%");
        } else {
            return collect();
        }

        return $queryBuilder->get();
    }
}
