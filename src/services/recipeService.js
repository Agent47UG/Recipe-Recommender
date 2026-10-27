import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env?.VITE_GEMIN_API_KEY;
const SPOONACULAR_API_KEY = import.meta.env?.VITE_SPOONACULAR_API_KEY;
const YOUTUBE_API_KEY = import.meta.env?.VITE_YOUTUBE_API_KEY;

const PREFERRED_GEMINI_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
];

/**
 * Common culinary typos & regional transliteration mappings.
 * Fixes queries like "panner bhurji" -> "paneer bhurji" and
 * "panner butter masala" -> "paneer butter masala".
 */
const CULINARY_TYPO_MAP = [
  [/\bcaramali[sz]ed\b/gi, 'caramelized'],
  [/\bcarameli[sz]ed\b/gi, 'caramelized'],
  [/\bpanner\b/gi, 'paneer'],
  [/\bpaner\b/gi, 'paneer'],
  [/\bpanir\b/gi, 'paneer'],
  [/\bpneer\b/gi, 'paneer'],
  [/\bbhurjee\b/gi, 'bhurji'],
  [/\bburji\b/gi, 'bhurji'],
  [/\bburjee\b/gi, 'bhurji'],
  [/\bbhurjii\b/gi, 'bhurji'],
  [/\bmasla\b/gi, 'masala'],
  [/\bmassala\b/gi, 'masala'],
  [/\bmaslla\b/gi, 'masala'],
  [/\bmsala\b/gi, 'masala'],
  [/\bmakhni\b/gi, 'makhani'],
  [/\btika\b/gi, 'tikka'],
  [/\bbiriyani\b/gi, 'biryani'],
  [/\bbriyani\b/gi, 'biryani'],
  [/\bbiriani\b/gi, 'biryani'],
  [/\bberyani\b/gi, 'biryani'],
  [/\bchiken\b/gi, 'chicken'],
  [/\bchikn\b/gi, 'chicken'],
  [/\bchciken\b/gi, 'chicken'],
  [/\bchickn\b/gi, 'chicken'],
  [/\bmuton\b/gi, 'mutton'],
  [/\bmutten\b/gi, 'mutton'],
  [/\bparantha\b/gi, 'paratha'],
  [/\bparotta\b/gi, 'paratha'],
  [/\bchhole\b/gi, 'chole'],
  [/\bchanna\b/gi, 'chana'],
  [/\bdaal\b/gi, 'dal'],
  [/\bdhal\b/gi, 'dal'],
  [/\bdall\b/gi, 'dal'],
  [/\baaloo\b/gi, 'aloo'],
  [/\bgobhi\b/gi, 'gobi'],
  [/\bmattar\b/gi, 'matar'],
  [/\bmuttar\b/gi, 'matar'],
  [/\bmutter\b/gi, 'matar'],
  [/\bkadhai\b/gi, 'kadai'],
  [/\bkarahi\b/gi, 'kadai'],
  [/\bkarai\b/gi, 'kadai'],
  [/\bsahi\s+paneer\b/gi, 'shahi paneer'],
  [/\bkofte\b/gi, 'kofta'],
  [/\bkurma\b/gi, 'korma'],
  [/\bqorma\b/gi, 'korma'],
  [/\bpaav\b/gi, 'pav'],
  [/\bpao\s+bhaji\b/gi, 'pav bhaji'],
  [/\bdosai\b/gi, 'dosa'],
  [/\bdhosa\b/gi, 'dosa'],
  [/\bidly\b/gi, 'idli'],
  [/\bwada\b/gi, 'vada'],
  [/\bpohe\b/gi, 'poha'],
  [/\brazma\b/gi, 'rajma'],
  [/\bbindi\b/gi, 'bhindi'],
  [/\bbaigan\b/gi, 'baingan'],
  [/\bpakoda\b/gi, 'pakora'],
  [/\bbhajiya\b/gi, 'pakora'],
  [/\bszechuan\b/gi, 'schezwan'],
  [/\bsichuan\b/gi, 'schezwan'],
  [/\bspagetti\b/gi, 'spaghetti'],
  [/\bspagheti\b/gi, 'spaghetti'],
  [/\bsphagetti\b/gi, 'spaghetti'],
  [/\bcarbonra\b/gi, 'carbonara'],
  [/\bcarbanara\b/gi, 'carbonara'],
  [/\balfreado\b/gi, 'alfredo'],
  [/\blasanga\b/gi, 'lasagna'],
  [/\blasgna\b/gi, 'lasagna'],
  [/\bquesadila\b/gi, 'quesadilla'],
  [/\bguacamoli\b/gi, 'guacamole'],
  [/\bburito\b/gi, 'burrito'],
  [/\bshwarma\b/gi, 'shawarma'],
  [/\bshawrma\b/gi, 'shawarma'],
  [/\bfalafal\b/gi, 'falafel'],
  [/\bhumus\b/gi, 'hummus'],
];

/**
 * Normalizes user search text by correcting common culinary misspellings.
 */
export function normalizeCulinaryQuery(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') return '';
  let normalized = rawQuery.trim().replace(/\s+/g, ' ');
  for (const [pattern, replacement] of CULINARY_TYPO_MAP) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized;
}

/**
 * Returns singular, plural, and base variants of a word for flexible matching
 * (e.g., "eggs" <-> "egg", "onions" <-> "onion", "tomatoes" <-> "tomato").
 */
export function getWordVariants(word) {
  if (!word || typeof word !== 'string') return [];
  const w = word.toLowerCase().trim();
  const variants = new Set([w]);
  if (w.endsWith('ies')) variants.add(w.slice(0, -3) + 'y');
  if (w.endsWith('es') && !w.endsWith('ees')) variants.add(w.slice(0, -2));
  if (w.endsWith('s') && !w.endsWith('ss')) variants.add(w.slice(0, -1));
  if (!w.endsWith('s')) {
    variants.add(w + 's');
    variants.add(w + 'es');
  }
  return Array.from(variants);
}

/**
 * Hero dish/ingredient keywords and their synonyms so recipe relevance filtering
 * never confuses a modifier word (like "butter" in "paneer butter masala")
 * with an unrelated dish (like "butter cookies").
 */
const HERO_SYNONYMS = {
  paneer: ['paneer', 'cottage cheese', 'chenna', 'chhena'],
  bhurji: ['bhurji', 'scrambled'],
  chicken: ['chicken', 'murgh', 'poultry'],
  mutton: ['mutton', 'lamb', 'goat'],
  lamb: ['lamb', 'mutton'],
  beef: ['beef', 'steak', 'sirloin', 'brisket'],
  pork: ['pork', 'bacon', 'ham', 'pancetta', 'guanciale', 'chorizo'],
  fish: ['fish', 'salmon', 'cod', 'tilapia', 'tuna', 'trout', 'halibut', 'haddock'],
  shrimp: ['shrimp', 'prawn', 'prawns'],
  prawn: ['prawn', 'prawns', 'shrimp'],
  egg: ['egg', 'eggs', 'anda', 'omelette', 'shakshuka'],
  eggs: ['egg', 'eggs', 'anda', 'omelette', 'shakshuka'],
  anda: ['anda', 'egg', 'eggs'],
  onion: ['onion', 'onions', 'caramelized onion', 'shallot', 'scallion'],
  onions: ['onion', 'onions', 'caramelized onion', 'shallot', 'scallion'],
  caramelized: ['caramelized', 'caramelised'],
  tofu: ['tofu', 'bean curd'],
  mushroom: ['mushroom', 'mushrooms', 'cremini', 'portobello', 'shiitake', 'fungi'],
  mushrooms: ['mushroom', 'mushrooms', 'cremini', 'portobello', 'shiitake', 'fungi'],
  spinach: ['spinach', 'palak', 'saag'],
  palak: ['palak', 'spinach', 'saag'],
  potato: ['potato', 'potatoes', 'aloo'],
  aloo: ['aloo', 'potato', 'potatoes'],
  gobi: ['gobi', 'cauliflower'],
  cauliflower: ['cauliflower', 'gobi'],
  matar: ['matar', 'peas', 'pea'],
  chole: ['chole', 'chana', 'chickpea', 'chickpeas', 'garbanzo'],
  chana: ['chana', 'chole', 'chickpea', 'chickpeas', 'garbanzo'],
  chickpea: ['chickpea', 'chickpeas', 'chole', 'chana', 'garbanzo'],
  rajma: ['rajma', 'kidney bean', 'kidney beans'],
  dal: ['dal', 'daal', 'lentil', 'lentils', 'urad', 'moong', 'masoor', 'toor'],
  lentil: ['lentil', 'lentils', 'dal', 'daal'],
  bhindi: ['bhindi', 'okra', 'ladyfinger'],
  baingan: ['baingan', 'eggplant', 'aubergine', 'brinjal'],
  dosa: ['dosa', 'masala dosa'],
  idli: ['idli', 'idly'],
  pav: ['pav bhaji', 'pav', 'bhaji'],
  kofta: ['kofta', 'dumpling', 'paneer'],
  samosa: ['samosa'],
  paratha: ['paratha', 'flatbread'],
  biryani: ['biryani', 'pulao', 'pilaf', 'basmati'],
  momos: ['momo', 'momos', 'dumpling', 'dumplings', 'gyoza'],
  momo: ['momo', 'momos', 'dumpling', 'dumplings', 'gyoza'],
  manchurian: ['manchurian', 'indo-chinese', 'chilli', 'schezwan'],
  noodles: ['noodle', 'noodles', 'hakka', 'chow mein', 'lo mein', 'ramen', 'udon', 'pad thai'],
  noodle: ['noodle', 'noodles', 'hakka', 'chow mein', 'lo mein', 'ramen', 'udon', 'pad thai'],
  ramen: ['ramen', 'noodle', 'noodles'],
  pasta: ['pasta', 'spaghetti', 'fettuccine', 'penne', 'rigatoni', 'linguine', 'macaroni', 'lasagna', 'carbonara', 'alfredo', 'arrabbiata', 'pesto', 'tagliatelle', 'gnocchi'],
  spaghetti: ['spaghetti', 'pasta', 'carbonara', 'bolognese'],
  carbonara: ['carbonara', 'spaghetti', 'pasta'],
  alfredo: ['alfredo', 'fettuccine', 'pasta'],
  tacos: ['taco', 'tacos', 'tortilla', 'fajita', 'quesadilla', 'burrito'],
  taco: ['taco', 'tacos', 'tortilla', 'fajita', 'quesadilla', 'burrito'],
  burrito: ['burrito', 'taco', 'tacos', 'quesadilla'],
  quesadilla: ['quesadilla', 'taco', 'tacos', 'tortilla'],
  shawarma: ['shawarma', 'kebab', 'gyro', 'doner', 'middle eastern'],
  falafel: ['falafel', 'chickpea', 'hummus'],
  hummus: ['hummus', 'chickpea', 'falafel'],
};

/**
 * Words that are generic cooking modifiers/adjectives and must NEVER be searched
 * alone in keyword fallback loops (prevents "butter" -> "Butter Cookies").
 */
const GENERIC_MODIFIER_WORDS = new Set([
  'butter',
  'buttery',
  'cream',
  'creamy',
  'masala',
  'curry',
  'gravy',
  'sauce',
  'spicy',
  'spiced',
  'hot',
  'mild',
  'sweet',
  'sour',
  'crispy',
  'crunchy',
  'fried',
  'roasted',
  'baked',
  'grilled',
  'steamed',
  'fresh',
  'quick',
  'easy',
  'simple',
  'homemade',
  'street',
  'style',
  'restaurant',
  'dhaba',
  'recipe',
  'recipes',
  'dish',
  'dishes',
  'bowl',
  'with',
  'without',
  'and',
  'the',
  'for',
  'from',
  'indian',
  'italian',
  'mexican',
  'chinese',
  'thai',
  'japanese',
  'vegetarian',
  'vegan',
  'healthy',
  'water',
  'salt',
  'sugar',
  'oil',
  'milk',
]);

const SPECIFIC_DISH_WORDS = [
  'bhurji',
  'makhani',
  'lababdar',
  'tikka',
  'kadai',
  'palak',
  'shahi',
  'matar',
  'tawa',
  'chilli',
  'chole',
  'dosa',
  'biryani',
  'kofta',
  'pav',
  'bhaji',
  'manchurian',
  'momos',
  'momo',
  'carbonara',
  'alfredo',
  'shawarma',
  'falafel',
  'quesadilla',
  'ramen',
  'taco',
  'tacos',
  'burrito',
  'pasta',
  'spaghetti',
  'curry',
  'soup',
];

const DESSERT_QUERY_REGEX =
  /\b(cookie|cookies|cake|cupcake|cheesecake|brownie|brownies|dessert|sweet|chocolate|ice cream|pudding|pie|tart|pastry|donut|doughnut|muffin|waffle|pancake|pancakes|halwa|kheer|gulab jamun|rasmalai|laddu|laddoo|barfi|jalebi|fudge|crumble|cobbler|biscuit|shortbread|macaron|tiramisu|churro|custard|sorbet|parfait)\b/i;

const DESSERT_RECIPE_REGEX =
  /\b(cookie|cookies|cake|cupcake|cheesecake|brownie|brownies|fudge|pudding|ice cream|sorbet|pie|tart|crumble|cobbler|macaron|meringue|muffin|donut|doughnut|waffle|pancake|pancakes|tiramisu|panna cotta|trifle|parfait|biscuit|shortbread|frosting|icing|candy|caramel|chocolate chip|peanut butter cup|apfelstrudel|baklava|churro|eclairs|profiteroles|strudel|souffle)\b/i;

const VEGETARIAN_QUERY_TRIGGER_REGEX =
  /\b(paneer|tofu|vegetarian|vegan|veg|palak|aloo|gobi|bhindi|baingan|chole|chana|rajma|dal|idli|dosa|pav bhaji|upma|poha|kofta|samosa|matar|mushroom|mushrooms|spinach)\b/i;

const MEAT_QUERY_TRIGGER_REGEX =
  /\b(chicken|mutton|lamb|goat|beef|pork|fish|salmon|tuna|cod|shrimp|prawn|prawns|crab|lobster|seafood|bacon|ham|sausage|meat|steak|turkey|duck|shawarma)\b/i;

const EGG_QUERY_TRIGGER_REGEX = /\b(egg|eggs|anda|omelette|carbonara)\b/i;

const MEAT_RECIPE_REGEX =
  /\b(chicken|beef|pork|lamb|mutton|goat|fish|salmon|tuna|cod|tilapia|trout|halibut|haddock|sardine|anchovy|anchovies|shrimp|prawn|prawns|crab|lobster|clam|mussel|oyster|squid|calamari|octopus|seafood|bacon|ham|prosciutto|pancetta|guanciale|pepperoni|salami|sausage|chorizo|meat|meatball|meatballs|steak|sirloin|brisket|veal|venison|turkey|duck|goose|lard|suet|gelatin|worcestershire|fish sauce|oyster sauce|chicken stock|chicken broth|beef stock|beef broth)\b/i;

const EGG_RECIPE_REGEX = /\b(egg|eggs|egg yolk|egg whites|anda|omelette|mayonnaise)\b/i;

/**
 * Extracts a 11-character YouTube video ID from a URL if present.
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Enriches any filter object (from Gemini or Local Parser) with deterministic
 * culinary guards, hero terms, dietary flags, and relevant dish suggestions.
 */
function enrichFiltersWithCulinaryIntelligence(baseFilters, rawQuery) {
  const normalizedQuery = normalizeCulinaryQuery(rawQuery);
  const lowerNorm = normalizedQuery.toLowerCase();

  const words = lowerNorm
    .split(/[\s,]+/)
    .map((w) => w.replace(/[^a-z]/g, ''))
    .filter(Boolean);

  const strictHeroTerms = Array.from(
    new Set(words.filter((w) => Object.prototype.hasOwnProperty.call(HERO_SYNONYMS, w)))
  );

  const requiresPaneer = /\bpaneer\b/i.test(lowerNorm);
  const requiresEgg =
    /\b(egg|eggs|anda)\b/i.test(lowerNorm) && !/\beggplant\b/i.test(lowerNorm);
  const isDessertQuery = DESSERT_QUERY_REGEX.test(lowerNorm);
  const hasMeatKeyword = MEAT_QUERY_TRIGGER_REGEX.test(lowerNorm);
  const allowsEggs = requiresEgg || EGG_QUERY_TRIGGER_REGEX.test(lowerNorm);
  const isVegetarianQuery =
    !hasMeatKeyword &&
    !requiresEgg &&
    (requiresPaneer ||
      VEGETARIAN_QUERY_TRIGGER_REGEX.test(lowerNorm) ||
      /vegetarian|vegan/i.test(baseFilters.diet || ''));

  // Infer cuisine if not already detected
  let cuisine = baseFilters.cuisine || '';
  if (!cuisine) {
    if (
      /\b(paneer|bhurji|masala|tikka|makhani|kadai|palak|shahi|matar|chole|chana|dal|rajma|pav|bhaji|dosa|idli|biryani|kofta|aloo|gobi|bhindi|baingan|samosa|paratha|naan|korma|vindaloo|curry)\b/i.test(
        lowerNorm
      )
    ) {
      cuisine = 'Indian';
    } else if (
      /\b(pasta|spaghetti|carbonara|alfredo|arrabbiata|lasagna|risotto|gnocchi|pesto|italian)\b/i.test(
        lowerNorm
      )
    ) {
      cuisine = 'Italian';
    } else if (
      /\b(taco|tacos|burrito|quesadilla|fajita|enchilada|guacamole|mexican)\b/i.test(
        lowerNorm
      )
    ) {
      cuisine = 'Mexican';
    } else if (
      /\b(manchurian|hakka|schezwan|chilli|momos|momo|chow mein|fried rice)\b/i.test(
        lowerNorm
      )
    ) {
      cuisine = 'Chinese';
    } else if (/\b(pad thai|thai)\b/i.test(lowerNorm)) {
      cuisine = 'Thai';
    } else if (/\b(ramen|teriyaki|udon|sushi|tempura|japanese)\b/i.test(lowerNorm)) {
      cuisine = 'Japanese';
    } else if (/\b(shawarma|falafel|hummus|kebab)\b/i.test(lowerNorm)) {
      cuisine = 'Middle Eastern';
    }
  }

  let diet = baseFilters.diet || '';
  if (!diet && isVegetarianQuery && !allowsEggs) {
    diet = 'Vegetarian';
  }

  // Build smart dish suggestions tailored to the normalized query
  let dishSuggestions = (baseFilters.dishSuggestions || []).map((s) =>
    normalizeCulinaryQuery(s)
  );
  if (requiresPaneer) {
    const paneerSuggestions = [
      'Paneer Bhurji',
      'Paneer Butter Masala',
      'Kadai Paneer',
      'Paneer Tikka Masala',
      'Palak Paneer',
      'Shahi Paneer',
      'Matar Paneer',
    ].filter((s) => s.toLowerCase() !== lowerNorm);
    dishSuggestions = Array.from(new Set([...paneerSuggestions, ...dishSuggestions])).slice(
      0,
      5
    );
  } else if (dishSuggestions.length === 0 && normalizedQuery) {
    dishSuggestions = [normalizedQuery];
  }

  // Extract meaningful ingredients for UI badges & matching
  const recognizedIngredients = Array.from(
    new Set([
      ...(baseFilters.includeIngredients || []).map((i) => normalizeCulinaryQuery(i)),
      ...strictHeroTerms.filter(
        (t) =>
          ![
            'bhurji',
            'dosa',
            'idli',
            'biryani',
            'kofta',
            'samosa',
            'paratha',
            'momos',
            'momo',
            'manchurian',
            'carbonara',
            'alfredo',
            'shawarma',
            'falafel',
            'tacos',
            'taco',
            'burrito',
            'quesadilla',
          ].includes(t)
      ),
    ])
  );

  return {
    ...baseFilters,
    rawQuery: rawQuery?.trim() || '',
    normalizedQuery,
    query: normalizeCulinaryQuery(baseFilters.query || normalizedQuery),
    includeIngredients: recognizedIngredients,
    cuisine,
    diet,
    dishSuggestions,
    strictHeroTerms,
    requiresPaneer,
    requiresEgg,
    hasMeatKeyword,
    isDessertQuery,
    isVegetarianQuery,
    allowsEggs,
  };
}

/**
 * Step 1: Lightweight Gemini parser to turn free-form user input
 * into structured search filters, backed by deterministic culinary normalization.
 */
export async function parseSearchQueryWithGemini(rawQuery) {
  const normalized = normalizeCulinaryQuery(rawQuery);
  const fallbackFilters = buildFallbackFilters(rawQuery);

  if (!normalized || !GEMINI_API_KEY) {
    return fallbackFilters;
  }

  const googleAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const schema = {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'Primary dish name or keyword (e.g., "paneer bhurji", "paneer butter masala", "pasta"). Empty string if user only listed raw ingredients.',
      },
      includeIngredients: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Specific ingredients mentioned by the user (e.g., ["paneer", "garlic", "spinach"]).',
      },
      cuisine: {
        type: 'string',
        description:
          'Cuisine name if specified or implied (e.g., "Indian", "Italian", "Mexican"), otherwise empty string.',
      },
      diet: {
        type: 'string',
        description:
          'Diet filter if specified or implied (e.g., "Vegetarian", "Vegan"), otherwise empty string.',
      },
      maxReadyTime: {
        type: 'number',
        description:
          'Maximum preparation time in minutes if mentioned, otherwise 0.',
      },
      dishSuggestions: {
        type: 'array',
        items: { type: 'string' },
        description:
          '3 to 5 concrete, well-known recipe or dish names that closely match the user request.',
      },
    },
    required: [
      'query',
      'includeIngredients',
      'cuisine',
      'diet',
      'maxReadyTime',
      'dishSuggestions',
    ],
  };

  const prompt = `Extract structured recipe search parameters from this user request: "${normalized}".
Return only valid JSON matching the schema.`;

  for (const modelName of PREFERRED_GEMINI_MODELS) {
    try {
      const model = googleAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });
      const parsed = JSON.parse(result.response.text());
      return enrichFiltersWithCulinaryIntelligence(
        {
          rawQuery: rawQuery?.trim() || '',
          query: parsed.query || normalized,
          includeIngredients: Array.isArray(parsed.includeIngredients)
            ? parsed.includeIngredients
            : [],
          cuisine: parsed.cuisine || '',
          diet: parsed.diet || '',
          maxReadyTime:
            typeof parsed.maxReadyTime === 'number' && parsed.maxReadyTime > 0
              ? parsed.maxReadyTime
              : null,
          dishSuggestions: Array.isArray(parsed.dishSuggestions)
            ? parsed.dishSuggestions
            : [],
          parserSource: 'Gemini AI',
          parserDetail: `Gemini AI (${modelName})`,
        },
        rawQuery
      );
    } catch {
      // Try next Gemini model or fall back to local parser
    }
  }

  return fallbackFilters;
}

function buildFallbackFilters(rawQuery) {
  const normalized = normalizeCulinaryQuery(rawQuery);
  if (!normalized) {
    return {
      rawQuery: '',
      normalizedQuery: '',
      query: 'popular',
      includeIngredients: [],
      cuisine: '',
      diet: '',
      maxReadyTime: null,
      dishSuggestions: [
        'Paneer Butter Masala',
        'Paneer Bhurji',
        'Butter Chicken',
        'Creamy Mushroom Pasta',
        'Pav Bhaji',
      ],
      strictHeroTerms: [],
      requiresPaneer: false,
      requiresEgg: false,
      hasMeatKeyword: false,
      isDessertQuery: false,
      isVegetarianQuery: false,
      allowsEggs: true,
      parserSource: 'Local Parser',
      parserDetail: 'Local Culinary Parser',
    };
  }

  const parts = normalized
    .split(/[,]+|\band\b|\bwith\b/i)
    .map((s) => s.trim())
    .filter(Boolean);

  return enrichFiltersWithCulinaryIntelligence(
    {
      rawQuery: rawQuery?.trim() || '',
      query: parts[0] || normalized,
      includeIngredients: parts.length > 1 ? parts : [],
      cuisine: '',
      diet: '',
      maxReadyTime: null,
      dishSuggestions: parts,
      parserSource: 'Local Parser',
      parserDetail: 'Local Culinary Parser',
    },
    rawQuery
  );
}

/**
 * Scores how relevant a candidate recipe is to the user's parsed filters.
 * Returns -1 if the recipe violates dietary, dessert/savory, or hero-ingredient constraints.
 */
export function scoreRecipeRelevance(recipe, filters) {
  if (!recipe || !recipe.recipeName) return -1;

  const titleLower = recipe.recipeName.toLowerCase();
  const cuisineLower = (recipe.cuisine || '').toLowerCase();
  const ingredientsText = (recipe.ingredients || []).join(' ').toLowerCase();
  const keywordsText = (recipe.keywords || []).join(' ').toLowerCase();
  const fullText = `${titleLower} ${cuisineLower} ${ingredientsText} ${keywordsText}`;

  // 1. Dessert / Cookie Guard: Never return cookies, cakes, or desserts for savory searches
  if (!filters.isDessertQuery) {
    if (DESSERT_RECIPE_REGEX.test(titleLower) || cuisineLower === 'dessert') {
      return -1;
    }
  }

  // 2. Vegetarian Guard: Never return meat/poultry/seafood for paneer or vegetarian queries
  if (filters.isVegetarianQuery) {
    if (
      MEAT_RECIPE_REGEX.test(titleLower) ||
      MEAT_RECIPE_REGEX.test(ingredientsText)
    ) {
      return -1;
    }
    if (
      !filters.allowsEggs &&
      (EGG_RECIPE_REGEX.test(titleLower) || EGG_RECIPE_REGEX.test(ingredientsText))
    ) {
      return -1;
    }
  }

  // 3. Strict Paneer Guard: If user searched for "paneer" (or "panner"), the recipe must be a paneer dish
  if (filters.requiresPaneer) {
    const hasPaneer = /\b(paneer|cottage cheese|chenna|chhena)\b/i.test(fullText);
    if (!hasPaneer) {
      return -1;
    }
  }

  // 4. Strict Egg Guard: If user searched for "egg" / "eggs", the recipe must contain real eggs
  if (filters.requiresEgg) {
    const hasRealEgg =
      /\b(egg|eggs|anda|omelette|yolks?)\b/i.test(titleLower) ||
      /\b(egg|eggs|anda|omelette|yolks?)\b/i.test(ingredientsText) ||
      /\b(egg|eggs|anda|omelette|yolks?)\b/i.test(keywordsText);
    if (!hasRealEgg) {
      return -1;
    }
  }

  // 5. Meat Guard: If user searched for meat (chicken, lamb, beef, etc.), recipe must contain meat
  if (filters.hasMeatKeyword) {
    const hasAnyMeat =
      MEAT_RECIPE_REGEX.test(titleLower) ||
      MEAT_RECIPE_REGEX.test(ingredientsText) ||
      MEAT_RECIPE_REGEX.test(keywordsText);
    if (!hasAnyMeat) {
      return -1;
    }
  }

  const normQuery = (filters.normalizedQuery || filters.query || '')
    .toLowerCase()
    .trim();

  // Content tokens (excluding generic modifiers like butter, masala, sauce, etc.)
  const queryTokens = normQuery
    .split(/[\s,]+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length >= 3 && !GENERIC_MODIFIER_WORDS.has(w));

  let matchedTitleTokens = 0;
  let matchedKeywordTokens = 0;
  let matchedIngredientTokens = 0;

  for (const token of queryTokens) {
    const variants = getWordVariants(token);
    if (variants.some((v) => titleLower.includes(v))) matchedTitleTokens++;
    if (variants.some((v) => keywordsText.includes(v))) matchedKeywordTokens++;
    if (variants.some((v) => ingredientsText.includes(v))) matchedIngredientTokens++;
  }

  // Guard against irrelevant matches:
  // For multi-token queries like "caramelized onion":
  // Must match at least one token in TITLE or KEYWORDS (prevents random dishes with raw chopped onion from matching)
  if (queryTokens.length >= 2) {
    if (matchedTitleTokens === 0 && matchedKeywordTokens === 0) {
      return -1;
    }
  } else if (queryTokens.length === 1) {
    if (
      matchedTitleTokens === 0 &&
      matchedKeywordTokens === 0 &&
      matchedIngredientTokens === 0
    ) {
      return -1;
    }
  }

  // Score starts at 0 (NOT 50!)
  let score = 0;

  // Exact full phrase match in recipe title (e.g. "paneer bhurji" or "caramelized onion")
  if (normQuery && titleLower.includes(normQuery)) {
    score += 650;
  } else if (normQuery && keywordsText.includes(normQuery)) {
    score += 350;
  }

  score +=
    matchedTitleTokens * 160 +
    matchedKeywordTokens * 80 +
    matchedIngredientTokens * 40;

  if (queryTokens.length > 1 && matchedTitleTokens === queryTokens.length) {
    score += 300;
  }

  // Specific dish word bonuses in title
  for (const token of queryTokens) {
    if (SPECIFIC_DISH_WORDS.includes(token) && titleLower.includes(token)) {
      score += 180;
    }
  }

  // Flavor/modifier word bonuses in title if searched (e.g. "butter", "masala", "garlic", "creamy")
  if (normQuery.includes('butter') && titleLower.includes('butter')) score += 70;
  if (normQuery.includes('masala') && titleLower.includes('masala')) score += 70;
  if (normQuery.includes('garlic') && titleLower.includes('garlic')) score += 50;
  if (normQuery.includes('creamy') && titleLower.includes('creamy')) score += 50;

  // Cuisine match bonus
  if (
    filters.cuisine &&
    cuisineLower &&
    cuisineLower.includes(filters.cuisine.toLowerCase())
  ) {
    score += 45;
  }

  return score < 60 ? -1 : score;
}

/**
 * Step 2A: Fetch concrete recipes from Spoonacular API (filtered for relevance).
 */
async function fetchFromSpoonacular(filters, quantity) {
  if (!SPOONACULAR_API_KEY) {
    return [];
  }

  const params = {
    apiKey: SPOONACULAR_API_KEY,
    addRecipeInformation: true,
    addRecipeNutrition: true,
    fillIngredients: true,
    instructionsRequired: true,
    number: Math.max(quantity * 2, 8),
  };

  const searchQuery = filters.normalizedQuery || filters.query;
  if (searchQuery) params.query = searchQuery;
  if (filters.cuisine) params.cuisine = filters.cuisine;
  if (filters.diet) params.diet = filters.diet.toLowerCase();
  if (filters.maxReadyTime) params.maxReadyTime = filters.maxReadyTime;

  const response = await axios.get(
    'https://api.spoonacular.com/recipes/complexSearch',
    { params }
  );

  let normalized = normalizeSpoonacularResults(
    response.data?.results || [],
    filters,
    'Spoonacular API (Complex Search)'
  );

  // Filter out any irrelevant matches (e.g. "Butter Cookies" for "paneer butter masala")
  normalized = normalized.filter((r) => scoreRecipeRelevance(r, filters) >= 0);

  if (normalized.length === 0 && filters.strictHeroTerms?.length > 0) {
    const heroQuery = filters.strictHeroTerms.join(' ');
    if (heroQuery && heroQuery !== searchQuery) {
      const retryParams = {
        ...params,
        query: heroQuery,
      };
      const retryResponse = await axios.get(
        'https://api.spoonacular.com/recipes/complexSearch',
        { params: retryParams }
      );
      const retryNormalized = normalizeSpoonacularResults(
        retryResponse.data?.results || [],
        filters,
        'Spoonacular API (Hero Ingredient Search)'
      );
      normalized = retryNormalized.filter(
        (r) => scoreRecipeRelevance(r, filters) >= 0
      );
    }
  }

  return normalized;
}

function normalizeSpoonacularResults(
  results,
  filters,
  searchDetail = 'Spoonacular API'
) {
  return results.map((item) => {
    const nutrients = item.nutrition?.nutrients || [];
    const calorieObj = nutrients.find(
      (n) => n.name?.toLowerCase() === 'calories'
    );
    const calories = calorieObj ? Math.round(calorieObj.amount) : 380;

    const extendedIngredients = item.extendedIngredients || [];
    const hasExtended = extendedIngredients.length > 0;
    const ingredients = hasExtended
      ? extendedIngredients.map((ing) => ing.original || ing.name)
      : (item.usedIngredients || [])
          .concat(item.missedIngredients || [])
          .map((ing) => ing.original || ing.name);

    const usedNames = new Set(
      (item.usedIngredients || []).map((u) => (u.name || '').toLowerCase())
    );
    filters.includeIngredients?.forEach((ing) =>
      usedNames.add(ing.toLowerCase())
    );

    const matchedIngredients = extendedIngredients
      .filter((ing) => {
        const nameLower = (ing.name || ing.original || '').toLowerCase();
        return Array.from(usedNames).some(
          (u) => u && nameLower.includes(u)
        );
      })
      .map((ing) => ing.name || ing.original);

    let steps = [];
    let stepsSource = 'Fallback Default Step';
    if (
      Array.isArray(item.analyzedInstructions) &&
      item.analyzedInstructions.length > 0 &&
      Array.isArray(item.analyzedInstructions[0].steps)
    ) {
      steps = item.analyzedInstructions[0].steps
        .map((s) => s.step?.trim())
        .filter(Boolean);
      if (steps.length > 0) {
        stepsSource = 'Spoonacular (Analyzed Instructions)';
      }
    } else if (
      typeof item.instructions === 'string' &&
      item.instructions.trim()
    ) {
      steps = item.instructions
        .replace(/<[^>]+>/g, ' ')
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5);
      if (steps.length > 0) {
        stepsSource = 'Spoonacular (Instructions Text)';
      }
    }

    const scoreOutOf5 = item.spoonacularScore
      ? Math.max(
          3.5,
          Math.min(5, Number((item.spoonacularScore / 20).toFixed(1)))
        )
      : 4.5;

    const existingYtId = extractYouTubeId(item.sourceUrl);

    const cuisineValue =
      item.cuisines?.[0] ||
      filters.cuisine ||
      (item.dishTypes?.[0]
        ? item.dishTypes[0].charAt(0).toUpperCase() +
          item.dishTypes[0].slice(1)
        : 'Concrete Recipe');

    return {
      id: `spoon-${item.id}`,
      recipeName: item.title,
      image: item.image || '',
      cuisine: cuisineValue,
      time_required: item.readyInMinutes || 30,
      taste_rating: scoreOutOf5,
      calories,
      serving: item.servings || 2,
      ingredients,
      matchedIngredients,
      steps:
        steps.length > 0
          ? steps
          : [
              'Prepare the listed ingredients and cook according to the video guide above.',
            ],
      sourceUrl: item.sourceUrl || '',
      youtubeVideoId: existingYtId,
      videoThumbnail: item.image || '',
      videoTitle: item.title,
      dataSources: {
        queryParser: filters.parserDetail || 'Local Parser',
        recipe: 'Spoonacular API',
        recipeDetail: searchDetail,
        steps: stepsSource,
      },
    };
  });
}

/**
 * Step 2C: Concrete Recipe Database Fallback (TheMealDB)
 * Uses normalized terms and strict relevance filtering so generic words like "butter"
 * never pull in unrelated desserts like "Peanut Butter Cookies".
 */
async function fetchFromMealDB(filters, quantity) {
  const collectedMeals = new Map();

  const addMeals = (meals, matchMethod) => {
    if (!Array.isArray(meals)) return;
    for (const m of meals) {
      if (m?.idMeal && !collectedMeals.has(m.idMeal)) {
        const normalizedItem = normalizeMealDBItem(m, filters, matchMethod);
        const rel = scoreRecipeRelevance(normalizedItem, filters);
        if (rel >= 60) {
          collectedMeals.set(m.idMeal, normalizedItem);
        }
      }
    }
  };

  const normQuery = (filters.normalizedQuery || filters.query || '').trim();
  const queryTokens = normQuery
    .split(/[\s,]+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length >= 3 && !GENERIC_MODIFIER_WORDS.has(w));

  const specificDishTerms = queryTokens.filter((t) =>
    SPECIFIC_DISH_WORDS.includes(t)
  );
  const otherTokens = queryTokens.filter(
    (t) => !SPECIFIC_DISH_WORDS.includes(t)
  );

  const searchCandidates = new Set();
  if (normQuery) searchCandidates.add(normQuery);
  for (const s of specificDishTerms) {
    searchCandidates.add(s);
  }
  for (const sug of filters.dishSuggestions || []) {
    if (sug && !GENERIC_MODIFIER_WORDS.has(sug.toLowerCase())) {
      searchCandidates.add(sug);
    }
  }
  for (const t of otherTokens) {
    searchCandidates.add(t);
    for (const v of getWordVariants(t)) {
      if (v.length >= 3 && !GENERIC_MODIFIER_WORDS.has(v)) {
        searchCandidates.add(v);
      }
    }
  }
  for (const hero of filters.strictHeroTerms || []) {
    if (!GENERIC_MODIFIER_WORDS.has(hero.toLowerCase())) {
      searchCandidates.add(hero);
    }
  }

  for (const term of searchCandidates) {
    // Check specific dish and multi-word terms first before breaking
    if (
      collectedMeals.size >= quantity * 2 &&
      !specificDishTerms.includes(term) &&
      term !== normQuery
    ) {
      break;
    }
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          term
        )}`
      );
      addMeals(res.data?.meals, `TheMealDB (Search "${term}")`);
    } catch {
      // Ignore individual term errors
    }
  }

  // 2. Filter by ingredients if we still need more recipes
  const possibleIngredients = new Set([
    ...(filters.includeIngredients || []),
    ...queryTokens,
  ]);
  for (const ing of possibleIngredients) {
    if (collectedMeals.size >= quantity * 2) break;
    if (GENERIC_MODIFIER_WORDS.has(ing.toLowerCase())) continue;
    try {
      const filterRes = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
          ing
        )}`
      );
      const summaries = (filterRes.data?.meals || []).slice(
        0,
        Math.max(quantity * 2, 6)
      );
      const detailPromises = summaries.map((s) =>
        axios
          .get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${s.idMeal}`
          )
          .then((r) => r.data?.meals?.[0])
          .catch(() => null)
      );
      const detailedMeals = await Promise.all(detailPromises);
      addMeals(
        detailedMeals.filter(Boolean),
        `TheMealDB (Ingredient Filter "${ing}")`
      );
    } catch {
      // Ignore individual ingredient errors
    }
  }

  // 3. Filter by cuisine/area ONLY if no strict hero constraint or if meals pass relevance filter
  if (
    collectedMeals.size < quantity &&
    filters.cuisine &&
    !filters.requiresPaneer
  ) {
    try {
      const areaRes = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
          filters.cuisine
        )}`
      );
      const summaries = (areaRes.data?.meals || []).slice(0, 8);
      const detailPromises = summaries.map((s) =>
        axios
          .get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${s.idMeal}`
          )
          .then((r) => r.data?.meals?.[0])
          .catch(() => null)
      );
      const detailedMeals = await Promise.all(detailPromises);
      addMeals(
        detailedMeals.filter(Boolean),
        `TheMealDB (Cuisine Filter "${filters.cuisine}")`
      );
    } catch {
      // Ignore area error
    }
  }

  return Array.from(collectedMeals.values());
}

function normalizeMealDBItem(meal, filters, matchMethod) {
  const ingredients = [];
  const rawIngredientNames = [];

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (ing) {
      rawIngredientNames.push(ing);
      ingredients.push(measure ? `${measure} ${ing}` : ing);
    }
  }

  const userIngs = (filters.includeIngredients || []).map((i) =>
    i.toLowerCase()
  );
  const matchedIngredients = rawIngredientNames.filter((ingName) =>
    userIngs.some(
      (u) =>
        u &&
        (ingName.toLowerCase().includes(u) ||
          u.includes(ingName.toLowerCase()))
    )
  );

  const rawInstructions = meal.strInstructions || '';
  const steps = rawInstructions
    .split(/\r?\n+/)
    .flatMap((line) => {
      const cleaned = line
        .replace(/^(step\s*\d+[:.)\-\s]*|\d+[.)\s]+)/i, '')
        .trim();
      if (!cleaned) return [];
      if (cleaned.length > 220) {
        return cleaned
          .split(/(?<=[.!?])\s+(?=[A-Z])/)
          .map((s) => s.trim())
          .filter((s) => s.length > 8);
      }
      return [cleaned];
    })
    .filter((s) => s.length > 4 && !/^step\s*\d+$/i.test(s));

  const youtubeVideoId = extractYouTubeId(meal.strYoutube);

  const estimatedMinutes = Math.min(
    90,
    Math.max(
      15,
      Math.round((ingredients.length * 2.5 + steps.length * 3) / 5) * 5
    )
  );
  const estimatedCalories = Math.min(
    850,
    Math.max(220, Math.round(ingredients.length * 42 + 120))
  );
  const serving = Math.max(2, Math.min(6, Math.round(ingredients.length / 3)));

  return {
    id: `mealdb-${meal.idMeal}`,
    recipeName: meal.strMeal,
    image: meal.strMealThumb || '',
    cuisine: meal.strArea || meal.strCategory || 'Global',
    time_required: estimatedMinutes,
    taste_rating: 4.6,
    calories: estimatedCalories,
    serving,
    ingredients,
    matchedIngredients,
    steps:
      steps.length > 0
        ? steps
        : [rawInstructions || 'Follow the video instructions above.'],
    sourceUrl: meal.strSource || meal.strYoutube || '',
    youtubeVideoId,
    videoThumbnail: youtubeVideoId
      ? `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`
      : meal.strMealThumb || '',
    videoTitle: `${meal.strMeal} Recipe`,
    dataSources: {
      queryParser: filters.parserDetail || 'Local Parser',
      recipe: 'TheMealDB API',
      recipeDetail: matchMethod || 'TheMealDB API',
    },
  };
}

/**
 * Step 3: Enrich recipes with YouTube videos (matching recipe + similar ingredients).
 * Uses YouTube Data API v3 when VITE_YOUTUBE_API_KEY is available,
 * or resolves via verified YouTube IDs as a fallback.
 */
async function enrichRecipesWithYouTube(recipes, filters) {
  return Promise.all(
    recipes.map(async (recipe) => {
      const cleanDishTitle = recipe.recipeName.replace(/\s*\([^)]*\)/g, '').trim();
      const keyIngredients = (
        recipe.matchedIngredients?.length > 0
          ? recipe.matchedIngredients
          : filters.includeIngredients || []
      )
        .slice(0, 2)
        .join(' ');

      const searchQuery = `${cleanDishTitle} recipe ${keyIngredients}`.trim();
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchQuery
      )}`;

      // 1. If YouTube Data API key is configured, fetch the best matching embeddable video
      if (YOUTUBE_API_KEY) {
        try {
          const ytRes = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
              params: {
                part: 'snippet',
                q: searchQuery,
                type: 'video',
                videoEmbeddable: 'true',
                maxResults: 1,
                key: YOUTUBE_API_KEY,
              },
            }
          );

          const videoItem = ytRes.data?.items?.[0];
          const videoId = videoItem?.id?.videoId;
          if (videoId) {
            return {
              ...recipe,
              youtubeVideoId: videoId,
              videoTitle: videoItem.snippet?.title || recipe.recipeName,
              channelTitle: videoItem.snippet?.channelTitle || '',
              videoThumbnail:
                videoItem.snippet?.thumbnails?.high?.url ||
                videoItem.snippet?.thumbnails?.medium?.url ||
                `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              youtubeSearchUrl,
              dataSources: {
                ...recipe.dataSources,
                video: 'YouTube Data API v3',
                videoDetail: `YouTube Data API v3 (Search: "${searchQuery}")`,
                thumbnail: 'YouTube Data API v3 Thumbnail',
              },
            };
          }
        } catch {
          // Fall through to existing video ID or MealDB lookup if YouTube quota/key fails
        }
      }

      // 2. If the recipe already has a concrete youtubeVideoId
      if (recipe.youtubeVideoId) {
        return {
          ...recipe,
          videoThumbnail:
            recipe.videoThumbnail ||
            `https://i.ytimg.com/vi/${recipe.youtubeVideoId}/hqdefault.jpg`,
          youtubeSearchUrl,
        };
      }

      // 3. Try resolving a matching YouTube video ID from TheMealDB by dish title
      try {
        const mealRes = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            cleanDishTitle
          )}`
        );
        const matchedMeal = mealRes.data?.meals?.[0];
        const fallbackYtId = extractYouTubeId(matchedMeal?.strYoutube);
        if (fallbackYtId) {
          return {
            ...recipe,
            youtubeVideoId: fallbackYtId,
            videoThumbnail:
              recipe.image ||
              `https://i.ytimg.com/vi/${fallbackYtId}/hqdefault.jpg`,
            youtubeSearchUrl,
          };
        }
      } catch {
        // Ignore lookup error
      }

      return {
        ...recipe,
        videoThumbnail: recipe.image || '',
        youtubeSearchUrl,
      };
    })
  );
}

/**
 * Helper to deduplicate recipes by canonical name so we never show duplicate dishes.
 */
function deduplicateAndRankRecipes(candidates, filters, quantity) {
  const seenKeys = new Set();
  const scoredList = [];

  for (const recipe of candidates) {
    const relevance = scoreRecipeRelevance(recipe, filters);
    if (relevance < 0) continue;

    // Canonicalize title (e.g., "Matar Paneer" and "Homestyle Punjabi Matar Paneer (...)")
    const baseTitle = recipe.recipeName
      .toLowerCase()
      .replace(/\s*\([^)]*\)/g, '')
      .replace(
        /\b(homestyle|punjabi|restaurant-style|restaurant style|dhaba-style|dhaba style|authentic|classic|street-style|street style)\b/g,
        ''
      )
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

    if (seenKeys.has(baseTitle)) continue;
    seenKeys.add(baseTitle);

    scoredList.push({ recipe, relevance });
  }

  scoredList.sort((a, b) => b.relevance - a.relevance);
  return scoredList.slice(0, quantity).map((item) => item.recipe);
}

/**
 * Dynamic recipe generation via Gemini AI when external APIs
 * do not have enough concrete recipes matching the user's specific request.
 */
async function generateRecipesWithGemini(filters, quantity) {
  if (!GEMINI_API_KEY) return [];

  const googleAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const queryStr = filters.normalizedQuery || filters.query || 'delicious dish';
  const prompt = `Generate exactly ${quantity} authentic, high-quality recipes matching: "${queryStr}".
Cuisine: ${filters.cuisine || 'Authentic'}, Diet: ${filters.diet || 'Any'}.
Return a raw JSON array of objects conforming to this schema:
[
  {
    "recipeName": "string",
    "cuisine": "string",
    "ingredients": ["string with exact measurement and item"],
    "steps": ["detailed step string"],
    "time_required": number,
    "taste_rating": number,
    "calories": number,
    "serving": number
  }
]
Return only the raw JSON array.`;

  for (const modelName of PREFERRED_GEMINI_MODELS) {
    try {
      const model = googleAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(result.response.text());
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => {
          const matchedIngredients = (item.ingredients || []).filter((ing) =>
            (filters.includeIngredients || []).some(
              (u) => u && ing.toLowerCase().includes(u.toLowerCase())
            )
          );
          return {
            id: `ai-${Date.now()}-${idx}`,
            recipeName: item.recipeName,
            image: '',
            cuisine: item.cuisine || filters.cuisine || 'Global',
            time_required: item.time_required || 30,
            taste_rating: Number(item.taste_rating) || 4.7,
            calories: item.calories || 420,
            serving: item.serving || 2,
            ingredients: item.ingredients || [],
            matchedIngredients,
            steps: item.steps || [],
            sourceUrl: '',
            youtubeVideoId: null,
            videoThumbnail: '',
            videoTitle: `${item.recipeName} Recipe`,
            dataSources: {
              queryParser: filters.parserDetail || 'Gemini AI',
              recipe: `Gemini AI (${modelName})`,
              recipeDetail: 'Dynamic Culinary AI Generation',
              steps: 'Step-by-Step AI Chef Method',
            },
          };
        });
      }
    } catch {
      // Try next model
    }
  }

  return [];
}

/**
 * Main orchestrator:
 * 1. Normalizes spelling (e.g. "panner" -> "paneer") & parses query into structured filters
 * 2. Fetches dynamic recipes from TheMealDB + Spoonacular (+ dynamic Gemini AI fallback)
 * 3. Strictly filters out irrelevant dishes and ranks exact matches first
 * 4. Attaches matching YouTube videos for each recipe card & popup
 */
export async function searchConcreteRecipes(rawQuery, quantity = 5) {
  const filters = await parseSearchQueryWithGemini(rawQuery);

  const allCandidates = [];

  // 1. Fetch concrete global recipes from TheMealDB
  try {
    const mealDbRecipes = await fetchFromMealDB(filters, quantity * 2);
    allCandidates.push(...mealDbRecipes);
  } catch (err) {
    console.warn('TheMealDB lookup error:', err?.message);
  }

  // 2. Query Spoonacular if API key is configured and active
  if (SPOONACULAR_API_KEY) {
    try {
      const spoonacularRecipes = await fetchFromSpoonacular(filters, quantity);
      if (spoonacularRecipes && spoonacularRecipes.length > 0) {
        allCandidates.push(...spoonacularRecipes);
      }
    } catch {
      // Spoonacular failed or daily quota exhausted (402)
    }
  }

  // 3. Fallback to dynamic Gemini AI generation if APIs returned fewer than requested recipes
  if (allCandidates.length < quantity && GEMINI_API_KEY) {
    try {
      const needed = quantity - allCandidates.length;
      const aiRecipes = await generateRecipesWithGemini(filters, needed);
      allCandidates.push(...aiRecipes);
    } catch (err) {
      console.warn('Gemini dynamic recipe generation error:', err?.message);
    }
  }

  // 4. Global deduplication and relevance ranking across all sources
  const finalRecipes = deduplicateAndRankRecipes(
    allCandidates,
    filters,
    quantity
  );

  const enriched = await enrichRecipesWithYouTube(finalRecipes, filters);

  return {
    recipes: enriched,
    filters,
  };
}
