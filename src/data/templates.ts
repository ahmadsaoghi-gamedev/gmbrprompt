import { PromptTemplate } from '../types';

export const promptTemplates: PromptTemplate[] = [
  // YouTube Thumbnail Templates
  {
    id: 'yt-gaming',
    name: 'Gaming Thumbnail',
    category: 'YouTube',
    description: 'High-energy gaming thumbnail with character focus',
    prompt: 'Dynamic gaming character in action pose, explosive background, vibrant neon colors, dramatic lighting, intense facial expression, game UI elements, energy effects, professional gaming thumbnail style',
    negativePrompt: 'boring, static, low energy, dark, blurry',
    aspectRatio: '16:9',
    tags: ['gaming', 'youtube', 'action', 'vibrant']
  },
  {
    id: 'yt-tech',
    name: 'Tech Review Thumbnail',
    category: 'YouTube',
    description: 'Clean tech product showcase thumbnail',
    prompt: 'Modern tech product on clean background, professional lighting, sleek design, minimalist setup, high-tech atmosphere, product photography style, crisp details, studio lighting',
    negativePrompt: 'cluttered, messy, poor lighting, low quality',
    aspectRatio: '16:9',
    tags: ['tech', 'youtube', 'product', 'clean']
  },
  {
    id: 'yt-lifestyle',
    name: 'Lifestyle Vlog Thumbnail',
    category: 'YouTube',
    description: 'Warm, inviting lifestyle content thumbnail',
    prompt: 'Cozy lifestyle scene, warm natural lighting, comfortable setting, inviting atmosphere, soft colors, authentic moment, lifestyle photography, natural composition',
    negativePrompt: 'artificial, staged, harsh lighting, uncomfortable',
    aspectRatio: '16:9',
    tags: ['lifestyle', 'youtube', 'cozy', 'authentic']
  },

  // Indonesian Content Templates
  {
    id: 'yt-indonesia',
    name: 'YouTube Thumbnail Indonesia',
    category: 'Indonesian',
    description: 'Thumbnail YouTube dengan nuansa Indonesia',
    prompt: 'Konten kreator Indonesia, latar belakang budaya Indonesia, warna-warna cerah dan menarik, ekspresi antusias, elemen visual Indonesia, thumbnail YouTube profesional',
    negativePrompt: 'membosankan, gelap, kualitas rendah, tidak menarik',
    aspectRatio: '16:9',
    tags: ['indonesia', 'youtube', 'budaya', 'kreator']
  },
  {
    id: 'instagram-indonesia',
    name: 'Instagram Story Indonesia',
    category: 'Indonesian',
    description: 'Template Instagram Story dengan sentuhan Indonesia',
    prompt: 'Desain Instagram Story modern, elemen grafis Indonesia, warna-warna tropis, tipografi menarik, layout vertikal, aesthetic Indonesia contemporary',
    negativePrompt: 'kuno, membosankan, layout horizontal, kualitas rendah',
    aspectRatio: '9:16',
    tags: ['indonesia', 'instagram', 'story', 'modern']
  },
  {
    id: 'traditional-art',
    name: 'Traditional Indonesian Art',
    category: 'Indonesian',
    description: 'Seni tradisional Indonesia modern',
    prompt: 'Seni tradisional Indonesia, motif batik modern, wayang kontemporer, warna-warna tradisional, artistic interpretation, cultural heritage, modern twist',
    negativePrompt: 'western style, tidak autentik, modern tanpa nuansa tradisional',
    aspectRatio: '1:1',
    tags: ['tradisional', 'batik', 'wayang', 'budaya']
  },

  // Music Cover Templates
  {
    id: 'music-electronic',
    name: 'Electronic Music Cover',
    category: 'Music',
    description: 'Futuristic electronic music album cover',
    prompt: 'Futuristic electronic music cover, neon synthwave aesthetics, digital glitch effects, geometric patterns, vibrant purple and cyan colors, retro-futuristic design, electronic music style',
    negativePrompt: 'organic, natural, acoustic, vintage',
    aspectRatio: '1:1',
    tags: ['electronic', 'synthwave', 'futuristic', 'neon']
  },
  {
    id: 'music-indie',
    name: 'Indie Album Cover',
    category: 'Music',
    description: 'Artistic indie music album cover',
    prompt: 'Artistic indie album cover, vintage film photography aesthetic, muted earth tones, artistic composition, analog photography feel, creative typography space, indie music style',
    negativePrompt: 'commercial, bright, digital, mainstream',
    aspectRatio: '1:1',
    tags: ['indie', 'vintage', 'artistic', 'film']
  },

  // E-commerce Templates
  {
    id: 'ecommerce-product',
    name: 'E-commerce Product Photo',
    category: 'E-commerce',
    description: 'Clean product photography for online stores',
    prompt: 'Professional product photography, clean white background, studio lighting, high-quality details, commercial photography style, product focus, crisp shadows, e-commerce ready',
    negativePrompt: 'cluttered background, poor lighting, low quality, distracting elements',
    aspectRatio: '1:1',
    tags: ['product', 'ecommerce', 'commercial', 'clean']
  },
  {
    id: 'ecommerce-lifestyle',
    name: 'Lifestyle Product Shot',
    category: 'E-commerce',
    description: 'Product in lifestyle setting',
    prompt: 'Lifestyle product photography, natural setting, authentic use case, appealing lifestyle, soft natural lighting, relatable scenario, marketing photography',
    negativePrompt: 'artificial, staged, unrealistic, poor composition',
    aspectRatio: '4:3',
    tags: ['lifestyle', 'product', 'authentic', 'natural']
  },

  // Food & Culinary Templates
  {
    id: 'food-photography',
    name: 'Food Photography',
    category: 'Food & Culinary',
    description: 'Appetizing food photography',
    prompt: 'Delicious food photography, natural lighting, appetizing presentation, fresh ingredients, professional food styling, warm tones, shallow depth of field, instagram-worthy',
    negativePrompt: 'unappetizing, artificial lighting, messy, unappetizing colors',
    aspectRatio: '1:1',
    tags: ['food', 'photography', 'appetizing', 'professional']
  },
  {
    id: 'culinary-indonesia',
    name: 'Indonesian Culinary',
    category: 'Food & Culinary',
    description: 'Fotografi makanan Indonesia',
    prompt: 'Fotografi makanan Indonesia, hidangan tradisional, presentasi menarik, pencahayaan alami, garnish segar, latar belakang kayu atau bambu, authentic Indonesian cuisine',
    negativePrompt: 'tidak autentik, presentasi buruk, pencahayaan artificial',
    aspectRatio: '1:1',
    tags: ['indonesia', 'kuliner', 'tradisional', 'autentik']
  },

  // Real Estate Templates
  {
    id: 'real-estate-exterior',
    name: 'Real Estate Exterior',
    category: 'Real Estate',
    description: 'Professional property exterior photography',
    prompt: 'Professional real estate photography, beautiful house exterior, golden hour lighting, well-maintained landscape, clear blue sky, architectural photography, wide angle view',
    negativePrompt: 'poor maintenance, bad weather, dark, cluttered, low quality',
    aspectRatio: '16:9',
    tags: ['real estate', 'exterior', 'architecture', 'professional']
  },
  {
    id: 'real-estate-interior',
    name: 'Real Estate Interior',
    category: 'Real Estate',
    description: 'Spacious interior property photography',
    prompt: 'Spacious interior photography, modern home design, natural lighting, clean and organized, professional staging, wide angle lens, bright and airy atmosphere',
    negativePrompt: 'cluttered, dark, poor lighting, messy, cramped',
    aspectRatio: '16:9',
    tags: ['real estate', 'interior', 'spacious', 'modern']
  },

  // Fashion & Beauty Templates
  {
    id: 'fashion-portrait',
    name: 'Fashion Portrait',
    category: 'Fashion & Beauty',
    description: 'Professional fashion photography',
    prompt: 'Professional fashion portrait, studio lighting, elegant pose, high-end fashion, clean background, professional makeup, fashion photography style, editorial quality',
    negativePrompt: 'amateur, poor lighting, messy background, low quality',
    aspectRatio: '3:4',
    tags: ['fashion', 'portrait', 'professional', 'editorial']
  },
  {
    id: 'beauty-closeup',
    name: 'Beauty Close-up',
    category: 'Fashion & Beauty',
    description: 'Beauty photography close-up',
    prompt: 'Beauty close-up photography, flawless skin, professional makeup, soft lighting, clean background, high-end beauty photography, commercial quality',
    negativePrompt: 'poor skin, amateur makeup, harsh lighting, low quality',
    aspectRatio: '1:1',
    tags: ['beauty', 'closeup', 'makeup', 'commercial']
  },

  // Corporate Templates
  {
    id: 'corporate-headshot',
    name: 'Corporate Headshot',
    category: 'Corporate',
    description: 'Professional business headshot',
    prompt: 'Professional business headshot, clean background, professional lighting, confident expression, business attire, approachable demeanor, high-quality portrait photography',
    negativePrompt: 'casual, messy, poor lighting, unprofessional',
    aspectRatio: '1:1',
    tags: ['corporate', 'headshot', 'professional', 'business']
  },
  {
    id: 'corporate-team',
    name: 'Corporate Team Photo',
    category: 'Corporate',
    description: 'Professional team photography',
    prompt: 'Professional team photography, group of business professionals, modern office setting, professional lighting, confident poses, corporate atmosphere',
    negativePrompt: 'casual, messy, poor composition, unprofessional setting',
    aspectRatio: '16:9',
    tags: ['corporate', 'team', 'professional', 'office']
  },

  // Travel & Tourism Templates
  {
    id: 'travel-landscape',
    name: 'Travel Landscape',
    category: 'Travel & Tourism',
    description: 'Stunning travel destination photography',
    prompt: 'Breathtaking travel landscape, stunning natural scenery, golden hour lighting, dramatic sky, professional travel photography, wanderlust inspiring, high-quality nature photography',
    negativePrompt: 'poor weather, dark, low quality, cluttered, uninteresting',
    aspectRatio: '16:9',
    tags: ['travel', 'landscape', 'nature', 'wanderlust']
  },
  {
    id: 'travel-indonesia',
    name: 'Indonesian Tourism',
    category: 'Travel & Tourism',
    description: 'Wisata Indonesia yang menakjubkan',
    prompt: 'Pemandangan wisata Indonesia yang menakjubkan, pantai tropis, gunung berapi, candi kuno, budaya lokal, golden hour lighting, fotografi travel profesional',
    negativePrompt: 'cuaca buruk, gelap, kualitas rendah, tidak menarik',
    aspectRatio: '16:9',
    tags: ['indonesia', 'wisata', 'alam', 'budaya']
  }
];

export const getTemplatesByCategory = (category: string): PromptTemplate[] => {
  return promptTemplates.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(promptTemplates.map(template => template.category))];
};