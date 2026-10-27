/* eslint-disable react/prop-types */

import { useState } from 'react';
import RecipePopUp from './RecipePopUp';
import { motion, AnimatePresence } from 'framer-motion';
import { cardEntrance, EASE_EDITORIAL } from './variants.js';

function Card(props) {
  const [showRecipe, setShowRecipe] = useState(false);
  const thumbnail = props.videoThumbnail || props.image;
  const isFeatured = Boolean(props.isFeatured);
  const previewIngredients = (props.ingredients || []).slice(0, 3);
  const remainingCount = Math.max(
    0,
    (props.ingredients || []).length - previewIngredients.length
  );

  return (
    <>
      <motion.article
        variants={cardEntrance(props.index || 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        whileHover={{
          y: -6,
          transition: { duration: 0.35, ease: EASE_EDITORIAL },
        }}
        className={`editorial-card overflow-hidden flex flex-col justify-between w-full ${
          isFeatured
            ? 'lg:col-span-2 lg:grid lg:grid-cols-12 lg:gap-0'
            : ''
        }`}
      >
        {/* Visual / Cinema Preview Column */}
        <div
          onClick={() => setShowRecipe(true)}
          data-cursor="WATCH"
          className={`relative overflow-hidden cursor-pointer group bg-darkprimary ${
            isFeatured
              ? 'h-64 sm:h-80 lg:h-full lg:min-h-[370px] lg:col-span-7'
              : 'h-56 sm:h-60 w-full'
          }`}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={props.recipeName}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary text-5xl">
              <i className="ri-bowl-line"></i>
            </div>
          )}

          {/* Warm Appetizing Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 group-hover:via-black/25 transition-colors duration-500" />

          {/* Top Bar Overlays: Chef's Badge + Cuisine */}
          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
            {isFeatured
                ? <span className="bg-ink/80 backdrop-blur-md text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
              <i className="ri-fire-fill text-secondary"></i>
              {isFeatured
                ? "Chef's Featured Dish"
                : ``}
            </span>
                : <span>
            </span>
            }
            

            <span className="bg-primary/95 text-ink px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              {props.cuisine}
            </span>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-md text-ink group-hover:bg-secondary group-hover:text-primary flex items-center justify-center shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <i className="ri-play-fill text-2xl ml-0.5"></i>
            </div>
          </div>

          {/* Bottom Bar Overlay: Video Guide Indicator + Time */}
          <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between gap-2">
            <span className="bg-black/70 backdrop-blur-md text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <i className="ri-play-circle-fill text-secondary text-sm"></i>
              <span>Step-by-Step Video Included</span>
            </span>

            <span className="bg-black/60 backdrop-blur-md text-primary/95 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <i className="ri-time-line"></i>
              {props.timeRequired} mins
            </span>
          </div>
        </div>

        {/* Culinary Content & Metrics Column */}
        <div
          className={`p-5 sm:p-6 flex flex-col justify-between flex-1 ${
            isFeatured ? 'lg:col-span-5 lg:p-7' : ''
          }`}
        >
          <div>
            {/* Ingredient Match Subtitle */}
            <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-medium">
              <span className="text-secondary flex items-center gap-1">
                <i className="ri-shopping-basket-2-line"></i>
                {props.ingredients ? props.ingredients.length : 0} Ingredients
              </span>
              {props.matchedIngredients?.length > 0 ? (
                <span className="text-sage font-semibold flex items-center gap-1">
                  <i className="ri-checkbox-circle-fill"></i>
                  {props.matchedIngredients.length} in your kitchen
                </span>
              ) : (
                <span className="text-stone">
                  {props.steps ? props.steps.length : 0} cooking steps
                </span>
              )}
            </div>

            {/* Warm Cookbook Dish Title */}
            <h3
              onClick={() => setShowRecipe(true)}
              className={`font-editorial text-ink hover:text-secondary transition-colors cursor-pointer ${
                isFeatured
                  ? 'text-2xl sm:text-3xl leading-snug'
                  : 'text-xl sm:text-2xl leading-snug line-clamp-2'
              }`}
              title={props.recipeName}
            >
              {props.recipeName}
            </h3>

            {/* Key Ingredients Preview Box */}
            <div className="mt-3.5 p-3 rounded-xl bg-darkprimary/60 border editorial-border">
              <div className="text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="ri-leaf-line text-secondary"></i>
                Key Ingredients
              </div>
              <div className="flex flex-wrap gap-1.5">
                {previewIngredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-surface border editorial-border text-ink px-2.5 py-1 rounded-lg truncate max-w-[200px]"
                  >
                    {ing}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span className="text-xs bg-secondary/10 text-secondary font-semibold px-2.5 py-1 rounded-lg">
                    +{remainingCount} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Culinary Metrics Grid + Action CTA */}
          <div className="mt-5">
            <div className="grid grid-cols-4 gap-2 pt-3 border-t editorial-border">
              <div className="bg-primary/75 border editorial-border rounded-xl p-2 text-center">
                <i className="ri-star-smile-line text-secondary text-base"></i>
                <div className="text-[11px] text-stone mt-0.5">Taste</div>
                <div className="text-sm font-bold text-ink">
                  {props.tasteRating}/5
                </div>
              </div>

              <div className="bg-primary/75 border editorial-border rounded-xl p-2 text-center">
                <i className="ri-restaurant-line text-secondary text-base"></i>
                <div className="text-[11px] text-stone mt-0.5">Serves</div>
                <div className="text-sm font-bold text-ink">
                  {props.serving}
                </div>
              </div>

              <div className="bg-primary/75 border editorial-border rounded-xl p-2 text-center">
                <i className="ri-fire-line text-secondary text-base"></i>
                <div className="text-[11px] text-stone mt-0.5">Calories</div>
                <div className="text-sm font-bold text-ink">
                  {props.calories}
                </div>
              </div>

              <div className="bg-primary/75 border editorial-border rounded-xl p-2 text-center">
                <i className="ri-timer-2-line text-secondary text-base"></i>
                <div className="text-[11px] text-stone mt-0.5">Time</div>
                <div className="text-sm font-bold text-ink">
                  {props.timeRequired}m
                </div>
              </div>
            </div>

            <motion.button
              type="button"
              data-cursor="COOK"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
              onClick={() => setShowRecipe(true)}
              className="btn-awwwards w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <i className="ri-play-circle-line text-lg"></i>
                <span>Watch &amp; Start Cooking</span>
              </span>
              <i className="ri-arrow-right-line text-base"></i>
            </motion.button>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {showRecipe && (
          <RecipePopUp
            onClose={() => setShowRecipe(false)}
            index={props.index}
            recipeName={props.recipeName}
            cuisine={props.cuisine}
            ingredients={props.ingredients}
            matchedIngredients={props.matchedIngredients}
            steps={props.steps}
            timeRequired={props.timeRequired}
            tasteRating={props.tasteRating}
            serving={props.serving}
            calories={props.calories}
            youtubeVideoId={props.youtubeVideoId}
            videoTitle={props.videoTitle}
            channelTitle={props.channelTitle}
            videoThumbnail={props.videoThumbnail}
            youtubeSearchUrl={props.youtubeSearchUrl}
            sourceUrl={props.sourceUrl}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Card;
