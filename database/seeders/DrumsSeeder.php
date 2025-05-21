<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DrumsSeeder extends Seeder
{
    public function run()
    {
        $drums = [
            // ==================== Акустические ударные (5 шт) ====================
            [
                'name' => 'Yamaha Stage Custom Birch',
                'description' => [
                    'en' => '5-piece acoustic drum set with birch shells',
                    'ru' => '5-компонентная акустическая ударная установка с корпусами из березы'
                ],
                'price' => 495000,
                'category' => 'drums',
                'subcategory' => 'acoustic_drums',
                'brand' => 'Yamaha',
                'images' => ['drums/yamaha_stage_custom.jpg'],
                'specs' => [
                    'shell_material' => 'Birch',
                    'configuration' => '5-Piece',
                    'color' => 'Raven Black',
                    'includes_hardware' => true,
                    'includes_cymbals' => false
                ]
            ],
            [
                'name' => 'Ludwig Accent CS Combo',
                'description' => [
                    'en' => 'Entry-level 5-piece drum set with poplar shells',
                    'ru' => 'Начальная 5-компонентная ударная установка с корпусами из тополя'
                ],
                'price' => 75000,
                'category' => 'drums',
                'subcategory' => 'acoustic_drums',
                'brand' => 'Ludwig',
                'images' => ['drums/ludwig_accent.jpg'],
                'specs' => [
                    'shell_material' => 'Poplar',
                    'configuration' => '5-Piece',
                    'color' => 'Wine Red',
                    'includes_hardware' => true,
                    'includes_cymbals' => true
                ]
            ],
            [
                'name' => 'DW Design Series Acrylic',
                'description' => [
                    'en' => 'Professional acrylic drum set with clear finish',
                    'ru' => 'Профессиональная акриловая ударная установка с прозрачной отделкой'
                ],
                'price' => 280000,
                'category' => 'drums',
                'subcategory' => 'acoustic_drums',
                'brand' => 'DW',
                'images' => ['drums/dw_design_acrylic.jpg'],
                'specs' => [
                    'shell_material' => 'Acrylic',
                    'configuration' => '5-Piece',
                    'color' => 'Clear',
                    'includes_hardware' => false,
                    'includes_cymbals' => false
                ]
            ],
            [
                'name' => 'Tama Imperialstar',
                'description' => [
                    'en' => 'Mid-level drum set with poplar shells',
                    'ru' => 'Ударная установка среднего уровня с корпусами из тополя'
                ],
                'price' => 242000,
                'category' => 'drums',
                'subcategory' => 'acoustic_drums',
                'brand' => 'Tama',
                'images' => ['drums/tama_imperialstar.jpg'],
                'specs' => [
                    'shell_material' => 'Poplar',
                    'configuration' => '5-Piece',
                    'color' => 'Black Oak Wrap',
                    'includes_hardware' => true,
                    'includes_cymbals' => true
                ]
            ],
            [
                'name' => 'Gretsch Catalina Club',
                'description' => [
                    'en' => 'Compact 4-piece drum set with mahogany shells',
                    'ru' => 'Компактная 4-компонентная ударная установка с корпусами из красного дерева'
                ],
                'price' => 113000,
                'category' => 'drums',
                'subcategory' => 'acoustic_drums',
                'brand' => 'Gretsch',
                'images' => ['drums/gretsch_catalina_club.jpg'],
                'specs' => [
                    'shell_material' => 'Mahogany',
                    'configuration' => '4-Piece',
                    'color' => 'Satin Walnut Glaze',
                    'includes_hardware' => false,
                    'includes_cymbals' => false
                ]
            ],

            // ==================== Электронные ударные (5 шт) ====================
            [
                'name' => 'Roland TD-1DMK V-Drums',
                'description' => [
                    'en' => 'Entry-level electronic drum set with mesh heads',
                    'ru' => 'Начальная электронная ударная установка с mesh-пэдами'
                ],
                'price' => 78000,
                'category' => 'drums',
                'subcategory' => 'electronic_drums',
                'brand' => 'Roland',
                'images' => ['drums/roland_td1dmk.jpg'],
                'specs' => [
                    'pad_type' => 'Mesh',
                    'kits' => 15,
                    'module' => 'TD-1',
                    'connectivity' => ['USB', 'MIDI'],
                    'training_functions' => true
                ]
            ],
            [
                'name' => 'Yamaha DTX402K',
                'description' => [
                    'en' => 'Electronic drum set with rubber pads',
                    'ru' => 'Электронная ударная установка с резиновыми пэдами'
                ],
                'price' => 75000,
                'category' => 'drums',
                'subcategory' => 'electronic_drums',
                'brand' => 'Yamaha',
                'images' => ['drums/yamaha_dtx402k.jpg'],
                'specs' => [
                    'pad_type' => 'Rubber',
                    'kits' => 10,
                    'module' => 'DTX402',
                    'connectivity' => ['USB'],
                    'app_integration' => true
                ]
            ],
            [
                'name' => 'Alesis Nitro Mesh Kit',
                'description' => [
                    'en' => 'Affordable electronic drum set with mesh heads',
                    'ru' => 'Доступная электронная ударная установка с mesh-пэдами'
                ],
                'price' => 55000,
                'category' => 'drums',
                'subcategory' => 'electronic_drums',
                'brand' => 'Alesis',
                'images' => ['drums/alesis_nitro_mesh.jpg'],
                'specs' => [
                    'pad_type' => 'Mesh',
                    'kits' => 40,
                    'module' => 'Nitro Drum Module',
                    'connectivity' => ['USB', 'MIDI'],
                    'included_accessories' => ['drumsticks', 'audio cable']
                ]
            ],
            [
                'name' => 'Roland TD-17KVX',
                'description' => [
                    'en' => 'Professional electronic drum set with advanced module',
                    'ru' => 'Профессиональная электронная ударная установка с продвинутым модулем'
                ],
                'price' => 250000,
                'category' => 'drums',
                'subcategory' => 'electronic_drums',
                'brand' => 'Roland',
                'images' => ['drums/roland_td17kvx.jpg'],
                'specs' => [
                    'pad_type' => 'Mesh',
                    'kits' => 50,
                    'module' => 'TD-17',
                    'connectivity' => ['USB', 'MIDI', 'Bluetooth'],
                    'sound_engine' => 'Prismatic Sound Modeling'
                ]
            ],
            [
                'name' => 'Yamaha DTX6K3-X',
                'description' => [
                    'en' => 'High-end electronic drum set with TCS pads',
                    'ru' => 'Продвинутая электронная ударная установка с TCS-пэдами'
                ],
                'price' => 280000,
                'category' => 'drums',
                'subcategory' => 'electronic_drums',
                'brand' => 'Yamaha',
                'images' => ['drums/yamaha_dtx6k3.jpg'],
                'specs' => [
                    'pad_type' => 'TCS (Textured Cellular Silicone)',
                    'kits' => 60,
                    'module' => 'DTX-PRO',
                    'connectivity' => ['USB', 'MIDI', 'Bluetooth'],
                    'samples' => 400
                ]
            ],

            // ==================== Тарелки (5 шт) ====================
            [
                'name' => 'Zildjian A Custom Hi-Hat',
                'description' => [
                    'en' => '14-inch professional hi-hat cymbals',
                    'ru' => '14-дюймовые профессиональные тарелки хай-хэт'
                ],
                'price' => 28000,
                'category' => 'drums',
                'subcategory' => 'cymbals',
                'brand' => 'Zildjian',
                'images' => ['drums/zildjian_a_custom_hihat.jpg'],
                'specs' => [
                    'type' => 'Hi-Hat',
                    'size' => '14 inch',
                    'material' => 'B20 Bronze',
                    'series' => 'A Custom',
                    'weight' => 'Medium Thin'
                ]
            ],
            [
                'name' => 'Meinl Classics Custom Dark Ride',
                'description' => [
                    'en' => '20-inch dark ride cymbal',
                    'ru' => '20-дюймовая темная тарелка райд'
                ],
                'price' => 18000,
                'category' => 'drums',
                'subcategory' => 'cymbals',
                'brand' => 'Meinl',
                'images' => ['drums/meinl_classics_custom_dark_ride.jpg'],
                'specs' => [
                    'type' => 'Ride',
                    'size' => '20 inch',
                    'material' => 'B12 Bronze',
                    'series' => 'Classics Custom Dark',
                    'weight' => 'Medium'
                ]
            ],
            [
                'name' => 'Meinl HCS Hi-Hat',
                'description' => [
                    'en' => '14-inch brass hi-hat cymbals',
                    'ru' => '14-дюймовые латунные тарелки хай-хэт'
                ],
                'price' => 9000,
                'category' => 'drums',
                'subcategory' => 'cymbals',
                'brand' => 'Meinl',
                'images' => ['drums/meinl_hcs_hihat.jpg'],
                'specs' => [
                    'type' => 'Hi-Hat',
                    'size' => '14 inch',
                    'material' => 'MS63 Brass',
                    'series' => 'HCS',
                    'weight' => 'Medium'
                ]
            ],
            [
                'name' => 'Zildjian L80 Low Volume Crash',
                'description' => [
                    'en' => '18-inch low volume crash cymbal',
                    'ru' => '18-дюймовая тихая тарелка крэш'
                ],
                'price' => 15000,
                'category' => 'drums',
                'subcategory' => 'cymbals',
                'brand' => 'Zildjian',
                'images' => ['drums/zildjian_l80_crash.jpg'],
                'specs' => [
                    'type' => 'Crash',
                    'size' => '18 inch',
                    'material' => 'Alloy',
                    'series' => 'L80 Low Volume',
                    'weight' => 'Thin'
                ]
            ],
            [
                'name' => 'Sabian B8X Crash',
                'description' => [
                    'en' => '16-inch bronze crash cymbal',
                    'ru' => '16-дюймовая бронзовая тарелка крэш'
                ],
                'price' => 9500,
                'category' => 'drums',
                'subcategory' => 'cymbals',
                'brand' => 'Sabian',
                'images' => ['drums/sabian_b8x_crash.jpg'],
                'specs' => [
                    'type' => 'Crash',
                    'size' => '16 inch',
                    'material' => 'B8 Bronze',
                    'series' => 'B8X',
                    'weight' => 'Thin'
                ]
            ],

            // ==================== Перкуссия (5 шт) ====================
            [
                'name' => 'LP Aspire Wood Bongos',
                'description' => [
                    'en' => 'Traditional wooden bongos',
                    'ru' => 'Традиционные деревянные бонги'
                ],
                'price' => 12000,
                'category' => 'drums',
                'subcategory' => 'percussion',
                'brand' => 'LP',
                'images' => ['drums/lp_aspire_bongos.jpg'],
                'specs' => [
                    'type' => 'Bongos',
                    'material' => 'Siam Oak',
                    'sizes' => '7 & 8.5 inch',
                    'hardware' => 'Chrome'
                ]
            ],
            [
                'name' => 'Meinl String Cajon',
                'description' => [
                    'en' => 'Professional wooden cajon with snare strings',
                    'ru' => 'Профессиональный деревянный кахон со струнными струнами'
                ],
                'price' => 15000,
                'category' => 'drums',
                'subcategory' => 'percussion',
                'brand' => 'Meinl',
                'images' => ['drums/meinl_cajon.jpg'],
                'specs' => [
                    'type' => 'Cajon',
                    'material' => 'Birch',
                    'size' => 'Standard',
                    'snare_type' => 'String'
                ]
            ],
            [
                'name' => 'LP Cowbell Black Beauty',
                'description' => [
                    'en' => 'Steel cowbell with black finish',
                    'ru' => 'Стальной ковбелл с черным покрытием'
                ],
                'price' => 6800,
                'category' => 'drums',
                'subcategory' => 'percussion',
                'brand' => 'LP',
                'images' => ['drums/lp_cowbell.jpg'],
                'specs' => [
                    'type' => 'Cowbell',
                    'material' => 'Steel',
                    'size' => 'Standard',
                    'finish' => 'Black'
                ]
            ],
            [
                'name' => 'Meinl Egg Shakers',
                'description' => [
                    'en' => 'Pair of plastic egg shakers',
                    'ru' => 'Пара пластиковых шейкеров в форме яйца'
                ],
                'price' => 2800,
                'category' => 'drums',
                'subcategory' => 'percussion',
                'brand' => 'Meinl',
                'images' => ['drums/meinl_eggshakers.jpg'],
                'specs' => [
                    'type' => 'Shaker',
                    'material' => 'Plastic',
                    'quantity' => 2,
                    'sizes' => 'Small'
                ]
            ],
            [
                'name' => 'Latin Percussion Multi Guiro',
                'description' => [
                    'en' => 'Traditional guiro scraper',
                    'ru' => 'Традиционный гуиро-скребок'
                ],
                'price' => 11000,
                'category' => 'drums',
                'subcategory' => 'percussion',
                'brand' => 'Latin Percussion',
                'images' => ['drums/lp_guiro.jpg'],
                'specs' => [
                    'type' => 'Guiro',
                    'material' => 'Grooved Plastic',
                    'length' => '13 inch',
                    'diameter' => '4.75 inch'
                ]
            ]
        ];

        Item::insert($drums);
    }
}