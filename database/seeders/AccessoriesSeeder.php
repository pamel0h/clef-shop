<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccessoriesSeeder extends Seeder
{
    public function run()
    {
        $accessories = [
            // Аксессуары для гитары (10 шт)
            [
                'name' => 'Fender FA-1225 Dreadnought Gig Bag',
                'description' => [
                    'en' => 'Gig bag for acoustic guitar Fender FA-1225 Dreadnought',
                    'ru' => 'Чехол для акустической гитары Fender FA-1225 Dreadnought'
                ],
                'price' => 3500,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'Fender',
                'images' =>['/accessories/fender_gigbag.jpg'],
                'specs' => [
                    'type' => 'Gig Bag',
                    'guitar_type' => 'Dreadnought',
                    'material' => 'Nylon',
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Dunlop Tortex Standard Guitar Picks .88mm (12-Pack)',
                'description' => [
                    'en' => 'Guitar picks Dunlop Tortex Standard, thickness .88mm, pack of 12',
                    'ru' => 'Медиаторы для гитары Dunlop Tortex Standard, толщина .88mm, в упаковке 12 штук'
                ],
                'price' => 550,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'Dunlop',
                'images' =>['/accessories/dunlop_tortex.jpg'],
                'specs' => [
                    'type' => 'Picks',
                    'material' => 'Tortex',
                    'thickness' => '0.88mm',
                    'color' => 'Green',
                    'quantity' => 12
                ]
            ],
            [
                'name' => 'D\'Addario Acoustic Guitar Humidifier',
                'description' => [
                    'en' => 'Humidifier for acoustic guitar',
                    'ru' => 'Увлажнитель для акустической гитары'
                ],
                'price' => 1900,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'D\'Addario',
                'images' =>['/accessories/daddariohumidifier.jpg'],
                'specs' => [
                    'type' => 'Humidifier',
                    'instrument' => 'Acoustic Guitar',
                    'weight' => 0.1
                ]
            ],
            [
                'name' => 'D\'Addario Humidipak Two-Way Humidity Control System',
                'description' => [
                    'en' => 'Humidity control system for guitars',
                    'ru' => 'Система контроля влажности для гитар'
                ],
                'price' => 4500,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'D\'Addario',
                'images' =>['/accessories/daddario_humidipak.jpg'],
                'specs' => [
                    'type' => 'Humidifier',
                    'instrument' => 'Guitar',
                    'humidity_control' => 'Two-Way',
                    'refillable' => false,
                    'weight' => 0.4
                ]
            ],
            [
                'name' => 'Shubb C1 Nickel Capo for Steel String Guitars',
                'description' => [
                    'en' => 'Capo for steel string guitars',
                    'ru' => 'Каподастр для стальных струн гитар'
                ],
                'price' => 3800,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'Shubb',
                'images' =>['/accessories/shubb_capo.jpg'],
                'specs' => [
                    'type' => 'Capo',
                    'material' => 'Alloy Steel, Nickel',
                    'guitar_type' => 'Steel String',
                    'color' => 'Chrome',
                    'weight' => 2.4
                ]
            ],
            [
                'name' => 'Ernie Ball Guitar Polish Cloth',
                'description' => [
                    'en' => 'Guitar polishing cloth',
                    'ru' => 'Ткань для полировки гитары'
                ],
                'price' => 650,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'Ernie Ball',
                'images' =>['/accessories/ernieball_polishcloth.jpg'],
                'specs' => [
                    'type' => 'Polish Cloth',
                    'material' => 'Microfiber',
                    'color' => 'Gray',
                    'weight' => 0.02
                ]
            ],
            [
                'name' => 'Fender Tooled Leather Guitar Strap - Black',
                'description' => [
                    'en' => 'Adjustable guitar strap, black',
                    'ru' => 'Ремень для гитары, черный, регулируемая длина'
                ],
                'price' => 7200,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'Fender',
                'images' =>['/accessories/fender_strap_black.jpg'],
                'specs' => [
                    'type' => 'Strap',
                    'material' => 'Nylon',
                    'color' => 'Black',
                    'adjustable_length' => true,
                    'width' => '2 inches'
                ]
            ],
            [
                'name' => 'Ernie Ball 2221 Regular Slinky Electric Guitar Strings',
                'description' => [
                    'en' => 'Electric guitar strings, nickel plated steel, gauge .010 - .046',
                    'ru' => 'Струны для электрогитары, никелированная сталь, калибр .010 - .046'
                ],
                'price' => 800,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'Ernie Ball',
                'images' =>['/accessories/ernieball_slinky.jpg'],
                'specs' => [
                    'type' => 'Strings',
                    'instrument' => 'Electric Guitar',
                    'material' => 'Nickel Plated Steel',
                    'gauge' => '010-.046',
                    'quantity' => 6
                ]
            ],
            [
                'name' => 'Hercules GS414B Plus Guitar Stand',
                'description' => [
                    'en' => 'Floor guitar stand',
                    'ru' => 'Напольная подставка для гитары'
                ],
                'price' => 5800,
                'category' => 'accessories',
                'subcategory' => 'guitar_accessories',
                'brand' => 'Hercules',
                'images' =>['/accessories/hercules_stand.jpg'],
                'specs' => [
                    'type' => 'Guitar Stand',
                    'material' => 'Steel',
                    'adjustable_height' => true,
                    'weight_capacity' => '15 kg',
                    'weight' => 1.9
                ]
            ],

            // Аксессуары для клавишных (7 шт)
            [
                'name' => 'Yamaha PKBB1 Adjustable Keyboard Bench',
                'description' => [
                    'en' => 'Adjustable bench for keyboards',
                    'ru' => 'Регулируемая скамья для клавишных инструментов'
                ],
                'price' => 6500,
                'category' => 'accessories',
                'subcategory' => 'keyboard_accessories',
                'brand' => 'Yamaha',
                'images' =>['/accessories/yamaha_bench.jpg'],
                'specs' => [
                    'type' => 'Bench',
                    'material' => 'Vinyl',
                    'adjustable_height' => true,
                    'color' => 'Black',
                    'weight' => 6
                ]
            ],
            [
                'name' => 'RockJam KB100 Keyboard Bench',
                'description' => [
                    'en' => 'Adjustable keyboard bench',
                    'ru' => 'Регулируемая скамья для клавишных инструментов'
                ],
                'price' => 4500,
                'category' => 'accessories',
                'subcategory' => 'keyboard_accessories',
                'brand' => 'RockJam',
                'images' =>['/accessories/rockjam_bench.jpg'],
                'specs' => [
                    'type' => 'Bench',
                    'material' => 'Vinyl',
                    'adjustable_height' => true,
                    'color' => 'Black',
                    'weight' => 5.5
                ]
            ],
            [
                'name' => 'Casio Keyboard Dust Cover',
                'description' => [
                    'en' => 'Dust cover for keyboards and digital pianos',
                    'ru' => 'Чехол от пыли для синтезаторов и цифровых пианино'
                ],
                'price' => 2800,
                'category' => 'accessories',
                'subcategory' => 'keyboard_accessories',
                'brand' => 'Casio',
                'images' =>['/accessories/casiokeyboardcover.jpg'],
                'specs' => [
                    'type' => 'Dust Cover',
                    'keys' => '88',
                    'material' => 'Nylon',
                    'color' => 'Black',
                    'weight' => 0.3
                ]
            ],
            [
                'name' => 'Yamaha FC4A Sustain Pedal',
                'description' => [
                    'en' => 'Sustain pedal for keyboards',
                    'ru' => 'Педаль сустейна для клавишных инструментов'
                ],
                'price' => 3500,
                'category' => 'accessories',
                'subcategory' => 'keyboard_accessories',
                'brand' => 'Yamaha',
                'images' =>['/accessories/yamahafc4a.jpg'],
                'specs' => [
                    'type' => 'Sustain Pedal',
                    'connector' => '1/4 inch',
                    'weight' => 0.3
                ]
            ],
            [
                'name' => 'On-Stage Stands KS7150 Keyboard Stand',
                'description' => [
                    'en' => 'X-style keyboard stand',
                    'ru' => 'X-образная стойка для клавишных инструментов'
                ],
                'price' => 4000,
                'category' => 'accessories',
                'subcategory' => 'keyboard_accessories',
                'brand' => 'On-Stage Stands',
                'images' =>['/accessories/onstage_stand.jpg'],
                'specs' => [
                    'type' => 'Stand',
                    'material' => 'Steel',
                    'adjustable_height' => true,
                    'weight_capacity' => '59 kg',
                    'color' => 'Black',
                    'weight' => 4
                ]
            ],
            [
                'name' => 'Sustain Pedal Universal',
                'description' => [
                    'en' => 'Universal sustain pedal for keyboards',
                    'ru' => 'Универсальная педаль сустейна для клавишных инструментов'
                ],
                'price' => 2800,
                'category' => 'accessories',
                'subcategory' => 'keyboard_accessories',
                'brand' => 'Generic',
                'images' =>['/accessories/sustain_pedal.jpg'],
                'specs' => [
                    'type' => 'Pedal',
                    'polarity_switch' => true,
                    'cable_length' => '1.8 m',
                    'connector' => '1/4 inch',
                    'color' => 'Black',
                    'weight' => 0.4
                ]
            ],
            [
                'name' => 'Gator Cases GKB-88 SLIM Keyboard Gig Bag',
                'description' => [
                    'en' => 'Lightweight bag for 88-key keyboards',
                    'ru' => 'Легкий чехол для 88-клавишных клавишных инструментов'
                ],
                'price' => 7500,
                'category' => 'accessories',
                'subcategory' => 'keyboard_accessories',
                'brand' => 'Gator Cases',
                'images' =>['/accessories/gator_keyboard_bag.jpg'],
                'specs' => [
                    'type' => 'Gig Bag',
                    'keys' => '88',
                    'material' => 'Nylon',
                    'padding' => '10 mm',
                    'color' => 'Black',
                    'weight' => 3.2
                ]
            ],

            // Аксессуары для барабанов (8 шт)
            [
                'name' => 'ZILDJIAN Z5B 5B Drum Sticks',
                'description' => [
                    'en' => 'Drum sticks, hazel wood',
                    'ru' => 'Барабанные палочки, дерево орех'
                ],
                'price' => 2500,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'ZILDJIAN',
                'images' =>['/accessories/ZILDJIAN_Z5B_5B.jpg'],
                'specs' => [
                    'type' => 'Drum Sticks',
                    'material' => 'Hazel',
                    'size' => '5B',
                    'tip' => 'Wood',
                    'color' => 'Natural',
                    'weight' => 0.11
                ]
            ],
            [
                'name' => 'ProMark F5A Forward Balance Drumsticks',
                'description' => [
                    'en' => 'Drum sticks with forward balance',
                    'ru' => 'Барабанные палочки с балансом вперед'
                ],
                'price' => 1800,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'ProMark',
                'images' =>['/accessories/promarkf5a.jpg'],
                'specs' => [
                    'type' => 'Drum Sticks',
                    'material' => 'Hickory',
                    'size' => '5A',
                    'tip' => 'Wood',
                    'color' => 'Natural',
                    'weight' => 0.11
                ]
            ],
            [
                'name' => 'Remo Ambassador Coated Drum Head 14 inch',
                'description' => [
                    'en' => 'Drum head for snare drum, 14 inch',
                    'ru' => 'Пластик для малого барабана, 14 дюймов'
                ],
                'price' => 3800,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'Remo',
                'images' =>['/accessories/remo_ambassador.jpg'],
                'specs' => [
                    'type' => 'Drum Head',
                    'size' => '14 inch',
                    'ply' => '1-Ply',
                    'coating' => 'Coated',
                    'color' => 'White',
                    'weight' => 0.25
                ]
            ],
            [
                'name' => 'SX SZDS25A 5A Drum Sticks',
                'description' => [
                    'en' => 'Drum sticks, hickory wood',
                    'ru' => 'Барабанные палочки, дерево гикори'
                ],
                'price' => 1000,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'SX',
                'images' =>['/accessories/vicfirth_5a.jpg'],
                'specs' => [
                    'type' => 'Drum Sticks',
                    'material' => 'Hickory',
                    'size' => '5A',
                    'tip' => 'Wood',
                    'color' => 'Natural',
                    'weight' => 0.11
                ]
            ],
            [
                'name' => 'Evans G2 Coated Drum Head 12 inch',
                'description' => [
                    'en' => 'Drum head, 12 inch',
                    'ru' => 'Пластик для барабана, 12 дюймов'
                ],
                'price' => 3200,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'Evans',
                'images' =>['/accessories/evans_g2.jpg'],
                'specs' => [
                    'type' => 'Drum Head',
                    'size' => '12 inch',
                    'ply' => '2-Ply',
                    'coating' => 'Coated',
                    'color' => 'White',
                    'weight' => 0.2
                ]
            ],
            [
                'name' => 'Gibraltar 9608 Drum Throne',
                'description' => [
                    'en' => 'Drum throne',
                    'ru' => 'Барабанный стул'
                ],
                'price' => 12000,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'Gibraltar',
                'images' =>['/accessories/gibraltar_throne.jpg'],
                'specs' => [
                    'type' => 'Drum Throne',
                    'seat_type' => 'Round',
                    'height_adjustment' => 'Spindle',
                    'material' => 'Vinyl',
                    'color' => 'Black',
                    'weight' => 5
                ]
            ],
            [
                'name' => 'Meinl Drum Honey Gel Damper Pads',
                'description' => [
                    'en' => 'Gel dampers for drums and cymbals',
                    'ru' => 'Гелевые глушители для барабанов и тарелок'
                ],
                'price' => 2500,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'Meinl',
                'images' =>['/accessories/meinl_dampers.jpg'],
                'specs' => [
                    'type' => 'Dampers',
                    'material' => 'Gel',
                    'color' => 'Clear',
                    'reusable' => true,
                    'weight' => 0.05
                ]
            ],
            [
                'name' => 'Ahead Armor Cases Stick Bag',
                'description' => [
                    'en' => 'Drum stick bag',
                    'ru' => 'Сумка для барабанных палочек'
                ],
                'price' => 6800,
                'category' => 'accessories',
                'subcategory' => 'drum_accessories',
                'brand' => 'Ahead',
                'images' =>['/accessories/ahead_stickbag.jpg'],
                'specs' => [
                    'type' => 'Stick Bag',
                    'material' => '600 Denier Fabric',
                    'capacity' => '12+ pairs',
                    'color' => 'Black',
                    'mounting' => 'Floor Tom Hooks',
                    'weight' => 0.6
                ]
            ],

            // Аксессуары для аудиооборудования (4 шт)
            [
                'name' => 'On-Stage MS7701B Tripod Microphone Stand',
                'description' => [
                    'en' => 'Tripod microphone stand',
                    'ru' => 'Микрофонная стойка с треногой'
                ],
                'price' => 3200,
                'category' => 'accessories',
                'subcategory' => 'audio_accessories',
                'brand' => 'On-Stage',
                'images' =>['/accessories/onstage_micstand.jpg'],
                'specs' => [
                    'type' => 'Mic Stand',
                    'base_type' => 'Tripod',
                    'adjustable_height' => true,
                    'color' => 'Black',
                    'weight' => 2.1
                ]
            ],
            [
                'name' => 'Case for ATH-M50x',
                'description' => [
                    'en' => 'Hard case for ATH-M50x headphones',
                    'ru' => 'Жесткий чехол для наушников ATH-M50x'
                ],
                'price' => 3500,
                'category' => 'accessories',
                'subcategory' => 'audio_accessories',
                'brand' => 'Generic',
                'images' =>['/accessories/athm50x_case.jpg'],
                'specs' => [
                    'type' => 'Headphone Case',
                    'compatible_with' => 'ATH-M50x',
                    'material' => 'EVA',
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Rode PSA1 Professional Studio Arm',
                'description' => [
                    'en' => 'Boom microphone arm',
                    'ru' => 'Шарнирная стойка для микрофона'
                ],
                'price' => 12000,
                'category' => 'accessories',
                'subcategory' => 'audio_accessories',
                'brand' => 'Rode',
                'images' =>['/accessories/rode_psa1.jpg'],
                'specs' => [
                    'type' => 'Mic Arm',
                    'material' => 'Steel',
                    'weight_capacity' => '1.1 kg',
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Replacement Ear Pads',
                'description' => [
                    'en' => 'Replacement ear pads',
                    'ru' => 'Сменные амбушюры'
                ],
                'price' => 2000,
                'category' => 'accessories',
                'subcategory' => 'audio_accessories',
                'brand' => 'Generic',
                'images' =>['/accessories/replacement_earpads.jpg'],
                'specs' => [
                    'type' => 'Ear Pads',
                    'material' => 'Leatherette',
                    'color' => 'Black',
                    'compatible_with' => 'Various Headphones'
                ]
            ],

            // Общие аксессуары (2 шт)
            [
                'name' => 'Fender Clip-On Tuner',
                'description' => [
                    'en' => 'Chromatic clip-on tuner for guitar, bass, ukulele and violin',
                    'ru' => 'Хроматический клип-тюнер для гитары, баса, укулеле и скрипки'
                ],
                'price' => 2200,
                'category' => 'accessories',
                'subcategory' => 'general_accessories',
                'brand' => 'Fender',
                'images' =>['/accessories/fender_tuner.jpg'],
                'specs' => [
                    'type' => 'Tuner',
                    'display' => 'LCD',
                    'tuning_modes' => 'Chromatic, Guitar, Bass, Ukulele, Violin',
                    'color' => 'Black',
                    'weight' => 0.1,
                    'power' => 'Battery'
                ]
            ],
            [
                'name' => 'Korg MA-2 Metronome',
                'description' => [
                    'en' => 'Compact metronome',
                    'ru' => 'Компактный метроном'
                ],
                'price' => 2800,
                'category' => 'accessories',
                'subcategory' => 'general_accessories',
                'brand' => 'Korg',
                'images' =>['/accessories/korg_metronome.jpg'],
                'specs' => [
                    'type' => 'Metronome',
                    'tempo_range' => '30-252 bpm',
                    'beat' => '0-9',
                    'color' => 'Blue',
                    'weight' => 0.1,
                    'power' => 'Battery'
                ]
            ]
        ];

        Item::insert($accessories);
    }
}