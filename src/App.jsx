import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, statusPresence, EASE_EDITORIAL } from './variants.js';
import Card from './Card';
import Tagline from './Tagline';
import InputField from './InputField';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import { searchConcreteRecipes } from './services/recipeService';

const CULINARY_COLLECTIONS = [
  {
    title: 'Italian Trattoria',
    subtitle: 'Silky pastas, slow-simmered sauces & garlic-infused classics',
    tag: 'Comfort & Pasta',
    query: 'italian pasta garlic',
    image:
      'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg',
  },
  {
    title: 'Indian Spice Kitchen',
    subtitle: 'Aromatic curries, charred tikka & rich velvety gravies',
    tag: 'Bold & Spiced',
    query: 'chicken curry masala',
    image:
      'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg',
  },
  {
    title: 'Weeknight Skillets',
    subtitle: 'High-flavor chicken, seared greens & pan sauces under 30 mins',
    tag: 'Quick & Easy',
    query: 'chicken garlic spinach',
    image:
      'https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg',
  },
  {
    title: 'Mexican Street Classics',
    subtitle: 'Charred meats, bright citrus, smoky chilies & warm tortillas',
    tag: 'Fresh & Zesty',
    query: 'tacos beef chicken',
    image:
      'https://www.themealdb.com/images/media/meals/ypxvwv1505333929.jpg',
  },
  {
    title: 'Cozy Comfort Bowls',
    subtitle: 'Hearty stews, savory noodles & soul-warming one-pot meals',
    tag: 'Warm & Hearty',
    query: 'noodle soup bowl',
    image:
      'https://www.themealdb.com/images/media/meals/1529444830.jpg',
  },
  {
    title: 'Plant-Forward & Fresh',
    subtitle: 'Vibrant vegetables, crispy paneer, herbs & wholesome grains',
    tag: 'Vegetarian',
    query: 'vegetarian mushroom spinach',
    image:
      'https://www.themealdb.com/images/media/meals/rvxxuy1468312893.jpg',
  },
];

function App() {
  const [question, setQuestion] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [recipes, setRecipes] = useState([]);
  const [activeFilters, setActiveFilters] = useState(null);
  const resultsRef = useRef(null);

  async function generateAnswer(overrideQuery) {
    const queryToUse =
      typeof overrideQuery === 'string' ? overrideQuery : question;

    if (!queryToUse.trim()) {
      setErrorMessage('Please enter an ingredient, dish, or craving first.');
      return;
    }

    setErrorMessage('');
    setLoadingMessage(
      'Gathering fresh recipes & step-by-step cooking videos...'
    );

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const { recipes: foundRecipes, filters } = await searchConcreteRecipes(
        queryToUse,
        quantity
      );

      setActiveFilters(filters);
      setRecipes(foundRecipes);

      if (foundRecipes.length === 0) {
        setErrorMessage(
          'We couldn’t find an exact match for that combination. Try broader ingredients or dish names like "chicken garlic pasta", "paneer", or "tacos".'
        );
      }
    } catch (e) {
      console.error('Recipe search failed:', e);
      setErrorMessage(
        'Could not load recipes right now — please try again in a moment.'
      );
    } finally {
      setLoadingMessage('');
    }
  }

  const handleCollectionSelect = (queryText) => {
    setQuestion(queryText);
    generateAnswer(queryText);
  };

  const getRecipeCards = () =>
    recipes.map((recipe, index) => (
      <Card
        key={recipe.id || index}
        index={index}
        isFeatured={index === 0 && recipes.length > 1}
        recipeName={recipe.recipeName}
        ingredients={recipe.ingredients}
        matchedIngredients={recipe.matchedIngredients}
        steps={recipe.steps}
        tasteRating={recipe.taste_rating}
        serving={recipe.serving}
        calories={recipe.calories}
        timeRequired={recipe.time_required}
        cuisine={recipe.cuisine}
        image={recipe.image}
        youtubeVideoId={recipe.youtubeVideoId}
        videoThumbnail={recipe.videoThumbnail}
        videoTitle={recipe.videoTitle}
        channelTitle={recipe.channelTitle}
        youtubeSearchUrl={recipe.youtubeSearchUrl}
        sourceUrl={recipe.sourceUrl}
      />
    ));

  return (
    <div className="ambient-editorial-bg flex flex-col min-h-screen">
      <CustomCursor />

      {/* Hero with Integrated Search & Pantry Builder */}
      <Tagline>
        <InputField
          question={question}
          generateRecipe={() => generateAnswer()}
          onRunPreset={handleCollectionSelect}
          onQuestionChange={setQuestion}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </Tagline>

      <main className="flex-grow max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12">
        <div ref={resultsRef} className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {/* Warm Kitchen Loading State */}
            {loadingMessage && (
              <motion.div
                key="loading-banner"
                variants={statusPresence}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6 mb-12 p-8 sm:p-12 rounded-3xl border editorial-border bg-darkprimary/55 flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <div
                    style={{ backgroundColor: '#EE3E31', color: '#FFF6E8' }}
                    className="wave-icon-1 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md"
                  >
                    <i className="ri-fire-fill"></i>
                  </div>
                  <div
                    style={{ backgroundColor: '#221C18', color: '#FFF6E8' }}
                    className="wave-icon-2 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md"
                  >
                    <i className="ri-restaurant-2-fill"></i>
                  </div>
                  <div
                    style={{ backgroundColor: '#1B7A43', color: '#FFF6E8' }}
                    className="wave-icon-3 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md"
                  >
                    <i className="ri-bowl-fill"></i>
                  </div>
                </div>
                <p className="h2-editorial text-ink max-w-xl">{loadingMessage}</p>
                <p className="text-sm text-umber mt-2">
                  Measuring ingredients and queuing up your cooking demonstrations...
                </p>
              </motion.div>
            )}

            {/* Friendly Notice State */}
            {!loadingMessage && errorMessage && (
              <motion.div
                key="error-banner"
                variants={statusPresence}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6 mb-10 p-6 rounded-2xl border border-secondary/35 bg-secondary/5 text-center"
              >
                <p className="text-ink font-medium text-base">{errorMessage}</p>
              </motion.div>
            )}

            {/* Active Search Results Section */}
            {!loadingMessage && recipes.length > 0 && activeFilters && (
              <motion.section
                key="results-section"
                variants={statusPresence}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6 pt-8 border-t editorial-border space-y-6 mb-16"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="overline-label text-secondary block mb-1.5">
                      Fresh from the Kitchen
                    </span>
                    <h2 className="h1-editorial text-ink">
                      Tonight’s Curated Menu{' '}
                      
                    </h2>
                  </div>

                  {(activeFilters.includeIngredients?.length > 0 ||
                    activeFilters.cuisine ||
                    activeFilters.diet ||
                    activeFilters.dishSuggestions?.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {activeFilters.cuisine && (
                        <span className="text-xs bg-secondary text-primary font-semibold px-3.5 py-1.5 rounded-md">
                          {activeFilters.cuisine} Kitchen
                        </span>
                      )}
                      {activeFilters.diet && (
                        <span className="text-xs bg-sage text-primary font-semibold px-3.5 py-1.5 rounded-md">
                          {activeFilters.diet}
                        </span>
                      )}
                      {activeFilters.includeIngredients?.map((ing, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-darkprimary border editorial-border text-ink font-medium px-3 py-1.5 rounded-md"
                        >
                          + {ing}
                        </span>
                      ))}
                      {activeFilters.dishSuggestions
                        ?.slice(0, 3)
                        .map((sug, idx) => (
                          <motion.button
                            key={`sug-${idx}`}
                            type="button"
                            data-cursor="TASTE"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCollectionSelect(sug)}
                            className="text-xs bg-primary hover:bg-secondary hover:text-primary border editorial-border text-umber px-3 py-1.5 rounded-full transition-colors"
                          >
                            Try: {sug}
                          </motion.button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Bento & Asymmetric Recipe Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {getRecipeCards()}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Home Page Section: Explore by Kitchen Mood & Cuisine */}
        <section className="pt-10 pb-14 border-t editorial-border">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <motion.span
                variants={fadeIn('up1', 0.05, true, 0.6)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="overline-label text-secondary block mb-1.5"
              >
                Curated Collections
              </motion.span>
              <motion.h2
                variants={fadeIn('up', 0.12, true, 0.75)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="h1-editorial text-ink"
              >
                Explore by{' '}
                <span className="font-editorial-italic text-secondary">
                  craving &amp; cuisine.
                </span>
              </motion.h2>
            </div>
            <motion.p
              variants={fadeIn('up', 0.22, true, 0.75)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="text-sm text-umber max-w-md font-semibold"
            >
              Not sure where to start? Pick a kitchen mood below to load a
              hand-picked menu with full ingredient lists and video guides.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {CULINARY_COLLECTIONS.map((item, idx) => (
              <motion.div
                key={item.title}
                variants={fadeIn('up', 0.06 * idx, true)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.35, ease: EASE_EDITORIAL },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCollectionSelect(item.query)}
                data-cursor="EXPLORE"
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border editorial-border shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/45 transition-colors" />

                <div className="absolute top-4 left-4">
                  <span className="bg-primary/95 text-ink text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </span>
                </div>

                <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-editorial text-2xl text-primary leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-primary/80 mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-primary/90 text-ink group-hover:bg-secondary group-hover:text-primary transition-all duration-300 flex items-center justify-center flex-shrink-0 group-hover:rotate-45">
                    <i className="ri-arrow-right-up-line text-lg"></i>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
