export const MOCK_CITIES = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", 
  "Curitiba, PR", "Florianópolis, SC", "Salvador, BA", 
  "Fortaleza, CE", "Brasília, DF", "Porto Alegre, RS", 
  "Recife, PE", "Manaus, AM", "Goiânia, GO"
];

export const FONT_OPTIONS = [
  { id: 'dancing-script', name: 'Dancing Script', class: 'font-["Dancing_Script"]' },
  { id: 'pacifico', name: 'Pacifico', class: 'font-["Pacifico"]' },
  { id: 'playfair', name: 'Playfair Display', class: 'font-["Playfair_Display"]' },
  { id: 'lora', name: 'Lora Serif', class: 'font-["Lora"]' },
  { id: 'inter', name: 'Inter Sans', class: 'font-["Inter"]' },
];

export const THEME_OPTIONS = [
  { 
    id: 'classic', 
    name: 'Clássico', 
    description: 'O estilo romântico e atemporal. Perfeito para declarações tradicionais.', 
    badge: 'Clássico',
    color: '#e11d48',
    image: 'https://picsum.photos/seed/classic-theme/400/600'
  },
  { 
    id: 'netflix', 
    name: 'Netflix', 
    description: 'Estilo cinematográfico inspirado na Netflix. Transforme sua história em uma série épica.', 
    badge: 'Série',
    color: '#e50914',
    image: 'https://picsum.photos/seed/netflix-theme/400/600'
  },
  { 
    id: 'spotify', 
    name: 'Spotify', 
    description: 'Visual moderno inspirado no Spotify. Perfeito para quem ama música.', 
    badge: 'Música',
    color: '#1db954',
    image: 'https://picsum.photos/seed/spotify-theme/400/600'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    description: 'Transforme sua história em um perfil social. Feed, biografia e memórias em grade.', 
    badge: 'Social',
    color: '#e1306c',
    image: 'https://picsum.photos/seed/insta-theme/400/600',
    videoUrl: 'fYln5Smsn6w'
  },
];

export type ThemeId = 'classic' | 'netflix' | 'spotify' | 'instagram';

export type Step = 'theme-selection' | 'gift-type' | 'customize-background' | 'photos' | 'page-title' | 'message' | 'music' | 'data-location' | 'plans' | 'order-bump' | 'subdomain-config' | 'modules';
