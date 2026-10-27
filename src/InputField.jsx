/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { fadeIn, EASE_EDITORIAL } from './variants.js';

const PANTRY_STAPLES = [
  'Chicken',
  'Garlic',
  'Pasta',
  'Paneer',
  'Mushrooms',
  'Spinach',
  'Eggs',
  'Tomatoes',
  'Lemon',
];

const CURATED_CRAVINGS = [
  {
    label: 'Shawarma Chicken',
    query: 'chicken shawarma garlic',
  },
  {
    label: 'Creamy Mushroom Pasta',
    query: 'creamy garlic mushroom pasta',
  },
  {
    label: 'Paneer Tikka Masala',
    query: 'paneer tikka masala',
  },
  {
    label: 'Street Beef Tacos',
    query: 'beef tacos lime',
  },
  {
    label: 'Roman Carbonara',
    query: 'spaghetti carbonara',
  },
];

function InputField(props) {
  const currentText = props.question || '';

  const handleToggleIngredient = (ingredient) => {
    const lowerIng = ingredient.toLowerCase();
    const parts = currentText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const exists = parts.some((p) => p.toLowerCase() === lowerIng);
    let nextQuery = '';
    if (exists) {
      nextQuery = parts.filter((p) => p.toLowerCase() !== lowerIng).join(', ');
    } else {
      nextQuery = [...parts, lowerIng].join(', ');
    }
    props.onQuestionChange(nextQuery);
  };

  const isIngredientActive = (ingredient) => {
    const lower = currentText.toLowerCase();
    return lower.includes(ingredient.toLowerCase());
  };

  const handlePresetClick = (presetQuery) => {
    props.onQuestionChange(presetQuery);
    if (props.onRunPreset) {
      props.onRunPreset(presetQuery);
    }
  };

  return (
    <motion.div
      variants={fadeIn('up', 0.2, true)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="w-full space-y-3.5"
    >
      {/* Main Search Console */}
      <div className="command-bar-wrapper rounded-2xl p-2 sm:p-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Row 1 on mobile: Dishes Selector & Primary Input side-by-side */}
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {/* High-Contrast Dish Count Selector */}
            <div className="dishes-selector-box flex items-center justify-between sm:justify-start gap-2.5 rounded-xl px-2 py-2.5 sm:py-3 flex-shrink-0">
              <div className="relative flex items-center">
                <select
                  aria-label="Number of recipes to show"
                  value={props.quantity}
                  onChange={(e) =>
                    props.onQuantityChange(parseInt(e.target.value, 10))
                  }
                  style={{ backgroundColor: '#EAD2B0' }}
                  className="text-sm sm:text-lg font-extrabold text-secondary rounded-lg pr-5 pl-2.5 py-0.5 cursor-pointer focus:outline-none focus:border-secondary"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option
                      value={num}
                      key={num}
                      style={{ backgroundColor: '#FFF6E8', color: '#221C18' }}
                    >
                      {num}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-fill text-sm text-ink pointer-events-none absolute right-1.5"></i>
              </div>
            </div>

            {/* Primary Kitchen Search Input */}
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                value={currentText}
                placeholder="Type ingredients or a dish you crave..."
                className="w-full min-w-0 h-12 sm:h-13 px-2.5 sm:px-1 bg-transparent text-ink text-base sm:text-lg font-semibold placeholder:text-stone/80 outline-none"
                onChange={(e) => props.onQuestionChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    props.generateRecipe();
                  }
                }}
              />
              {currentText && (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={() => props.onQuestionChange('')}
                  className="text-stone hover:text-secondary p-1.5 mr-1 transition-colors"
                >
                  <i className="ri-close-circle-fill text-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <motion.button
            type="button"
            data-cursor="COOK"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
            onClick={() => props.generateRecipe()}
            className="btn-awwwards rounded-xl px-6 sm:px-6 py-4 font-display uppercase tracking-wider text-base sm:text-base flex items-center justify-center gap-2 flex-shrink-0 shadow-md font-bold"
          >
            <span>Let&apos;s Cook</span>
          </motion.button>
        </div>
      </div>

      {/* Interactive Pantry Quick-Add Builder + Popular Dishes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="overline-label text-ink mr-1 flex items-center gap-1.5">
            <span
              style={{ backgroundColor: '#1B7A43', color: '#FFFFFF' }}
              className="w-5 h-5 rounded-md inline-flex items-center justify-center text-[11px] shadow-sm"
            >
              <i className="ri-leaf-fill"></i>
            </span>
            Pantry Tap:
          </span>
          {PANTRY_STAPLES.map((ing) => {
            const active = isIngredientActive(ing);
            return (
              <motion.button
                key={ing}
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => handleToggleIngredient(ing)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                  active ? 'pantry-chip-active scale-105' : 'pantry-chip'
                }`}
              >
                <i className={active ? 'ri-check-line font-bold' : 'ri-add-line'}></i>
                <span>{ing}</span>
              </motion.button>
            );
          })}
        </div>

        {/* One-Click Popular Cravings */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="overline-label text-secondary mr-1 flex items-center gap-1">
            <i className="ri-fire-fill text-sm"></i>
            Hot:
          </span>
          {CURATED_CRAVINGS.slice(0, 3).map((item) => (
            <motion.button
              key={item.query}
              type="button"
              data-cursor="TASTE"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => handlePresetClick(item.query)}
              className="hot-chip text-xs font-bold rounded-lg px-3 py-1.5"
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default InputField;
