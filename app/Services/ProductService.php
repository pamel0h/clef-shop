<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use stdClass;

class ProductService
{
    public function saveTranslation($namespace, $key, $ru, $en, $parentCategory = null)
    {
        try {
            $ruPath = public_path('locales/ru/translation.json');
            $enPath = public_path('locales/en/translation.json');

            $ruTranslations = file_exists($ruPath) ? json_decode(file_get_contents($ruPath), true) : [];
            $enTranslations = file_exists($enPath) ? json_decode(file_get_contents($enPath), true) : [];

            if ($namespace === 'category') {
                $ruTranslations['category'][$key] = $ru;
                $enTranslations['category'][$key] = $en;
            } elseif ($namespace === 'subcategory') {
                if (!isset($ruTranslations['subcategory'])) {
                    $ruTranslations['subcategory'] = [];
                }
                if (!isset($enTranslations['subcategory'])) {
                    $enTranslations['subcategory'] = [];
                }

                if ($parentCategory) {
                    if (!isset($ruTranslations['subcategory'][$parentCategory])) {
                        $ruTranslations['subcategory'][$parentCategory] = [];
                    }
                    if (!isset($enTranslations['subcategory'][$parentCategory])) {
                        $enTranslations['subcategory'][$parentCategory] = [];
                    }

                    $ruTranslations['subcategory'][$parentCategory][$key] = $ru;
                    $enTranslations['subcategory'][$parentCategory][$key] = $en;
                } else {
                    $ruTranslations['subcategory'][$key] = $ru;
                    $enTranslations['subcategory'][$key] = $en;
                }
            } else {
                if (!isset($ruTranslations[$namespace])) {
                    $ruTranslations[$namespace] = [];
                }
                if (!isset($enTranslations[$namespace])) {
                    $enTranslations[$namespace] = [];
                }
                $ruTranslations[$namespace][$key] = $ru;
                $enTranslations[$namespace][$key] = $en;
            }

            file_put_contents($ruPath, json_encode($ruTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            file_put_contents($enPath, json_encode($enTranslations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

            // Обновляем метку времени переводов в кэше
            Cache::put('translations_last_updated', now()->toIso8601String());

            Log::info('Translation saved successfully', [
                'namespace' => $namespace,
                'key' => $key,
                'parent_category' => $parentCategory,
                'translations_last_updated' => Cache::get('translations_last_updated')
            ]);
        } catch (\Exception $e) {
            Log::error('Error saving translation', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function storeProduct($validated, $request, $productFormatter)
    {
        try {
            Log::info('ProductService: Starting product creation', ['request_data' => $request->all()]);

            // Handle new category translations
            if ($request->has('new_category')) {
                $newCategory = json_decode($request->input('new_category'), true);
                if ($newCategory && isset($newCategory['slug'], $newCategory['ru'], $newCategory['en'])) {
                    $this->saveTranslation('category', $newCategory['slug'], $newCategory['ru'], $newCategory['en']);
                    Log::info('ProductService: New category translation saved', ['category' => $newCategory]);
                }
            }

            // Handle new subcategory translations
            if ($request->has('new_subcategory')) {
                $newSubcategory = json_decode($request->input('new_subcategory'), true);
                if ($newSubcategory && isset($newSubcategory['slug'], $newSubcategory['ru'], $newSubcategory['en'])) {
                    $this->saveTranslation('subcategory', $newSubcategory['slug'], $newSubcategory['ru'], $newSubcategory['en'], $validated['category']);
                    Log::info('ProductService: New subcategory translation saved', ['subcategory' => $newSubcategory]);
                }
            }

            // Handle images
            $imagesPaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('product_images', 'public');
                    $imagesPaths[] = basename($path);
                }
                Log::info('ProductService: Images processed', ['images' => $imagesPaths]);
            }

            // Handle specs
            $specs = new stdClass();
            $specsString = $request->input('specs_data');
            if (!empty($specsString)) {
                try {
                    $specsArray = json_decode($specsString, true);
                    // Log::info('ProductService: Decoded specs', ['specs' => $specsArray]);

                    if (is_array($specsArray)) {
                        foreach ($specsArray as $key => $value) {
                            if (!empty($key)) {
                                if (is_array($value) && isset($value['value'], $value['translations'])) {
                                    $specs->{$key} = $value['value'];
                                    $this->saveTranslation('specs', $key, $value['translations']['ru'], $value['translations']['en']);
                                    // Log::info('ProductService: New spec translation saved', ['spec' => $key, 'translations' => $value['translations']]);
                                } else if (!empty($value)) {
                                    $specs->{$key} = $value;
                                }
                            }
                        }
                    }
                } catch (\Exception $e) {
                    Log::error('ProductService: Error parsing specs JSON', ['error' => $e->getMessage()]);
                }
            }
            Log::info('ProductService: Final specs object', ['specs' => $specs]);

            // Create the item
            $item = Item::create([
                'name' => $validated['name'],
                'description' => [
                    'en' => $validated['description_en'] ?? '',
                    'ru' => $validated['description_ru'] ?? ''
                ],
                'price' => (float)$validated['price'],
                'category' => $validated['category'],
                'subcategory' => $validated['subcategory'],
                'brand' => $validated['brand'],
                'discount' => (float)($validated['discount'] ?? 0),
                'images' => $imagesPaths,
                'specs' => $specs
            ]);

            Log::info('ProductService: Product created successfully', ['item_id' => $item->id]);

            return [
                'success' => true,
                'data' => $productFormatter->formatProduct($item),
                'message' => 'Product created successfully'
            ];
        } catch (\Exception $e) {
            Log::error('ProductService: Error creating product', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            throw $e;
        }
    }

    public function updateProduct($id, $validated, $request, $productFormatter)
    {
        try {
            Log::info('ProductService: Starting product update', [
                'id' => $id,
                'request_data' => $request->all()
            ]);

            $item = Item::findOrFail($id);

            // Handle new category translations
            if ($request->has('new_category')) {
                $newCategory = json_decode($request->input('new_category'), true);
                if ($newCategory && isset($newCategory['slug'], $newCategory['ru'], $newCategory['en'])) {
                    $this->saveTranslation('category', $newCategory['slug'], $newCategory['ru'], $newCategory['en']);
                    Log::info('ProductService: New category translation saved', ['category' => $newCategory]);
                }
            } else {
                // Проверяем, существует ли перевод для новой категории
                $category = $validated['category'];
                $ruPath = public_path('locales/ru/translation.json');
                $ruTranslations = File::exists($ruPath) ? json_decode(File::get($ruPath), true) : [];
                if (!isset($ruTranslations['category'][$category])) {
                    $this->saveTranslation('category', $category, $category, $category); // Временный перевод
                    Log::info('ProductService: Added temporary translation for category', ['category' => $category]);
                }
            }

            // Handle new subcategory translations
            if ($request->has('new_subcategory')) {
                $newSubcategory = json_decode($request->input('new_subcategory'), true);
                if ($newSubcategory && isset($newSubcategory['slug'], $newSubcategory['ru'], $newSubcategory['en'])) {
                    $this->saveTranslation('subcategory', $newSubcategory['slug'], $newSubcategory['ru'], $newSubcategory['en'], $validated['category']);
                    Log::info('ProductService: New subcategory translation saved', ['subcategory' => $newSubcategory]);
                }
            } else {
                // Проверяем, существует ли перевод для новой подкатегории
                $subcategory = $validated['subcategory'];
                $category = $validated['category'];
                $ruPath = public_path('locales/ru/translation.json');
                $ruTranslations = File::exists($ruPath) ? json_decode(File::get($ruPath), true) : [];
                if (!isset($ruTranslations['subcategory'][$category][$subcategory])) {
                    $this->saveTranslation('subcategory', $subcategory, $subcategory, $subcategory, $category); // Временный перевод
                    Log::info('ProductService: Added temporary translation for subcategory', ['subcategory' => $subcategory, 'category' => $category]);
                }
            }

            // Handle images
            $imagesPaths = $item->images ?? [];
            if ($request->hasFile('images')) {
                $imagesPaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('product_images', 'public');
                    $imagesPaths[] = basename($path);
                }
                Log::info('ProductService: New images processed', ['images' => $imagesPaths]);
            }

            // Handle specs
            $specs = new stdClass();
            if ($request->has('specs') && is_array($request->specs)) {
                foreach ($request->specs as $spec) {
                    if (!empty($spec['key']) && !empty($spec['value'])) {
                        $specs->{trim($spec['key'])} = trim($spec['value']);
                        // Проверяем, существует ли перевод для спецификации
                        $ruPath = public_path('locales/ru/translation.json');
                        $ruTranslations = File::exists($ruPath) ? json_decode(File::get($ruPath), true) : [];
                        if (!isset($ruTranslations['specs'][trim($spec['key'])])) {
                            $this->saveTranslation('specs', trim($spec['key']), trim($spec['key']), trim($spec['key']));
                            Log::info('ProductService: Added temporary translation for spec', ['spec_key' => trim($spec['key'])]);
                        }
                    }
                }
                Log::info('ProductService: Specs processed', ['specs' => $specs]);
            } else {
                $specs = $item->specs ?? new stdClass();
                Log::info('ProductService: Keeping existing specs', ['specs' => $specs]);
            }

            // Update the item
            $item->update([
                'name' => $validated['name'],
                'description' => [
                    'en' => $validated['description_en'] ?? '',
                    'ru' => $validated['description_ru'] ?? ''
                ],
                'price' => (float)$validated['price'],
                'category' => $validated['category'],
                'subcategory' => $validated['subcategory'],
                'brand' => $validated['brand'],
                'discount' => (float)($validated['discount'] ?? 0),
                'images' => $imagesPaths,
                'specs' => $specs,
            ]);

            Log::info('ProductService: Product updated successfully', ['item_id' => $item->id]);

            return [
                'success' => true,
                'data' => $productFormatter->formatProduct($item),
                'message' => 'Product updated successfully'
            ];
        } catch (\Exception $e) {
            Log::error('ProductService: Error updating product', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            throw $e;
        }
    }

    public function deleteProduct($id)
    {
        try {
            $item = Item::findOrFail($id);
            $item->delete();

            Log::info('ProductService: Product deleted', ['id' => $id]);
            Cache::put('last_updated', now()->toIso8601String());
            
            return [
                'success' => true,
                'message' => 'Product deleted successfully'
            ];
        } catch (\Exception $e) {
            Log::error('ProductService: Error deleting product', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function getSpecKeysAndValues()
    {
        try {
            // Log::info('ProductService: getSpecKeysAndValues begin');
            $items = Item::whereNotNull('specs')->get();
            // Log::info('ProductService: Items with specs', [
            //     'count' => $items->count(),
            //     'specs' => $items->pluck('specs')->toArray()
            // ]);

            $specData = [];
            foreach ($items as $item) {
                $specs = $item->specs;
                if (is_string($item->specs)) {
                    $specs = json_decode($item->specs, true);
                    // Log::info('ProductService: Decoded string specs for item', [
                    //     'item_id' => $item->id,
                    //     'specs' => $specs
                    // ]
                // );
                }

                if ($specs && (is_array($specs) || is_object($specs)) && !empty($specs)) {
                    foreach ((array)$specs as $key => $value) {
                        if (!empty($key) && $value !== null) {
                            if (!isset($specData[$key])) {
                                $specData[$key] = [];
                            }
                            if (!in_array($value, $specData[$key])) {
                                $specData[$key][] = $value;
                            }
                        }
                    }
                } else {
                    if ($specs !== null && !is_array($specs) && !is_object($specs)) {
                        Log::warning('ProductService: Invalid specs for item', [
                            'item_id' => $item->id,
                            'specs' => $specs
                        ]);
                    }
                }
            }

            foreach ($specData as $key => $values) {
                sort($specData[$key]);
            }

            // Log::info('ProductService: Spec keys and values', ['spec_data' => $specData]);

            return [
                'success' => true,
                'data' => $specData
            ];
        } catch (\Exception $e) {
            Log::error('ProductService: Error fetching spec keys and values', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}