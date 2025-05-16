<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KeyboardsSeeder extends Seeder
{
    public function run()
    {
        $keyboards = [
            // ==================== Цифровые пианино (6 шт) ====================
            [
                'name' => 'Yamaha YDP-145R Arius',
                'description' => [
                    'en' => 'Digital piano with 88-key GHS keyboard, 10 voices and 192-note polyphony. Rosewood finish.',
                    'ru' => 'Цифровое пианино с 88 клавишами GHS, 10 тембрами и полифонией 192 ноты. Отделка под палисандр.'
                ],
                'price' => 85000,
                'category' => 'keyboards',
                'subcategory' => 'digital_pianos',
                'brand' => 'Yamaha',
                'images' => ['keyboards/yamaha_ydp145r_rosewood.jpg'],
                'specs' => [
                    'keys' => 88,
                    'key_mechanism' => 'Graded Hammer Standard (GHS)',
                    'polyphony' => 192,
                    'voices' => 10,
                    'speakers_power' => '16W (8W x 2)',
                    'dimensions' => '135.7 x 42.2 x 81.5 cm',
                    'weight' => 38,
                    'color' => 'Rosewood'
                ]
            ],
            [
                'name' => 'Yamaha Arius YDP-S35',
                'description' => [
                    'en' => 'Slim digital piano with GH3 keyboard and CFX sound engine.',
                    'ru' => 'Тонкое цифровое пианино с клавиатурой GH3 и звуком CFX.'
                ],
                'price' => 160000,
                'category' => 'keyboards',
                'subcategory' => 'digital_pianos',
                'brand' => 'Yamaha',
                'images' => ['keyboards/yamaha_ydps35_black.jpg'],
                'specs' => [
                    'keys' => 88,
                    'key_mechanism' => 'GH3',
                    'polyphony' => 192,
                    'voices' => 10,
                    'speakers_power' => '16W (8W x 2)',
                    'dimensions' => '135.3 x 29.6 x 79.2 cm',
                    'weight' => 35.9,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Roland RP701',
                'description' => [
                    'en' => 'Premium digital piano with PHA-4 keyboard and unlimited polyphony.',
                    'ru' => 'Премиальное цифровое пианино с клавиатурой PHA-4 и неограниченной полифонией.'
                ],
                'price' => 145000,
                'category' => 'keyboards',
                'subcategory' => 'digital_pianos',
                'brand' => 'Roland',
                'images' => ['keyboards/roland_rp701_white.jpg'],
                'specs' => [
                    'keys' => 88,
                    'key_mechanism' => 'PHA-4 Standard',
                    'polyphony' => 'unlimited',
                    'voices' => 324,
                    'speakers_power' => '24W (12W x 2)',
                    'dimensions' => '137.7 x 46.8 x 103 cm',
                    'weight' => 46,
                    'color' => 'White'
                ]
            ],
            [
                'name' => 'Roland F107',
                'description' => [
                    'en' => 'Compact digital piano with PHA-4 keyboard and Bluetooth.',
                    'ru' => 'Компактное цифровое пианино с клавиатурой PHA-4 и Bluetooth.'
                ],
                'price' => 120000,
                'category' => 'keyboards',
                'subcategory' => 'digital_pianos',
                'brand' => 'Roland',
                'images' => ['keyboards/roland_f107_black.jpg'],
                'specs' => [
                    'keys' => 88,
                    'key_mechanism' => 'PHA-4 Standard',
                    'polyphony' => 'unlimited',
                    'voices' => 15,
                    'speakers_power' => '16W (8W x 2)',
                    'dimensions' => '136.1 x 34.5 x 77.7 cm',
                    'weight' => 34.5,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Casio CDP-S100',
                'description' => [
                    'en' => 'Portable digital piano with 88 weighted keys and USB audio.',
                    'ru' => 'Портативное цифровое пианино с 88 взвешенными клавишами и USB-аудио.'
                ],
                'price' => 30000,
                'category' => 'keyboards',
                'subcategory' => 'digital_pianos',
                'brand' => 'Casio',
                'images' => ['keyboards/casio_cdps100_black.jpg'],
                'specs' => [
                    'keys' => 88,
                    'key_mechanism' => 'Scaled Hammer Action II',
                    'polyphony' => 64,
                    'voices' => 10,
                    'speakers_power' => '16W (8W x 2)',
                    'dimensions' => '132.2 x 23.2 x 9.9 cm',
                    'weight' => 10.5,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Kawai CN-29',
                'description' => [
                    'en' => 'Digital piano with RHIII keyboard and SK-EX concert grand sound.',
                    'ru' => 'Цифровое пианино с клавиатурой RHIII и звуком концертного рояля SK-EX.'
                ],
                'price' => 110000,
                'category' => 'keyboards',
                'subcategory' => 'digital_pianos',
                'brand' => 'Kawai',
                'images' => ['keyboards/kawai_cn29.jpg'],
                'specs' => [
                    'keys' => 88,
                    'key_mechanism' => 'RHIII',
                    'polyphony' => 192,
                    'voices' => 19,
                    'speakers_power' => '40W (20W x 2)',
                    'dimensions' => '136 x 45 x 81 cm',
                    'weight' => 48,
                    'color' => 'Rosewood'
                ]
            ],

            // ==================== Синтезаторы (6 шт) ====================
            [
                'name' => 'Korg Minilogue XD',
                'description' => [
                    'en' => 'Analog polyphonic synth with digital effects and sequencer.',
                    'ru' => 'Аналоговый полифонический синтезатор с цифровыми эффектами и секвенсором.'
                ],
                'price' => 62000,
                'category' => 'keyboards',
                'subcategory' => 'synthesizers',
                'brand' => 'Korg',
                'images' => ['keyboards/korg_minilogue_xd.jpg'],
                'specs' => [
                    'keys' => 37,
                    'key_type' => 'slim',
                    'polyphony' => 4,
                    'oscillators' => '2VCO + Digital Multi-Engine',
                    'effects' => ['delay', 'reverb', 'modulation'],
                    'connectivity' => ['USB', 'MIDI', 'audio_out'],
                    'weight' => 2.8,
                    'color' => 'Dark Gray'
                ]
            ],
            [
                'name' => 'Korg Volca Keys',
                'description' => [
                    'en' => 'Compact analog synth with 27 keys and built-in sequencer.',
                    'ru' => 'Компактный аналоговый синтезатор с 27 клавишами и секвенсором.'
                ],
                'price' => 12000,
                'category' => 'keyboards',
                'subcategory' => 'synthesizers',
                'brand' => 'Korg',
                'images' => ['keyboards/korg_volca_keys.jpg'],
                'specs' => [
                    'keys' => 27,
                    'key_type' => 'mini',
                    'polyphony' => 3,
                    'oscillators' => 1,
                    'effects' => 'delay',
                    'connectivity' => ['audio_out', 'sync'],
                    'weight' => 0.377,
                    'color' => 'White'
                ]
            ],
            [
                'name' => 'Arturia MicroFreak',
                'description' => [
                    'en' => 'Hybrid synth with capacitive keyboard and multiple oscillators.',
                    'ru' => 'Гибридный синтезатор с сенсорной клавиатурой и множеством осцилляторов.'
                ],
                'price' => 35000,
                'category' => 'keyboards',
                'subcategory' => 'synthesizers',
                'brand' => 'Arturia',
                'images' => ['keyboards/arturia_microfreak.jpg'],
                'specs' => [
                    'keys' => 25,
                    'key_type' => 'capacitive',
                    'polyphony' => 2,
                    'oscillators' => 11,
                    'effects' => 'digital',
                    'connectivity' => ['USB', 'MIDI', 'CV/Gate'],
                    'weight' => 1.02,
                    'color' => 'White'
                ]
            ],
            [
                'name' => 'Arturia MiniBrute 2',
                'description' => [
                    'en' => 'Analog synth with Steiner-Parker filter and patch matrix.',
                    'ru' => 'Аналоговый синтезатор с фильтром Steiner-Parker и патч-матрицей.'
                ],
                'price' => 55000,
                'category' => 'keyboards',
                'subcategory' => 'synthesizers',
                'brand' => 'Arturia',
                'images' => ['keyboards/arturia_minibrute2.jpg'],
                'specs' => [
                    'keys' => 25,
                    'key_type' => 'slim',
                    'polyphony' => 1,
                    'oscillators' => 1,
                    'effects' => 'none',
                    'connectivity' => ['MIDI', 'CV/Gate'],
                    'weight' => 4.82,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Moog Grandmother',
                'description' => [
                    'en' => 'Semi-modular analog synth with vintage sound and patch bay.',
                    'ru' => 'Полумодульный аналоговый синтезатор с винтажным звучанием.'
                ],
                'price' => 95000,
                'category' => 'keyboards',
                'subcategory' => 'synthesizers',
                'brand' => 'Moog',
                'images' => ['keyboards/moog_grandmother.jpg'],
                'specs' => [
                    'keys' => 32,
                    'key_type' => 'full_size',
                    'polyphony' => 1,
                    'oscillators' => 1,
                    'effects' => 'spring_reverb',
                    'connectivity' => ['MIDI', 'CV/Gate'],
                    'weight' => 7.25,
                    'color' => 'Multicolor'
                ]
            ],
            [
                'name' => 'Behringer DeepMind 12',
                'description' => [
                    'en' => 'Analog synth with 12 voices and built-in effects.',
                    'ru' => 'Аналоговый синтезатор с 12 голосами и встроенными эффектами.'
                ],
                'price' => 65000,
                'category' => 'keyboards',
                'subcategory' => 'synthesizers',
                'brand' => 'Behringer',
                'images' => ['keyboards/behringer_deepmind12.jpg'],
                'specs' => [
                    'keys' => 49,
                    'key_type' => 'semi-weighted',
                    'polyphony' => 12,
                    'oscillators' => 2,
                    'effects' => ['reverb', 'delay', 'chorus'],
                    'connectivity' => ['USB', 'MIDI'],
                    'weight' => 7.5,
                    'color' => 'Black'
                ]
            ],

            // ==================== MIDI-контроллеры (6 шт) ====================
            [
                'name' => 'Arturia KeyLab Essential 49',
                'description' => [
                    'en' => '49-key MIDI controller with DAW integration.',
                    'ru' => '49-клавишный MIDI-контроллер с интеграцией в DAW.'
                ],
                'price' => 18000,
                'category' => 'keyboards',
                'subcategory' => 'midi_controllers',
                'brand' => 'Arturia',
                'images' => ['keyboards/arturia_keylab_essential_49.jpg'],
                'specs' => [
                    'keys' => 49,
                    'key_type' => 'semi-weighted',
                    'pads' => 8,
                    'knobs' => 9,
                    'faders' => 9,
                    'connectivity' => ['USB', 'MIDI'],
                    'weight' => 2.2,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Arturia KeyStep',
                'description' => [
                    'en' => 'Compact MIDI controller with sequencer and arpeggiator.',
                    'ru' => 'Компактный MIDI-контроллер с секвенсором и арпеджиатором.'
                ],
                'price' => 19000,
                'category' => 'keyboards',
                'subcategory' => 'midi_controllers',
                'brand' => 'Arturia',
                'images' => ['keyboards/arturia_keystep.jpg'],
                'specs' => [
                    'keys' => 32,
                    'key_type' => 'slim',
                    'pads' => 0,
                    'knobs' => 4,
                    'faders' => 0,
                    'connectivity' => ['USB', 'MIDI'],
                    'weight' => 1.3,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Akai MPK Mini MK3',
                'description' => [
                    'en' => 'Ultra-portable MIDI controller with 25 keys and 8 pads.',
                    'ru' => 'Ультрапортативный MIDI-контроллер с 25 клавишами и 8 пэдами.'
                ],
                'price' => 15000,
                'category' => 'keyboards',
                'subcategory' => 'midi_controllers',
                'brand' => 'Akai',
                'images' => ['keyboards/akai_mpkmini_mk3.jpg'],
                'specs' => [
                    'keys' => 25,
                    'key_type' => 'synth',
                    'pads' => 8,
                    'knobs' => 8,
                    'faders' => 0,
                    'connectivity' => 'USB',
                    'weight' => 0.75,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Akai MPK249',
                'description' => [
                    'en' => 'Professional MIDI controller with 49 keys and 16 pads.',
                    'ru' => 'Профессиональный MIDI-контроллер с 49 клавишами и 16 пэдами.'
                ],
                'price' => 45000,
                'category' => 'keyboards',
                'subcategory' => 'midi_controllers',
                'brand' => 'Akai',
                'images' => ['keyboards/akai_mpk249.jpg'],
                'specs' => [
                    'keys' => 49,
                    'key_type' => 'semi-weighted',
                    'pads' => 16,
                    'knobs' => 8,
                    'faders' => 8,
                    'connectivity' => ['USB', 'MIDI'],
                    'weight' => 5.7,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Native Instruments Komplete Kontrol S61',
                'description' => [
                    'en' => '61-key smart keyboard with NI software integration.',
                    'ru' => '61-клавишная клавиатура с интеграцией в софт Native Instruments.'
                ],
                'price' => 68000,
                'category' => 'keyboards',
                'subcategory' => 'midi_controllers',
                'brand' => 'Native Instruments',
                'images' => ['keyboards/ni_s61mk2.jpg'],
                'specs' => [
                    'keys' => 61,
                    'key_type' => 'weighted',
                    'pads' => 0,
                    'knobs' => 8,
                    'faders' => 0,
                    'connectivity' => ['USB', 'MIDI'],
                    'weight' => 6.55,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Novation Launchkey 49',
                'description' => [
                    'en' => 'MIDI controller optimized for Ableton Live.',
                    'ru' => 'MIDI-контроллер, оптимизированный для Ableton Live.'
                ],
                'price' => 32000,
                'category' => 'keyboards',
                'subcategory' => 'midi_controllers',
                'brand' => 'Novation',
                'images' => ['keyboards/novation_launchkey49.jpg'],
                'specs' => [
                    'keys' => 49,
                    'key_type' => 'synth',
                    'pads' => 16,
                    'knobs' => 8,
                    'faders' => 9,
                    'connectivity' => ['USB', 'MIDI'],
                    'weight' => 3,
                    'color' => 'Black'
                ]
            ],

            // ==================== Акустические пианино (4 шт) ====================
            [
                'name' => 'Yamaha U1',
                'description' => [
                    'en' => 'Professional upright piano with rich sound.',
                    'ru' => 'Профессиональное вертикальное пианино с насыщенным звуком.'
                ],
                'price' => 550000,
                'category' => 'keyboards',
                'subcategory' => 'acoustic_pianos',
                'brand' => 'Yamaha',
                'images' => ['keyboards/yamaha_u1_black.jpg'],
                'specs' => [
                    'keys' => 88,
                    'action' => 'Yamaha Premium',
                    'pedals' => 3,
                    'dimensions' => '153 x 61 x 121 cm',
                    'weight' => 228,
                    'color' => 'Polished Ebony'
                ]
            ],
            [
                'name' => 'Yamaha YUS3',
                'description' => [
                    'en' => 'High-end upright piano with premium components.',
                    'ru' => 'Флагманское вертикальное пианино с премиальными компонентами.'
                ],
                'price' => 750000,
                'category' => 'keyboards',
                'subcategory' => 'acoustic_pianos',
                'brand' => 'Yamaha',
                'images' => ['keyboards/yamaha_yus3.jpg'],
                'specs' => [
                    'keys' => 88,
                    'action' => 'Yamaha Premium',
                    'pedals' => 3,
                    'dimensions' => '152 x 65 x 131 cm',
                    'weight' => 247,
                    'color' => 'Polished Mahogany'
                ]
            ],
            [
                'name' => 'Kawai K-15E',
                'description' => [
                    'en' => 'Compact upright piano with elegant design.',
                    'ru' => 'Компактное вертикальное пианино с элегантным дизайном.'
                ],
                'price' => 750000,
                'category' => 'keyboards',
                'subcategory' => 'acoustic_pianos',
                'brand' => 'Kawai',
                'images' => ['keyboards/kawai_k-15e.jpg'],
                'specs' => [
                    'keys' => 88,
                    'action' => 'Kawai Premium',
                    'pedals' => 3,
                    'dimensions' => '149 x 110 x 59 cm',
                    'weight' => 196,
                    'color' => 'White Polish'
                ]
            ],
            [
                'name' => 'Kawai K-300',
                'description' => [
                    'en' => 'Advanced upright piano with Millennium III action.',
                    'ru' => 'Продвинутое вертикальное пианино с механикой Millennium III.'
                ],
                'price' => 1100000,
                'category' => 'keyboards',
                'subcategory' => 'acoustic_pianos',
                'brand' => 'Kawai',
                'images' => ['keyboards/kawai_k300_black.jpg'],
                'specs' => [
                    'keys' => 88,
                    'action' => 'Millennium III',
                    'pedals' => 3,
                    'dimensions' => '149 x 61 x 122 cm',
                    'weight' => 227,
                    'color' => 'Ebonized Polish'
                ]
            ]
        ];

        Item::insert($keyboards);
    }
}