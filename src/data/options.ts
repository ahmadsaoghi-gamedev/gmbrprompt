export const defaultOptions = {
  styles: [
    'Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Pencil Sketch',
    'Anime/Manga', 'Cartoon', '3D Render', 'Pixel Art', 'Minimalist', 'Abstract',
    'Vintage', 'Retro', 'Cyberpunk', 'Fantasy Art', 'Pop Art', 'Impressionist',
    'Surreal', 'Art Nouveau', 'Bauhaus', 'Street Art'
  ],
  
  stylesId: [
    'Realistis', 'Seni Digital', 'Lukisan Minyak', 'Cat Air', 'Sketsa Pensil',
    'Anime/Manga', 'Kartun', 'Render 3D', 'Seni Pixel', 'Minimalis', 'Abstrak',
    'Vintage', 'Retro', 'Cyberpunk', 'Seni Fantasi', 'Pop Art', 'Impresionis',
    'Surreal', 'Art Nouveau', 'Bauhaus', 'Seni Jalanan', 'Batik', 'Wayang',
    'Tradisional Indonesia', 'Modern Indonesia'
  ],

  moods: [
    'Dramatic', 'Peaceful', 'Energetic', 'Mysterious', 'Cheerful', 'Melancholic',
    'Epic', 'Intimate', 'Surreal', 'Nostalgic', 'Futuristic', 'Romantic',
    'Dark', 'Bright', 'Moody', 'Uplifting', 'Tense', 'Calm'
  ],
  
  moodsId: [
    'Dramatis', 'Tenang', 'Energik', 'Misterius', 'Ceria', 'Melankolis',
    'Epik', 'Intim', 'Surreal', 'Nostalgia', 'Futuristik', 'Romantis',
    'Gelap', 'Terang', 'Moody', 'Mengangkat', 'Tegang', 'Kalem'
  ],

  lighting: [
    'Natural daylight', 'Golden hour', 'Blue hour', 'Studio lighting', 'Dramatic shadows',
    'Soft diffused', 'Neon lighting', 'Candlelight', 'Moonlight', 'Harsh sunlight',
    'Backlighting', 'Side lighting', 'Ring light', 'Volumetric lighting', 'Ambient lighting'
  ],
  
  lightingId: [
    'Cahaya alami siang', 'Golden hour', 'Blue hour', 'Pencahayaan studio', 'Bayangan dramatis',
    'Cahaya lembut tersebar', 'Pencahayaan neon', 'Cahaya lilin', 'Cahaya bulan', 'Sinar matahari keras',
    'Pencahayaan belakang', 'Pencahayaan samping', 'Ring light', 'Pencahayaan volumetrik', 'Pencahayaan ambient'
  ],

  cameraAngles: [
    'Close-up', 'Medium shot', 'Wide shot', 'Bird\'s eye view', 'Low angle',
    'High angle', 'Dutch angle', 'Over-the-shoulder', 'Point of view', 'Establishing shot',
    'Macro', 'Portrait', 'Landscape', 'Aerial view', 'Ground level'
  ],
  
  cameraAnglesId: [
    'Close-up', 'Medium shot', 'Wide shot', 'Pandangan mata burung', 'Sudut rendah',
    'Sudut tinggi', 'Sudut miring', 'Dari belakang bahu', 'Sudut pandang', 'Establishing shot',
    'Makro', 'Potret', 'Lanskap', 'Pandangan udara', 'Level tanah'
  ],

  artMediums: [
    'Photography', 'Digital Art', 'Oil Painting', 'Watercolor', 'Acrylic Paint',
    'Pencil Drawing', 'Charcoal', 'Pastel', 'Ink Drawing', 'Mixed Media',
    '3D Render', 'Vector Art', 'Pixel Art', 'Collage', 'Screen Print',
    'Etching', 'Lithograph', 'Sculpture', 'Installation Art'
  ],
  
  artMediumsId: [
    'Fotografi', 'Seni Digital', 'Lukisan Minyak', 'Cat Air', 'Cat Akrilik',
    'Gambar Pensil', 'Arang', 'Pastel', 'Gambar Tinta', 'Media Campuran',
    'Render 3D', 'Seni Vektor', 'Seni Pixel', 'Kolase', 'Sablon',
    'Etsa', 'Litografi', 'Patung', 'Seni Instalasi'
  ],

  resolutions: [
    '4K', '8K', 'HD', 'Ultra HD', 'Full HD', '2K', '1080p', '720p', 
    'High Resolution', 'Ultra High Resolution', 'Cinema 4K', 'IMAX'
  ],

  qualities: [
    'Professional', 'Masterpiece', 'Award-winning', 'High Quality', 'Ultra Quality',
    'Premium', 'Studio Quality', 'Gallery Quality', 'Museum Quality', 'Artistic',
    'Commercial Grade', 'Professional Grade'
  ],
  
  qualitiesId: [
    'Profesional', 'Karya Agung', 'Pemenang Penghargaan', 'Kualitas Tinggi', 'Kualitas Ultra',
    'Premium', 'Kualitas Studio', 'Kualitas Galeri', 'Kualitas Museum', 'Artistik',
    'Grade Komersial', 'Grade Profesional'
  ],

  technical: [
    'HDR', 'Ray-tracing', 'Volumetric lighting', 'Depth of field', 'Bokeh',
    'Motion blur', 'Chromatic aberration', 'Lens flare', 'Vignette', 'Film grain',
    'Color grading', 'Post-processing', 'Anti-aliasing', 'Global illumination'
  ],

  cameras: [
    'DSLR', 'Mirrorless', 'Film Camera', 'Vintage Camera', 'Modern Camera',
    'Professional Camera', 'Medium Format', 'Large Format', 'Instant Camera',
    'Digital Camera', 'Analog Camera', 'Cinema Camera', 'Drone Camera'
  ],
  
  camerasId: [
    'DSLR', 'Mirrorless', 'Kamera Film', 'Kamera Vintage', 'Kamera Modern',
    'Kamera Profesional', 'Format Medium', 'Format Besar', 'Kamera Instan',
    'Kamera Digital', 'Kamera Analog', 'Kamera Sinema', 'Kamera Drone'
  ]
};

export const negativePromptTemplates = {
  common: [
    'blurry, low quality, distorted, ugly, bad anatomy',
    'watermark, text, signature, logo',
    'duplicate, extra limbs, malformed',
    'out of frame, cropped, cut off',
    'poor lighting, overexposed, underexposed'
  ],
  
  commonId: [
    'buram, kualitas rendah, terdistorsi, jelek, anatomi buruk',
    'watermark, teks, tanda tangan, logo',
    'duplikat, anggota tubuh ekstra, cacat',
    'keluar frame, terpotong',
    'pencahayaan buruk, overexposed, underexposed'
  ],

  photography: [
    'motion blur, camera shake, noise, grain',
    'chromatic aberration, lens distortion',
    'poor composition, bad framing'
  ],
  
  art: [
    'amateur, sketch, unfinished, rough',
    'childish, simple, basic',
    'messy, chaotic, cluttered'
  ]
};