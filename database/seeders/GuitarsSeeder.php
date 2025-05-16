<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GuitarsSeeder extends Seeder
{
    public function run()
    {
        $items = [
            // 1. Fender Stratocaster HSS
            [
                'name' => 'Fender Player Stratocaster HSS',
                'description' => [
                    'en' => 'Versatile HSS configuration with maple neck and alder body. Perfect for rock and blues.',
                    'ru' => 'Универсальная конфигурация HSS с кленовым грифом и корпусом из ольхи. Идеальна для рока и блюза.'
                ],
                'price' => 78900,
                'category' => 'guitars',
                'subcategory' => 'electric',
                'brand' => 'Fender',
                'images' => ['guitars/fender_player_strat_hss_buttercream.jpg'],
                'specs' => [
                    'color' => 'Buttercream',
                    'body_shape' => 'Stratocaster',
                    'strings' => 6,
                    'body_material' => 'Alder',
                    'neck_material' => 'Maple',
                    'pickups' => 'HSS',
                    'scale_length' => 25.5,
                    'left_handed' => false
                ]
            ],

            // 2. Fender Telecaster
            [
                'name' => 'Fender American Professional II Telecaster',
                'description' => [
                    'en' => 'Modern Telecaster with V-Mod II pickups for versatile tone.',
                    'ru' => 'Современный Telecaster с звукоснимателями V-Mod II для универсального звучания.'
                ],
                'price' => 179900,
                'category' => 'guitars',
                'subcategory' => 'electric',
                'brand' => 'Fender',
                'images' => ['guitars/fender_am_pro_ii_tele_mercury.jpg'],
                'specs' => [
                    'color' => 'Mercury',
                    'body_shape' => 'Telecaster',
                    'strings' => 6,
                    'body_material' => 'Alder',
                    'neck_material' => 'Maple',
                    'pickups' => 'V-Mod II Single-Coil',
                    'scale_length' => 25.5,
                    'left_handed' => false
                ]
            ],

            // 3. Gibson Les Paul
            [
                'name' => 'Gibson Les Paul Standard 50s',
                'description' => [
                    'en' => 'Legendary 50s style Les Paul with Burstbucker pickups.',
                    'ru' => 'Легендарный Les Paul в стиле 50-х с звукоснимателями Burstbucker.'
                ],
                'price' => 219990,
                'category' => 'guitars',
                'subcategory' => 'electric',
                'brand' => 'Gibson',
                'images' => ['guitars/gibson_les_paul_50s_hcs.jpg'],
                'specs' => [
                    'color' => 'Heritage Cherry Sunburst',
                    'body_shape' => 'Les Paul',
                    'strings' => 6,
                    'body_material' => 'Mahogany with Maple Top',
                    'neck_material' => 'Mahogany',
                    'pickups' => 'Burstbucker 1 & 2',
                    'scale_length' => 24.75,
                    'left_handed' => false
                ]
            ],

            // 4. Gibson SG
            [
                'name' => 'Gibson SG Standard 61',
                'description' => [
                    'en' => 'Classic SG with thin neck and powerful sound.',
                    'ru' => 'Классический SG с тонким грифом и мощным звучанием.'
                ],
                'price' => 199900,
                'category' => 'guitars',
                'subcategory' => 'electric',
                'brand' => 'Gibson',
                'images' => ['guitars/gibson_sg_standard_61_vintage_cherry.jpg'],
                'specs' => [
                    'color' => 'Vintage Cherry',
                    'body_shape' => 'SG',
                    'strings' => 6,
                    'body_material' => 'Mahogany',
                    'neck_material' => 'Mahogany',
                    'pickups' => '61R & 61T Humbuckers',
                    'scale_length' => 24.75,
                    'left_handed' => false
                ]
            ],

            // 5. Ibanez RG5121
            [
                'name' => 'Ibanez RG5121',
                'description' => [
                    'en' => 'High-performance guitar with thin neck and Fishman Fluence pickups.',
                    'ru' => 'Высокопроизводительная гитара с тонким грифом и звукоснимателями Fishman Fluence.'
                ],
                'price' => 169900,
                'category' => 'guitars',
                'subcategory' => 'electric',
                'brand' => 'Ibanez',
                'images' => ['guitars/ibanez_rg5121_dark_tide_blue_flat.jpg'],
                'specs' => [
                    'color' => 'Dark Tide Blue Flat',
                    'body_shape' => 'RG',
                    'strings' => 6,
                    'body_material' => 'Burgundy Metallic',
                    'neck_material' => '5pc Maple/Wenge',
                    'pickups' => 'Fishman Fluence Modern Humbucker',
                    'scale_length' => 25.5,
                    'left_handed' => false
                ]
            ],

            // 6. Ibanez AZ242F
            [
                'name' => 'Ibanez AZ242F',
                'description' => [
                    'en' => 'Versatile guitar with oval neck and Seymour Duncan pickups.',
                    'ru' => 'Универсальная гитара с овальным грифом и звукоснимателями Seymour Duncan.'
                ],
                'price' => 139900,
                'category' => 'guitars',
                'subcategory' => 'electric',
                'brand' => 'Ibanez',
                'images' => ['guitars/ibanez_az242f_tequila_sunrise_burst.jpg'],
                'specs' => [
                    'color' => 'Tequila Sunrise Burst',
                    'body_shape' => 'AZ',
                    'strings' => 6,
                    'body_material' => 'Flamed Maple Top / American Basswood Body',
                    'neck_material' => 'Roasted Maple',
                    'pickups' => 'Seymour Duncan Hyperion',
                    'scale_length' => 25.5,
                    'left_handed' => false
                ]
            ],

            // 7. Martin D-28 (акустика)
            [
                'name' => 'Martin D-28',
                'description' => [
                    'en' => 'Iconic dreadnought with Sitka spruce top and rosewood back/sides.',
                    'ru' => 'Легендарный дредноут с верхней декой из ели ситка и корпусом из палисандра.'
                ],
                'price' => 349900,
                'category' => 'guitars',
                'subcategory' => 'acoustic',
                'brand' => 'Martin',
                'images' => ['guitars/martin_d28.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Dreadnought',
                    'strings' => 6,
                    'body_material' => 'Sitka Spruce Top / East Indian Rosewood Back & Sides',
                    'neck_material' => 'Select Hardwood',
                    'electronics' => false,
                    'scale_length' => 25.4,
                    'left_handed' => false
                ]
            ],

            // 8. Martin 000-15M
            [
                'name' => 'Martin 000-15M',
                'description' => [
                    'en' => 'Compact guitar with warm and balanced sound.',
                    'ru' => 'Компактная гитара с теплым и сбалансированным звучанием.'
                ],
                'price' => 199900,
                'category' => 'guitars',
                'subcategory' => 'acoustic',
                'brand' => 'Martin',
                'images' => ['guitars/martin_00015m.jpg'],
                'specs' => [
                    'color' => 'Mahogany Burst',
                    'body_shape' => '000',
                    'strings' => 6,
                    'body_material' => 'Mahogany Top, Back & Sides',
                    'neck_material' => 'Mahogany',
                    'electronics' => false,
                    'scale_length' => 25.4,
                    'left_handed' => false
                ]
            ],

            // 9. Taylor 814ce
            [
                'name' => 'Taylor 814ce',
                'description' => [
                    'en' => 'Cutaway guitar with Expression System 2 electronics.',
                    'ru' => 'Гитара с вырезом и электроникой Expression System 2.'
                ],
                'price' => 429900,
                'category' => 'guitars',
                'subcategory' => 'acoustic',
                'brand' => 'Taylor',
                'images' => ['guitars/taylor_814ce.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Grand Auditorium',
                    'strings' => 6,
                    'body_material' => 'Sitka Spruce Top / Indian Rosewood Back & Sides',
                    'neck_material' => 'Tropical Mahogany',
                    'electronics' => 'Taylor Expression System 2',
                    'scale_length' => 25.5,
                    'left_handed' => false
                ]
            ],

            // 10. Taylor GS Mini
            [
                'name' => 'Taylor GS Mini Mahogany',
                'description' => [
                    'en' => 'Compact guitar with warm mahogany sound.',
                    'ru' => 'Компактная гитара с теплым звучанием красного дерева.'
                ],
                'price' => 89900,
                'category' => 'guitars',
                'subcategory' => 'acoustic',
                'brand' => 'Taylor',
                'images' => ['guitars/taylor_gs_mini_mahogany.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Grand Symphony Mini',
                    'strings' => 6,
                    'body_material' => 'Mahogany Top, Back & Sides',
                    'neck_material' => 'Sapele',
                    'electronics' => false,
                    'scale_length' => 23.5,
                    'left_handed' => false
                ]
            ],

            // 11. Fender Precision Bass
            [
                'name' => 'Fender American Professional II Precision Bass',
                'description' => [
                    'en' => 'Modern P-Bass with deep C-shaped neck.',
                    'ru' => 'Современный P-Bass с грифом формы Deep C.'
                ],
                'price' => 189900,
                'category' => 'guitars',
                'subcategory' => 'bass',
                'brand' => 'Fender',
                'images' => ['guitars/fender_am_pro_ii_pbass_olympic_white.jpg'],
                'specs' => [
                    'color' => 'Olympic White',
                    'body_shape' => 'Precision Bass',
                    'strings' => 4,
                    'body_material' => 'Alder',
                    'neck_material' => 'Maple',
                    'pickups' => 'V-Mod II Split Single-Coil',
                    'scale_length' => 34,
                    'left_handed' => false
                ]
            ],

            // 12. Fender Jazz Bass
            [
                'name' => 'Fender Player Jazz Bass',
                'description' => [
                    'en' => 'Versatile Jazz Bass with two single-coil pickups.',
                    'ru' => 'Универсальный Jazz Bass с двумя сингловыми звукоснимателями.'
                ],
                'price' => 84900,
                'category' => 'guitars',
                'subcategory' => 'bass',
                'brand' => 'Fender',
                'images' => ['guitars/fender_player_jbass_3tsb.jpg'],
                'specs' => [
                    'color' => '3-Color Sunburst',
                    'body_shape' => 'Jazz Bass',
                    'strings' => 4,
                    'body_material' => 'Alder',
                    'neck_material' => 'Maple',
                    'pickups' => 'Player Series Alnico 5 Single-Coil',
                    'scale_length' => 34,
                    'left_handed' => false
                ]
            ],

            // 13. Ibanez SR500E
            [
                'name' => 'Ibanez SR500E',
                'description' => [
                    'en' => 'Modern bass with thin neck and active electronics.',
                    'ru' => 'Современный бас с тонким грифом и активной электроникой.'
                ],
                'price' => 79900,
                'category' => 'guitars',
                'subcategory' => 'bass',
                'brand' => 'Ibanez',
                'images' => ['guitars/ibanez_sr500e_brown_mahogany.jpg'],
                'specs' => [
                    'color' => 'Brown Mahogany',
                    'body_shape' => 'SR',
                    'strings' => 4,
                    'body_material' => 'Okoume',
                    'neck_material' => '5pc Jatoba/Walnut',
                    'pickups' => 'Bartolini BH2',
                    'scale_length' => 34,
                    'left_handed' => false
                ]
            ],

            // 14. Ibanez BTB846SC
            [
                'name' => 'Ibanez BTB846SC',
                'description' => [
                    'en' => '6-string bass with deep and rich tone.',
                    'ru' => '6-струнный бас с глубоким и насыщенным звучанием.'
                ],
                'price' => 149900,
                'category' => 'guitars',
                'subcategory' => 'bass',
                'brand' => 'Ibanez',
                'images' => ['guitars/ibanez_btb846sc_natural_low_gloss.jpg'],
                'specs' => [
                    'color' => 'Natural Low Gloss',
                    'body_shape' => 'BTB',
                    'strings' => 6,
                    'body_material' => 'Mahogany/Walnut',
                    'neck_material' => '5pc Maple/Walnut',
                    'pickups' => 'T-1',
                    'scale_length' => 35,
                    'left_handed' => false
                ]
            ],

            // 15. Yamaha C40 (классика)
            [
                'name' => 'Yamaha C40II',
                'description' => [
                    'en' => 'Popular classical guitar for beginners.',
                    'ru' => 'Популярная классическая гитара для начинающих.'
                ],
                'price' => 14990,
                'category' => 'guitars',
                'subcategory' => 'classical',
                'brand' => 'Yamaha',
                'images' => ['guitars/yamaha_c40ii.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Classical',
                    'strings' => 6,
                    'body_material' => 'Spruce Top / Meranti Back & Sides',
                    'neck_material' => 'Nato',
                    'electronics' => false,
                    'scale_length' => 650,
                    'left_handed' => false
                ]
            ],

            // 16. Cordoba C5 (классика)
            [
                'name' => 'Cordoba C5 Lefty',
                'description' => [
                    'en' => 'Left-handed classical guitar with cedar top.',
                    'ru' => 'Классическая гитара для левшей с верхней декой из кедра.'
                ],
                'price' => 39900,
                'category' => 'guitars',
                'subcategory' => 'classical',
                'brand' => 'Cordoba',
                'images' => ['guitars/cordoba_c5.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Classical',
                    'strings' => 6,
                    'body_material' => 'Cedar Top / Mahogany Back & Sides',
                    'neck_material' => 'Mahogany',
                    'electronics' => false,
                    'scale_length' => 650,
                    'left_handed' => true
                ]
            ],

            // 17. Alhambra 3C
            [
                'name' => 'Alhambra 3C',
                'description' => [
                    'en' => 'Spanish classical guitar with excellent sound.',
                    'ru' => 'Испанская классическая гитара с отличным звучанием.'
                ],
                'price' => 69900,
                'category' => 'guitars',
                'subcategory' => 'classical',
                'brand' => 'Alhambra',
                'images' => ['guitars/alhambra_3c.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Classical',
                    'strings' => 6,
                    'body_material' => 'Cedar Top / Mahogany Back & Sides',
                    'neck_material' => 'Mahogany',
                    'electronics' => false,
                    'scale_length' => 650,
                    'left_handed' => false
                ]
            ],

            // 18. La Patrie Concert
            [
                'name' => 'La Patrie Concert',
                'description' => [
                    'en' => 'Canadian classical guitar with rich tone.',
                    'ru' => 'Канадская классическая гитара с насыщенным звучанием.'
                ],
                'price' => 54900,
                'category' => 'guitars',
                'subcategory' => 'classical',
                'brand' => 'La Patrie',
                'images' => ['guitars/la_patrie_concert.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Classical',
                    'strings' => 6,
                    'body_material' => 'Solid Cedar Top / Wild Cherry Back & Sides',
                    'neck_material' => 'Mahogany',
                    'electronics' => false,
                    'scale_length' => 650,
                    'left_handed' => false
                ]
            ],

            // 19. Kala KA-15S (укулеле)
            [
                'name' => 'Kala KA-15S',
                'description' => [
                    'en' => 'Popular soprano ukulele for beginners.',
                    'ru' => 'Популярная укулеле сопрано для начинающих.'
                ],
                'price' => 6990,
                'category' => 'guitars',
                'subcategory' => 'ukulele',
                'brand' => 'Kala',
                'images' => ['guitars/kala_ka15s.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Soprano',
                    'strings' => 4,
                    'body_material' => 'Mahogany',
                    'neck_material' => 'Mahogany',
                    'electronics' => false,
                    'scale_length' => 34,
                    'left_handed' => false
                ]
            ],

            // 20. Lanikai LU-11
            [
                'name' => 'Lanikai LU-11',
                'description' => [
                    'en' => 'Concert ukulele with warm tone.',
                    'ru' => 'Укулеле концерт с теплым звучанием.'
                ],
                'price' => 5990,
                'category' => 'guitars',
                'subcategory' => 'ukulele',
                'brand' => 'Lanikai',
                'images' => ['guitars/lanikai_lu11.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Concert',
                    'strings' => 4,
                    'body_material' => 'Nato',
                    'neck_material' => 'Nato',
                    'electronics' => false,
                    'scale_length' => 38,
                    'left_handed' => false
                ]
            ],

            // 21. Ohana CK-32
            [
                'name' => 'Ohana CK-32 Concert',
                'description' => [
                    'en' => 'Soprano ukulele with bright sound.',
                    'ru' => 'Укулеле сопрано с ярким звучанием.'
                ],
                'price' => 8490,
                'category' => 'guitars',
                'subcategory' => 'ukulele',
                'brand' => 'Ohana',
                'images' => ['guitars/ohana_ck-32.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Soprano',
                    'strings' => 4,
                    'body_material' => 'Mahogany',
                    'neck_material' => 'Mahogany',
                    'electronics' => false,
                    'scale_length' => 34,
                    'left_handed' => false
                ]
            ],

            // 22. Cordoba 20TM
            [
                'name' => 'Cordoba 20TM',
                'description' => [
                    'en' => 'Tenor ukulele with rich tone and beautiful design.',
                    'ru' => 'Тенор укулеле с насыщенным звучанием и красивым дизайном.'
                ],
                'price' => 24900,
                'category' => 'guitars',
                'subcategory' => 'ukulele',
                'brand' => 'Cordoba',
                'images' => ['guitars/cordoba_20tm.jpg'],
                'specs' => [
                    'color' => 'Natural',
                    'body_shape' => 'Tenor',
                    'strings' => 4,
                    'body_material' => 'Mahogany',
                    'neck_material' => 'Mahogany',
                    'electronics' => false,
                    'scale_length' => 43,
                    'left_handed' => false
                ]
            ]
        ];

        Item::insert($guitars);
    }
}