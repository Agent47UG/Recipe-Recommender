import { motion } from 'framer-motion';
import { fadeIn, EASE_EDITORIAL } from './variants.js';

function Nav() {
  return (
    <header className="editorial-nav sticky top-0 z-30 w-full">
      <nav className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Culinary Brand Identity */}
        <motion.a
          href="#top"
          variants={fadeIn('down', 0.1, true)}
          initial="hidden"
          animate="show"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
          className="flex items-center gap-2.5 group"
        >
          <span className="w-10 h-10 rounded-full bg-secondary text-surface flex items-center justify-center text-lg shadow-sm group-hover:rotate-6 transition-transform">
            <i className="ri-restaurant-2-fill"></i>
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl text-secondary tracking-wide uppercase">
              RECIPE.RECOMMEND
            </span>
            <span className="font-hand text-xl sm:text-2xl text-ink -rotate-6 hidden sm:inline-block ml-1">
              Yummy!!
            </span>
          </div>
        </motion.a>

        {/* Center Kitchen Highlights with Signature Circular Color Badges */}
        <motion.div
          variants={fadeIn('down', 0.15, true)}
          initial="hidden"
          animate="show"
          className="hidden md:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-ink"
        >
          <motion.span whileHover={{ y: -2 }} className="flex items-center gap-2 cursor-default">
            <span className="w-6 h-6 rounded-full bg-sunny text-white flex items-center justify-center text-xs shadow-sm">
              <i className="ri-fire-fill"></i>
            </span>
            Bold Flavors
          </motion.span>
          <span className="text-stone/40">•</span>
          <motion.span whileHover={{ y: -2 }} className="flex items-center gap-2 cursor-default">
            <span className="w-6 h-6 rounded-full bg-herb text-white flex items-center justify-center text-xs shadow-sm">
              <i className="ri-leaf-fill"></i>
            </span>
            Pantry to Plate
          </motion.span>
          <span className="text-stone/40">•</span>
          <motion.span whileHover={{ y: -2 }} className="flex items-center gap-2 cursor-default">
            <span className="w-6 h-6 rounded-full bg-peach text-secondary flex items-center justify-center text-xs shadow-sm">
              <i className="ri-play-fill"></i>
            </span>
            Video Guides
          </motion.span>
        </motion.div>

        {/* Creator Signature */}
        <motion.div
          variants={fadeIn('left', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="flex items-center gap-3"
        >
          <motion.a
            href="https://www.ujwal.site/"
            target="_blank"
            rel="noreferrer"
            data-cursor="VISIT"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="text-xs font-bold uppercase tracking-wider text-ink hover:bg-secondary hover:text-surface hover:border-secondary transition-colors flex items-center gap-1.5 border-2 border-ink/15 px-4 py-2 rounded-full bg-surface"
          >
            <span>By Ujwal</span>
            <i className="ri-arrow-right-up-line text-sm text-secondary group-hover:text-surface"></i>
          </motion.a>
        </motion.div>
      </nav>
    </header>
  );
}

export default Nav;
