<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AudioSeeder extends Seeder
{
    public function run()
    {
        $audioEquipment = [
            // ==================== Микрофоны (12 шт) ====================
            [
                'name' => 'Shure SM58 Vocal Microphone',
                'description' => [
                    'en' => 'Dynamic vocal microphone Shure SM58 with cardioid polar pattern',
                    'ru' => 'Динамический вокальный микрофон Shure SM58, кардиоидная диаграмма направленности'
                ],
                'price' => 12000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Shure',
                'images' => ['audio/shure_sm58.jpg'],
                'specs' => [
                    'type' => 'Vocal',
                    'element' => 'Dynamic',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '50Hz - 15kHz',
                    'connector' => 'XLR'
                ]
            ],
            [
                'name' => 'Rode NT-USB Mini USB Microphone',
                'description' => [
                    'en' => 'Condenser USB microphone Rode NT-USB Mini with cardioid polar pattern, built-in pop filter',
                    'ru' => 'Конденсаторный USB микрофон Rode NT-USB Mini, кардиоидная диаграмма направленности, встроенный поп-фильтр'
                ],
                'price' => 15000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Rode',
                'images' => ['audio/rode_ntusb_mini.jpg'],
                'specs' => [
                    'type' => 'USB',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '20Hz - 20kHz',
                    'connectivity' => 'USB'
                ]
            ],
            [
                'name' => 'Audio-Technica AT2020 Studio Microphone',
                'description' => [
                    'en' => 'Condenser studio microphone Audio-Technica AT2020 with cardioid polar pattern',
                    'ru' => 'Конденсаторный студийный микрофон Audio-Technica AT2020, кардиоидная диаграмма направленности'
                ],
                'price' => 18000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Audio-Technica',
                'images' => ['audio/at2020.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '20Hz - 20kHz',
                    'connector' => 'XLR'
                ]
            ],
            [
                'name' => 'AKG D112 MKII Instrument Microphone',
                'description' => [
                    'en' => 'Dynamic instrument microphone AKG D112 MKII, specially designed for bass drums',
                    'ru' => 'Динамический инструментальный микрофон AKG D112 MKII, специально разработан для бас-барабанов'
                ],
                'price' => 14000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'AKG',
                'images' => ['audio/akg_d112.jpg'],
                'specs' => [
                    'type' => 'Instrument',
                    'element' => 'Dynamic',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '20Hz - 17kHz',
                    'connector' => 'XLR'
                ]
            ],
            [
                'name' => 'Neumann TLM 103 Studio Microphone Light Nickel',
                'description' => [
                    'en' => 'Legendary studio microphone Neumann TLM 103 light nickel, cardioid pattern, low noise',
                    'ru' => 'Легендарный студийный микрофон Neumann TLM 103 светлый никелированный, кардиоидная диаграмма, низкий уровень шума'
                ],
                'price' => 120000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Neumann',
                'images' => ['audio/neumann_tlm103_l.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'color' => 'Light Nickel',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '20Hz - 20kHz',
                    'connector' => 'XLR',
                    'self_noise' => '7 dB-A'
                ]
            ],
            [
                'name' => 'Neumann TLM 103 Studio Microphone Black',
                'description' => [
                    'en' => 'Legendary studio microphone Neumann TLM 103 matte black, cardioid pattern, low noise',
                    'ru' => 'Легендарный студийный микрофон Neumann TLM 103 черный матовый, кардиоидная диаграмма, низкий уровень шума'
                ],
                'price' => 120000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Neumann',
                'images' => ['audio/neumann_tlm103_b.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'color' => 'Matte Black',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '20Hz - 20kHz',
                    'connector' => 'XLR',
                    'self_noise' => '7 dB-A'
                ]
            ],
            [
                'name' => 'Blue Yeti USB Microphone',
                'description' => [
                    'en' => 'Versatile USB microphone Blue Yeti with multiple polar patterns, built-in headphone amplifier',
                    'ru' => 'Универсальный USB микрофон Blue Yeti, несколько диаграмм направленности, встроенный усилитель для наушников'
                ],
                'price' => 14000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Blue Microphones',
                'images' => ['audio/blue_yeti.jpg'],
                'specs' => [
                    'type' => 'USB',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Cardioid, Bidirectional, Omnidirectional, Stereo',
                    'frequency_response' => '20Hz - 20kHz',
                    'connectivity' => 'USB',
                    'headphone_output' => true
                ]
            ],
            [
                'name' => 'Sennheiser e835 Vocal Microphone',
                'description' => [
                    'en' => 'Dynamic vocal microphone Sennheiser e835, cardioid pattern, durable body',
                    'ru' => 'Динамический вокальный микрофон Sennheiser e835, кардиоидная диаграмма, прочный корпус'
                ],
                'price' => 8500,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Sennheiser',
                'images' => ['audio/sennheiser_e835.jpg'],
                'specs' => [
                    'type' => 'Vocal',
                    'element' => 'Dynamic',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '40Hz - 16kHz',
                    'connector' => 'XLR'
                ]
            ],
            [
                'name' => 'Rode NTG5 Shotgun Microphone',
                'description' => [
                    'en' => 'Condenser shotgun microphone Rode NTG5, supercardioid pattern, lightweight',
                    'ru' => 'Конденсаторный микрофон-пушка Rode NTG5, суперкардиоидная диаграмма, легкий вес'
                ],
                'price' => 35000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Rode',
                'images' => ['audio/rode_ntg5.jpg'],
                'specs' => [
                    'type' => 'Shotgun',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Supercardioid',
                    'frequency_response' => '20Hz - 20kHz',
                    'connector' => 'XLR',
                    'weight' => '76g'
                ]
            ],
            [
                'name' => 'Shure Beta 52A Instrument Microphone',
                'description' => [
                    'en' => 'Dynamic instrument microphone Shure Beta 52A for bass drums and other low-frequency instruments',
                    'ru' => 'Динамический инструментальный микрофон Shure Beta 52A, для бас-барабанов и других низкочастотных инструментов'
                ],
                'price' => 17000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Shure',
                'images' => ['audio/shure_beta52a.jpg'],
                'specs' => [
                    'type' => 'Instrument',
                    'element' => 'Dynamic',
                    'polar_pattern' => 'Supercardioid',
                    'frequency_response' => '20Hz - 10kHz',
                    'connector' => 'XLR',
                    'presence_peak' => true
                ]
            ],
            [
                'name' => 'Lewitt LCT 440 Pure Condenser Microphone',
                'description' => [
                    'en' => 'Studio condenser microphone',
                    'ru' => 'Студийный конденсаторный микрофон'
                ],
                'price' => 30000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Lewitt',
                'images' => ['audio/lewitt_lct440_pure.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '20Hz - 20kHz',
                    'connector' => 'XLR'
                ]
            ],
            [
                'name' => 'Earthworks SR25 Instrument Microphone',
                'description' => [
                    'en' => 'Studio instrument microphone',
                    'ru' => 'Студийный инструментальный микрофон'
                ],
                'price' => 72000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Earthworks',
                'images' => ['audio/earthworks_sr25.jpg'],
                'specs' => [
                    'type' => 'Instrument',
                    'element' => 'Condenser',
                    'polar_pattern' => 'Cardioid',
                    'frequency_response' => '20Hz - 25kHz',
                    'connector' => 'XLR'
                ]
            ],
            [
                'name' => 'Avantone Pro CV-12 Tube Microphone',
                'description' => [
                    'en' => 'Tube studio microphone',
                    'ru' => 'Ламповый студийный микрофон'
                ],
                'price' => 48000,
                'category' => 'audio_equipment',
                'subcategory' => 'microphones',
                'brand' => 'Avantone Pro',
                'images' => ['audio/avantone_cv12.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'color' => 'Red',
                    'element' => 'Tube Condenser',
                    'polar_pattern' => '9 Switchable',
                    'frequency_response' => '20Hz - 20kHz',
                    'connector' => 'XLR'
                ]
            ],

            // ==================== Наушники (23 шт) ====================
            [
                'name' => 'Audio-Technica ATH-M50x Studio Headphones Black',
                'description' => [
                    'en' => 'Professional studio headphones Audio-Technica ATH-M50x black, closed-back, 15-28000 Hz',
                    'ru' => 'Профессиональные студийные наушники Audio-Technica ATH-M50x черные, закрытый тип, 15-28000 Гц'
                ],
                'price' => 18000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Audio-Technica',
                'images' => ['audio/athm50x.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'color' => 'Black',
                    'design' => 'Closed-back',
                    'frequency_response' => '15Hz - 28kHz',
                    'impedance' => '38 Ohms',
                    'cable_length' => '3m'
                ]
            ],
            [
                'name' => 'Audio-Technica ATH-M50x Studio Headphones White',
                'description' => [
                    'en' => 'Professional studio headphones Audio-Technica ATH-M50x white, closed-back, 15-28000 Hz',
                    'ru' => 'Профессиональные студийные наушники Audio-Technica ATH-M50x белые, закрытый тип, 15-28000 Гц'
                ],
                'price' => 18000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Audio-Technica',
                'images' => ['audio/athm50x_w.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'color' => 'White',
                    'design' => 'Closed-back',
                    'frequency_response' => '15Hz - 28kHz',
                    'impedance' => '38 Ohms',
                    'cable_length' => '3m'
                ]
            ],
            [
                'name' => 'Beyerdynamic DT 770 PRO Monitoring Headphones',
                'description' => [
                    'en' => 'Professional monitoring headphones Beyerdynamic DT 770 PRO, closed-back, 80 Ohm',
                    'ru' => 'Профессиональные мониторные наушники Beyerdynamic DT 770 PRO, закрытый тип, 80 Ом'
                ],
                'price' => 22000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Beyerdynamic',
                'images' => ['audio/dt770pro.jpg'],
                'specs' => [
                    'type' => 'Monitoring',
                    'design' => 'Closed-back',
                    'frequency_response' => '5Hz - 35kHz',
                    'impedance' => '80 Ohms',
                    'cable_length' => '3m'
                ]
            ],
            [
                'name' => 'Sony WH-1000XM5 Wireless Headphones Black',
                'description' => [
                    'en' => 'Wireless black headphones with noise cancellation',
                    'ru' => 'Беспроводные черные наушники с шумоподавлением'
                ],
                'price' => 35000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Sony',
                'images' => ['audio/sony_wh1000xm5_b.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'color' => 'Black',
                    'frequency_response' => '4Hz - 40kHz',
                    'impedance' => '48 Ohms',
                    'bluetooth' => '5.2',
                    'noise_cancelling' => true
                ]
            ],
            [
                'name' => 'Sony WH-1000XM5 Wireless Headphones Silver',
                'description' => [
                    'en' => 'Wireless silver headphones with noise cancellation',
                    'ru' => 'Беспроводные серебристые наушники с шумоподавлением'
                ],
                'price' => 35000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Sony',
                'images' => ['audio/sony_wh1000xm5_s.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'color' => 'Silver',
                    'frequency_response' => '4Hz - 40kHz',
                    'impedance' => '48 Ohms',
                    'bluetooth' => '5.2',
                    'noise_cancelling' => true
                ]
            ],
            [
                'name' => 'Sony WH-1000XM5 Wireless Headphones Blue',
                'description' => [
                    'en' => 'Wireless blue headphones with noise cancellation',
                    'ru' => 'Беспроводные синие наушники с шумоподавлением'
                ],
                'price' => 35000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Sony',
                'images' => ['audio/sony_wh1000xm5_blue.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'color' => 'Blue',
                    'frequency_response' => '4Hz - 40kHz',
                    'impedance' => '48 Ohms',
                    'bluetooth' => '5.2',
                    'noise_cancelling' => true
                ]
            ],
            [
                'name' => 'Sennheiser HD 660 S Open-Back Headphones',
                'description' => [
                    'en' => 'Open-back headphones',
                    'ru' => 'Открытые наушники'
                ],
                'price' => 45000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Sennheiser',
                'images' => ['audio/sennheiser_hd660s.jpg'],
                'specs' => [
                    'type' => 'Open-Back',
                    'design' => 'Open-back',
                    'frequency_response' => '10Hz - 41kHz',
                    'impedance' => '150 Ohms',
                    'cable_length' => '3m'
                ]
            ],
            [
                'name' => 'Beyerdynamic DT 990 Pro Open-Back Headphones',
                'description' => [
                    'en' => 'Open-back headphones for mixing and mastering',
                    'ru' => 'Открытые наушники для сведения и мастеринга'
                ],
                'price' => 24000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Beyerdynamic',
                'images' => ['audio/dt990pro.jpg'],
                'specs' => [
                    'type' => 'Open-Back',
                    'design' => 'Open-back',
                    'frequency_response' => '5Hz - 35kHz',
                    'impedance' => '250 Ohms',
                    'cable_length' => '3m'
                ]
            ],
            [
                'name' => 'Sennheiser HD 280 PRO Closed-Back Headphones',
                'description' => [
                    'en' => 'Closed-back headphones for monitoring',
                    'ru' => 'Закрытые наушники для мониторинга'
                ],
                'price' => 12000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Sennheiser',
                'images' => ['audio/hd280pro.jpg'],
                'specs' => [
                    'type' => 'Closed-back',
                    'design' => 'Closed-back',
                    'frequency_response' => '8Hz - 25kHz',
                    'impedance' => '64 Ohms',
                    'cable_length' => '3m'
                ]
            ],
            [
                'name' => 'Sony MDR-7506 Studio Headphones',
                'description' => [
                    'en' => 'Headphones for professional audio monitoring',
                    'ru' => 'Наушники для профессионального мониторинга звука'
                ],
                'price' => 14000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Sony',
                'images' => ['audio/mdr7506.jpg'],
                'specs' => [
                    'type' => 'Studio',
                    'design' => 'Closed-back',
                    'frequency_response' => '10Hz - 20kHz',
                    'impedance' => '63 Ohms',
                    'cable_length' => '3m'
                ]
            ],
            [
                'name' => 'Audeze LCD-X Open-Back Headphones',
                'description' => [
                    'en' => 'Open-back headphones',
                    'ru' => 'Открытые наушники'
                ],
                'price' => 145000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Audeze',
                'images' => ['audio/audeze_lcdx.jpg'],
                'specs' => [
                    'type' => 'Open-Back',
                    'design' => 'Open-back',
                    'frequency_response' => '10Hz - 50kHz',
                    'impedance' => '20 Ohms',
                    'transducer_size' => 'Planar Magnetic'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Silver)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in silver color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в серебристом цвете'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_s.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Silver'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Black)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in black color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в черном цвете'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_black.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Black'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Blue)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in blue color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в синем цвете'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_blue.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Blue'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Green)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in green color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в зеленом цвете'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_green.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Green'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Midnight)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in Midnight color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в цвете Midnight'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_midnight.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Midnight'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Orange)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in orange color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в оранжевом цвете'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_orange.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Orange'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Pink)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in pink color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в розовом цвете'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_pink.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Pink'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Purple)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in purple color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в фиолетовом цвете'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_purple.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Purple'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Sierra Blue)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in Sierra Blue color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в цвете Sierra Blue'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_sierra_blue.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Sierra Blue'
                ]
            ],
            [
                'name' => 'Apple AirPods Max Wireless Headphones (Starlight)',
                'description' => [
                    'en' => 'Wireless noise-cancelling headphones in Starlight color',
                    'ru' => 'Беспроводные наушники с шумоподавлением в цвете Starlight'
                ],
                'price' => 78000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Apple',
                'images' => ['audio/airpods_max_starlight.jpg'],
                'specs' => [
                    'type' => 'Wireless',
                    'design' => 'Closed-back',
                    'noise_cancelling' => true,
                    'spatial_audio' => true,
                    'color' => 'Starlight'
                ]
            ],
            [
                'name' => 'Meze 99 Classics Closed-Back Headphones Gold',
                'description' => [
                    'en' => 'Closed-back headphones',
                    'ru' => 'Закрытые наушники'
                ],
                'price' => 33000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Meze',
                'images' => ['audio/meze99classics_g.jpg'],
                'specs' => [
                    'type' => 'Closed-back',
                    'color' => 'Gold',
                    'design' => 'Closed-back',
                    'frequency_response' => '15Hz - 25kHz',
                    'impedance' => '32 Ohms',
                    'cable_length' => '1.2m'
                ]
            ],
            [
                'name' => 'Meze 99 Classics Closed-Back Headphones Silver',
                'description' => [
                    'en' => 'Closed-back headphones',
                    'ru' => 'Закрытые наушники'
                ],
                'price' => 33000,
                'category' => 'audio_equipment',
                'subcategory' => 'headphones',
                'brand' => 'Meze',
                'images' => ['audio/meze99classics_s.jpg'],
                'specs' => [
                    'type' => 'Closed-back',
                    'color' => 'Silver',
                    'design' => 'Closed-back',
                    'frequency_response' => '15Hz - 25kHz',
                    'impedance' => '32 Ohms',
                    'cable_length' => '1.2m'
                ]
            ],

            // ==================== Аудиоинтерфейсы (4 шт) ====================
            [
                'name' => 'Focusrite Scarlett 2i2 (3rd Gen) Audio Interface',
                'description' => [
                    'en' => 'Audio interface Focusrite Scarlett 2i2 (3rd Gen), 2 inputs/2 outputs, USB',
                    'ru' => 'Аудиоинтерфейс Focusrite Scarlett 2i2 (3rd Gen), 2 входа/2 выхода, USB'
                ],
                'price' => 16000,
                'category' => 'audio_equipment',
                'subcategory' => 'audio_interfaces',
                'brand' => 'Focusrite',
                'images' => ['audio/scarlett2i2.jpg'],
                'specs' => [
                    'type' => 'Audio Interface',
                    'inputs' => 2,
                    'outputs' => 2,
                    'connectivity' => 'USB',
                    'preamps' => '2 x Scarlett Mic Preamps'
                ]
            ],
            [
                'name' => 'Universal Audio Apollo Twin X DUO Audio Interface',
                'description' => [
                    'en' => 'Audio interface Universal Audio Apollo Twin X DUO, 2 inputs/4 outputs, Thunderbolt',
                    'ru' => 'Аудиоинтерфейс Universal Audio Apollo Twin X DUO, 2 входа/4 выхода, Thunderbolt'
                ],
                'price' => 95000,
                'category' => 'audio_equipment',
                'subcategory' => 'audio_interfaces',
                'brand' => 'Universal Audio',
                'images' => ['audio/apollo_twin_x.jpg'],
                'specs' => [
                    'type' => 'Audio Interface',
                    'inputs' => 2,
                    'outputs' => 4,
                    'connectivity' => 'Thunderbolt',
                    'preamps' => '2 x Unison Mic Preamps',
                    'dsp' => 'DUO Core'
                ]
            ],
            [
                'name' => 'Steinberg UR22C Audio Interface',
                'description' => [
                    'en' => 'Audio interface Steinberg UR22C, 2 inputs/2 outputs, USB-C',
                    'ru' => 'Аудиоинтерфейс Steinberg UR22C, 2 входа/2 выхода, USB-C'
                ],
                'price' => 22000,
                'category' => 'audio_equipment',
                'subcategory' => 'audio_interfaces',
                'brand' => 'Steinberg',
                'images' => ['audio/steinberg_ur22c.jpg'],
                'specs' => [
                    'type' => 'Audio Interface',
                    'inputs' => 2,
                    'outputs' => 2,
                    'connectivity' => 'USB-C',
                    'preamps' => '2 x D-PRE',
                    'resolution' => '32-bit/192 kHz'
                ]
            ],
            [
                'name' => 'PreSonus AudioBox USB 96',
                'description' => [
                    'en' => 'Audio interface PreSonus AudioBox USB 96, 2 inputs/2 outputs, USB',
                    'ru' => 'Аудиоинтерфейс PreSonus AudioBox USB 96, 2 входа/2 выхода, USB'
                ],
                'price' => 12000,
                'category' => 'audio_equipment',
                'subcategory' => 'audio_interfaces',
                'brand' => 'PreSonus',
                'images' => ['audio/presonus_audiobox.jpg'],
                'specs' => [
                    'type' => 'Audio Interface',
                    'inputs' => 2,
                    'outputs' => 2,
                    'connectivity' => 'USB',
                    'preamps' => '2 x Class A',
                    'resolution' => '24-bit/96 kHz'
                ]
            ],

            // ==================== Студийные мониторы (8 шт) ====================
            [
                'name' => 'Yamaha HS5 Studio Monitor (Pair) Black',
                'description' => [
                    'en' => 'Studio monitors Yamaha HS5 (pair) black, near-field, 70W',
                    'ru' => 'Студийные мониторы Yamaha HS5 (пара) черные, ближнего поля, 70 Вт'
                ],
                'price' => 42000,
                'category' => 'audio_equipment',
                'subcategory' => 'studio_monitors',
                'brand' => 'Yamaha',
                'images' => ['audio/yamaha_hs5_b.jpg'],
                'specs' => [
                    'type' => 'Studio Monitor',
                    'color' => 'Black',
                    'configuration' => 'Pair',
                    'woofer_size' => '5 inch',
                    'tweeter_size' => '1 inch',
                    'amplifier_power' => '70W'
                ]
            ],
            [
                'name' => 'Yamaha HS5 Studio Monitor (Pair) White',
                'description' => [
                    'en' => 'Studio monitors Yamaha HS5 (pair) white, near-field, 70W',
                    'ru' => 'Студийные мониторы Yamaha HS5 (пара) белые, ближнего поля, 70 Вт'
                ],
                'price' => 42000,
                'category' => 'audio_equipment',
                'subcategory' => 'studio_monitors',
                'brand' => 'Yamaha',
                'images' => ['audio/yamaha_hs5_w.jpg'],
                'specs' => [
                    'type' => 'Studio Monitor',
                    'color' => 'White',
                    'configuration' => 'Pair',
                    'woofer_size' => '5 inch',
                    'tweeter_size' => '1 inch',
                    'amplifier_power' => '70W'
                ]
            ],
            [
                'name' => 'KRK Rokit 5 G4 Studio Monitor (Single) White',
                'description' => [
                    'en' => 'Studio monitor KRK Rokit 5 G4 (single) white, near-field, 55W',
                    'ru' => 'Студийный монитор KRK Rokit 5 G4 (один) белый, ближнего поля, 55 Вт'
                ],
                'price' => 25000,
                'category' => 'audio_equipment',
                'subcategory' => 'studio_monitors',
                'brand' => 'KRK',
                'images' => ['audio/krk_rokit5g4_w.jpg'],
                'specs' => [
                    'type' => 'Studio Monitor',
                    'color' => 'White',
                    'configuration' => 'Single',
                    'woofer_size' => '5 inch',
                    'tweeter_size' => '1 inch',
                    'amplifier_power' => '55W'
                ]
            ],
            [
                'name' => 'KRK Rokit 5 G4 Studio Monitor (Single) Black',
                'description' => [
                    'en' => 'Studio monitor KRK Rokit 5 G4 (single) black, near-field, 55W',
                    'ru' => 'Студийный монитор KRK Rokit 5 G4 (один) черный, ближнего поля, 55 Вт'
                ],
                'price' => 25000,
                'category' => 'audio_equipment',
                'subcategory' => 'studio_monitors',
                'brand' => 'KRK',
                'images' => ['audio/krk_rokit5g4_b.jpg'],
                'specs' => [
                    'type' => 'Studio Monitor',
                    'color' => 'Black',
                    'configuration' => 'Single',
                    'woofer_size' => '5 inch',
                    'tweeter_size' => '1 inch',
                    'amplifier_power' => '55W'
                ]
            ],
            [
                'name' => 'Adam Audio T7V Studio Monitor (Single)',
                'description' => [
                    'en' => 'Near-field studio monitors Adam Audio',
                    'ru' => 'Студийные мониторы ближнего поля Adam Audio'
                ],
                'price' => 32000,
                'category' => 'audio_equipment',
                'subcategory' => 'studio_monitors',
                'brand' => 'Adam Audio',
                'images' => ['audio/adam_audio_t7v.jpg'],
                'specs' => [
                    'type' => 'Studio Monitor',
                    'color' => 'Black',
                    'configuration' => 'Single',
                    'woofer_size' => '7 inch',
                    'tweeter_type' => 'U-ART',
                    'amplifier_power' => '70W'
                ]
            ],
            [
                'name' => 'Kali Audio LP-6 Studio Monitor (Single) Black',
                'description' => [
                    'en' => 'Near-field studio monitors black',
                    'ru' => 'Студийные мониторы ближнего поля черные'
                ],
                'price' => 29000,
                'category' => 'audio_equipment',
                'subcategory' => 'studio_monitors',
                'brand' => 'Kali Audio',
                'images' => ['audio/kali_lp6_b.jpg'],
                'specs' => [
                    'type' => 'Studio Monitor',
                    'color' => 'Black',
                    'configuration' => 'Single',
                    'woofer_size' => '6.5 inch',
                    'tweeter_size' => '1 inch',
                    'amplifier_power' => '80W'
                ]
            ],
            [
                'name' => 'Kali Audio LP-6 Studio Monitor (Single) White',
                'description' => [
                    'en' => 'Near-field studio monitors white',
                    'ru' => 'Студийные мониторы ближнего поля белые'
                ],
                'price' => 29000,
                'category' => 'audio_equipment',
                'subcategory' => 'studio_monitors',
                'brand' => 'Kali Audio',
                'images' => ['audio/kali_lp6_w.jpg'],
                'specs' => [
                    'type' => 'Studio Monitor',
                    'color' => 'White',
                    'configuration' => 'Single',
                    'woofer_size' => '6.5 inch',
                    'tweeter_size' => '1 inch',
                    'amplifier_power' => '80W'
                ]
            ]
        ];

        Item::insert($audioEquipment);
    }
}