// resources/js/config/categoryMapping.js

// Маппинг для категорий
export const categoryMapping = {
    accessories: "Accessories",
    audio_equipment: "Audio Equipment",
    drums: "Drums",
    guitars: "Guitars",
    keyboards: "Keyboards",
  };
  
  // Маппинг для подкатегорий, сгруппированных по категориям
  export const subcategoryMapping = {
    accessories: {
      audio_accessories: "Audio Accessories",
      drum_accessories: "Drum Accessories",
      general_accessories: "General Accessories",
      guitar_accessories: "Guitar Accessories",
      keyboard_accessories: "Keyboard Accessories",
    },
    audio_equipment: {
      audio_interfaces: "Audio Interfaces",
      headphones: "Headphones",
      microphones: "Microphones",
      studio_monitors: "Studio Monitors",
    },
    drums: {
      acoustic_drums: "Acoustic Drums",
      cymbals: "Cymbals",
      electronic_drums: "Electronic Drums",
      percussion: "Percussion",
    },
    guitars: {
      acoustic: "Acoustic Guitars",
      bass: "Bass Guitars",
      classical: "Classical Guitars",
      electric: "Electric Guitars",
      ukulele: "Ukulele",
    },
    keyboards: {
      acoustic_pianos: "Acoustic Pianos",
      digital_pianos: "Digital Pianos",
      midi_controllers: "MIDI Controllers",
      synthesizers: "Synthesizers",
    },
  };
  
  // Функция для получения читаемого названия категории
  export const getReadableCategory = (category) => {
    return categoryMapping[category] || category.replace(/_/g, ' ');
  };
  
  // Функция для получения читаемого названия подкатегории
  export const getReadableSubcategory = (category, subcategory) => {
    return subcategoryMapping[category]?.[subcategory] || subcategory.replace(/_/g, ' ');
  };