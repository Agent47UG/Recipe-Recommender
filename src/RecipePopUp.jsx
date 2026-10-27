import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { modalBackdrop, modalPanel } from './variants.js';

function RecipePopUp(props) {
  const [checkedIngredients, setCheckedIngredients] = useState(() => new Set());
  const [checkedSteps, setCheckedSteps] = useState(() => new Set());
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const { onClose } = props;

  // Lock background page scroll & handle Escape key cleanly
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const matchedSet = useMemo(
    () => new Set((props.matchedIngredients || []).map((m) => m.toLowerCase())),
    [props.matchedIngredients]
  );

  const isIngredientMatched = (ingredientLine) => {
    const lower = (ingredientLine || '').toLowerCase();
    for (const m of matchedSet) {
      if (m && lower.includes(m)) return true;
    }
    return false;
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleStep = (idx) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const totalIngredients = (props.ingredients || []).length;
  const totalSteps = (props.steps || []).length;
  const ingProgress = totalIngredients
    ? Math.round((checkedIngredients.size / totalIngredients) * 100)
    : 0;
  const stepProgress = totalSteps
    ? Math.round((checkedSteps.size / totalSteps) * 100)
    : 0;

  const watchUrl = props.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${props.youtubeVideoId}`
    : props.youtubeSearchUrl ||
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${props.recipeName} recipe`
      )}`;

  const previewThumb =
    props.videoThumbnail ||
    (props.youtubeVideoId
      ? `https://i.ytimg.com/vi/${props.youtubeVideoId}/hqdefault.jpg`
      : null);

  const modalContent = (
    <motion.div
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label={props.recipeName}
      onClick={onClose}
      className="modal-backdrop fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-5 lg:p-8"
    >
      <motion.div
        variants={modalPanel}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="modal-surface w-full max-w-[1180px] max-h-[90vh] flex flex-col rounded-3xl overflow-hidden text-ink"
      >
        {/* Fixed Top Header Bar */}
        <div
          style={{ backgroundColor: '#F2DEC1' }}
          className="px-5 sm:px-8 py-4 sm:py-5 border-b editorial-border flex-shrink-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-secondary text-primary px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <i className="ri-restaurant-2-line"></i>
                  {props.cuisine} Kitchen
                </span>
                <span
                  style={{ backgroundColor: '#FFF6E8' }}
                  className="border editorial-border text-umber px-3 py-1 rounded-md text-xs font-semibold"
                >
                  {totalIngredients} Ingredients • {totalSteps} Steps
                </span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-4xl text-ink leading-tight">
                {props.recipeName}
              </h2>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              aria-label="Close recipe"
              style={{ backgroundColor: '#FFF6E8' }}
              className="flex items-center gap-1.5 text-xs font-bold hover:bg-secondary hover:text-primary text-ink border editorial-border px-4 py-2 rounded-full transition-colors flex-shrink-0 shadow-sm"
            >
              <span>Close</span>
              <i className="ri-close-line text-base"></i>
            </motion.button>
          </div>

          {/* 4-Metric Culinary Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div
              style={{ backgroundColor: '#FFF6E8' }}
              className="border editorial-border rounded-2xl px-3.5 py-2.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-lg flex-shrink-0">
                <i className="ri-timer-2-line"></i>
              </div>
              <div>
                <div className="text-[11px] text-stone font-semibold uppercase tracking-wider">
                  Prep &amp; Cook
                </div>
                <div className="text-sm sm:text-base font-bold text-ink">
                  {props.timeRequired} mins
                </div>
              </div>
            </div>

            <div
              style={{ backgroundColor: '#FFF6E8' }}
              className="border editorial-border rounded-2xl px-3.5 py-2.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-lg flex-shrink-0">
                <i className="ri-restaurant-line"></i>
              </div>
              <div>
                <div className="text-[11px] text-stone font-semibold uppercase tracking-wider">
                  Servings
                </div>
                <div className="text-sm sm:text-base font-bold text-ink">
                  {props.serving} Plates
                </div>
              </div>
            </div>

            <div
              style={{ backgroundColor: '#FFF6E8' }}
              className="border editorial-border rounded-2xl px-3.5 py-2.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-lg flex-shrink-0">
                <i className="ri-fire-line"></i>
              </div>
              <div>
                <div className="text-[11px] text-stone font-semibold uppercase tracking-wider">
                  Calories
                </div>
                <div className="text-sm sm:text-base font-bold text-ink">
                  {props.calories} kcal
                </div>
              </div>
            </div>

            <div
              style={{ backgroundColor: '#FFF6E8' }}
              className="border editorial-border rounded-2xl px-3.5 py-2.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-lg flex-shrink-0">
                <i className="ri-star-smile-line"></i>
              </div>
              <div>
                <div className="text-[11px] text-stone font-semibold uppercase tracking-wider">
                  Taste Rating
                </div>
                <div className="text-sm sm:text-base font-bold text-ink">
                  {props.tasteRating} / 5
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Single Smooth Scrollable Body */}
        <div
          style={{ backgroundColor: '#FFF6E8' }}
          className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x editorial-border"
        >
          {/* LEFT COLUMN: Video Guide & Prep Progress */}
          <div className="lg:col-span-5 p-5 sm:p-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="font-editorial text-xl sm:text-2xl text-ink flex items-center gap-2">
                  <i className="ri-play-circle-fill text-secondary"></i>
                  Step-by-Step Video Guide
                </h3>

                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-secondary hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Watch on YouTube</span>
                  <i className="ri-external-link-line"></i>
                </a>
              </div>

              {/* Fast Click-to-Play Video Player */}
              {props.youtubeVideoId && isPlayingVideo ? (
                <div className="relative w-full overflow-hidden rounded-2xl border editorial-border bg-black aspect-video shadow-md">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${props.youtubeVideoId}?autoplay=1&rel=0`}
                    title={props.videoTitle || `${props.recipeName} Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : props.youtubeVideoId ? (
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(true)}
                  className="group relative w-full overflow-hidden rounded-2xl border editorial-border bg-ink aspect-video shadow-md text-left block"
                >
                  {previewThumb && (
                    <img
                      src={previewThumb}
                      alt={props.recipeName}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <span className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <i className="ri-play-fill text-3xl ml-0.5"></i>
                    </span>
                    <span className="mt-3 bg-black/75 text-primary text-xs font-semibold px-3.5 py-1.5 rounded-full">
                      Click to Play Video Tutorial
                    </span>
                  </div>
                </button>
              ) : (
                <div className="relative w-full overflow-hidden rounded-2xl border editorial-border bg-ink aspect-video flex flex-col items-center justify-center p-6 text-center">
                  {previewThumb && (
                    <img
                      src={previewThumb}
                      alt={props.recipeName}
                      className="absolute inset-0 w-full h-full object-cover opacity-35"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <i className="ri-youtube-fill text-5xl text-secondary mb-2"></i>
                    <p className="font-editorial text-xl text-primary mb-3">
                      Watch step-by-step video tutorials for {props.recipeName}
                    </p>
                    <a
                      href={watchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-secondary text-primary px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow"
                    >
                      <i className="ri-play-fill text-base"></i>
                      <span>Open Video Tutorial</span>
                    </a>
                  </div>
                </div>
              )}

              {props.channelTitle && (
                <p className="mt-2.5 text-xs text-stone">
                  Culinary demonstration by{' '}
                  <strong className="text-ink font-semibold">
                    {props.channelTitle}
                  </strong>
                </p>
              )}
            </div>

            {/* Kitchen Prep Progress Card */}
            <div className="modal-card-item p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-editorial text-lg text-ink flex items-center gap-2">
                  <i className="ri-knife-line text-secondary"></i>
                  Kitchen Prep Progress
                </h4>
                <span className="text-xs font-semibold text-sage">
                  Tap items to check off
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div
                  style={{ backgroundColor: '#FFF6E8' }}
                  className="border editorial-border p-3.5 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone font-medium">Ingredients</span>
                    <span className="font-bold text-ink">
                      {checkedIngredients.size}/{totalIngredients}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-darkprimary rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${ingProgress}%`,
                        backgroundColor: '#1B7A43',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{ backgroundColor: '#FFF6E8' }}
                  className="border editorial-border p-3.5 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone font-medium">Cooking Steps</span>
                    <span className="font-bold text-ink">
                      {checkedSteps.size}/{totalSteps}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-darkprimary rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${stepProgress}%`,
                        backgroundColor: '#EE3E31',
                      }}
                    />
                  </div>
                </div>
              </div>

              {props.sourceUrl && (
                <div className="pt-1 flex justify-end">
                  <a
                    href={props.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-secondary hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Original Cookbook Entry</span>
                    <i className="ri-external-link-line"></i>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Checkable Ingredients + Preparation Steps */}
          <div className="lg:col-span-7 p-5 sm:p-7 space-y-7">
            {/* Checkable Ingredients Section */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="font-editorial text-xl sm:text-2xl text-ink flex items-center gap-2">
                  <i className="ri-shopping-basket-2-line text-secondary"></i>
                  Ingredients ({totalIngredients})
                </h3>

                <span className="text-xs font-semibold text-stone">
                  {checkedIngredients.size}/{totalIngredients} ready
                </span>
              </div>

              {props.matchedIngredients?.length > 0 && (
                <div
                  style={{ backgroundColor: '#E8F5EE' }}
                  className="mb-3 px-3.5 py-2 rounded-xl border border-sage/30 text-xs font-semibold text-sage flex items-center gap-2"
                >
                  <i className="ri-checkbox-circle-fill text-sm"></i>
                  <span>
                    Highlighted ingredients match what you searched for!
                  </span>
                </div>
              )}

              <ul className="grid sm:grid-cols-2 gap-2.5 text-sm">
                {(props.ingredients || []).map((item, index) => {
                  const matched = isIngredientMatched(item);
                  const isChecked = checkedIngredients.has(index);
                  return (
                    <motion.li
                      key={index}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => toggleIngredient(index)}
                      style={{
                        backgroundColor: isChecked
                          ? '#DFC8A8'
                          : matched
                          ? '#DDF2E6'
                          : '#FBEAD2',
                        borderColor: isChecked
                          ? '#221C18'
                          : matched
                          ? '#1B7A43'
                          : 'rgba(34, 28, 24, 0.14)',
                      }}
                      className="cursor-pointer select-none flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border-2 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                          style={{
                            backgroundColor: isChecked ? '#221C18' : '#FFF6E8',
                            borderColor: isChecked
                              ? '#221C18'
                              : matched
                              ? '#1B7A43'
                              : 'rgba(34, 28, 24, 0.45)',
                            color: isChecked
                              ? '#FFFFFF'
                              : matched
                              ? '#1B7A43'
                              : 'transparent',
                          }}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-colors"
                        >
                          <i className="ri-check-line"></i>
                        </span>
                        <span
                          className={`leading-snug flex-1 ${
                            isChecked
                              ? 'line-through decoration-2 decoration-ink/80 text-ink/75 font-semibold'
                              : matched
                              ? 'text-ink font-bold'
                              : 'text-ink font-medium'
                          }`}
                        >
                          {item}
                        </span>
                      </div>

                      {isChecked && (
                        <span
                          style={{
                            backgroundColor: '#221C18',
                            color: '#FFF6E8',
                          }}
                          className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0"
                        >
                          Done
                        </span>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Step-by-Step Cooking Method */}
            <div className="pt-5 border-t editorial-border">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="font-editorial text-xl sm:text-2xl text-ink flex items-center gap-2">
                  <i className="ri-list-ordered text-secondary"></i>
                  Preparation Steps
                </h3>

                <span className="text-xs font-semibold text-stone">
                  {checkedSteps.size}/{totalSteps} done
                </span>
              </div>

              <ol className="space-y-3">
                {(props.steps || []).map((stepText, index) => {
                  const isStepDone = checkedSteps.has(index);
                  return (
                    <motion.li
                      key={index}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => toggleStep(index)}
                      style={{
                        backgroundColor: isStepDone ? '#DFC8A8' : '#FBEAD2',
                        borderColor: isStepDone
                          ? '#221C18'
                          : 'rgba(34, 28, 24, 0.14)',
                      }}
                      className="cursor-pointer select-none flex items-start justify-between gap-3.5 p-4 rounded-2xl border-2 transition-all leading-relaxed"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <span
                          style={{
                            backgroundColor: isStepDone ? '#221C18' : '#EE3E31',
                            color: '#FFFFFF',
                          }}
                          className="flex-shrink-0 w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center mt-0.5 transition-colors shadow-sm"
                        >
                          {isStepDone ? (
                            <i className="ri-check-line text-base"></i>
                          ) : (
                            index + 1
                          )}
                        </span>
                        <span
                          className={`text-sm sm:text-base flex-1 ${
                            isStepDone
                              ? 'line-through decoration-2 decoration-ink/80 text-ink/75 font-semibold'
                              : 'text-ink font-medium'
                          }`}
                        >
                          {stepText}
                        </span>
                      </div>

                      {isStepDone && (
                        <span
                          style={{
                            backgroundColor: '#221C18',
                            color: '#FFF6E8',
                          }}
                          className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md flex-shrink-0 mt-0.5"
                        >
                          Done
                        </span>
                      )}
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}

export default RecipePopUp;
