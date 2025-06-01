<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view("items.index");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view("items.create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "title"=>"required",
            "body"=>"required",
        ]);

        try {
            $item = Item::create([
                "title" => $request->title,
                "body" => $request->body,
            ]);
            
            // Логирование для отладки
            \Log::info('Item created:', $item->toArray());
            
            return redirect()->route("items.index")->with("success", "Item created.");
        } catch (\Exception $e) {
            \Log::error('Error creating item:', ['error' => $e->getMessage()]);
            return back()->withInput()->withErrors(['error' => $e->getMessage()]);
        }
    
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
