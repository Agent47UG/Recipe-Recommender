/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { fadeIn, heroHeadlineVariants, doodleEntrance } from './variants.js';

function Tagline({ children }) {
  return (
    <section
      id="top"
      className="relative w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 lg:pt-32 pb-10"
    >
      {/* Scattered Hand-Drawn Culinary Doodles with Organic Floating Motion */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-x-12 top-24 bottom-0 pointer-events-none select-none overflow-hidden text-ink/75"
      >
        {/* 1. Top-Left Broccoli Floret */}
        <motion.div
          variants={doodleEntrance(0.18, -14)}
          initial="hidden"
          animate="show"
          className="absolute left-[4%] top-8"
        >
          <motion.svg
            animate={{ y: [0, -8, 0], rotate: [-12, -8, -12] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            width="52"
            height="54"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M22 34C14 34 11 26 16 20C14 13 23 8 29 13C34 7 45 9 46 17C53 19 54 29 47 33C44 35 39 34 39 34"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M27 33L25 51C25 53 28 55 32 55C36 55 38 53 38 50L36 33"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29 25L31 33M36 24L34 33"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>

        {/* 2. Inner-Left Herb / Leaf Sprig */}
        <motion.div
          variants={doodleEntrance(0.28, 12)}
          initial="hidden"
          animate="show"
          className="absolute left-[13%] top-20"
        >
          <motion.svg
            animate={{ y: [0, -6, 0], rotate: [12, 16, 12] }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
            width="44"
            height="44"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M14 50C22 38 34 24 50 14"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M26 36C20 26 26 16 36 22C34 30 28 36 26 36Z"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <path
              d="M34 28C44 24 52 32 42 40C36 38 34 32 34 28Z"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        {/* 3. Mid-Left Outer Mushroom Doodle */}
        <motion.div
          variants={doodleEntrance(0.44, 16)}
          initial="hidden"
          animate="show"
          className="absolute left-[2%] top-44"
        >
          <motion.svg
            animate={{ y: [0, -9, 0], rotate: [18, 13, 18] }}
            transition={{
              duration: 5.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
            width="46"
            height="46"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M12 32C12 17 52 17 52 32C52 35 46 36 32 36C18 36 12 35 12 32Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M25 36L23 50C23 53 41 53 41 50L39 36"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="25" r="2.5" fill="currentColor" />
            <circle cx="37" cy="23" r="2" fill="currentColor" />
          </motion.svg>
        </motion.div>

        {/* 4. Mid-Left Inner Second Broccoli Floret */}
        <motion.div
          variants={doodleEntrance(0.52, -14)}
          initial="hidden"
          animate="show"
          className="absolute left-[11%] top-52"
        >
          <motion.svg
            animate={{ y: [0, -6, 0], rotate: [-16, -11, -16] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            width="46"
            height="48"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M22 34C14 34 11 26 16 20C14 13 23 8 29 13C34 7 45 9 46 17C53 19 54 29 47 33C44 35 39 34 39 34"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M27 33L25 51C25 53 28 55 32 55C36 55 38 53 38 50L36 33"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        {/* 5. Lower-Left Chili Pepper Doodle */}
        <motion.div
          variants={doodleEntrance(0.60, -12)}
          initial="hidden"
          animate="show"
          className="absolute left-[16%] top-72"
        >
          <motion.svg
            animate={{ y: [0, -8, 0], rotate: [-12, -6, -12] }}
            transition={{
              duration: 5.0,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.9,
            }}
            width="50"
            height="50"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M22 22C16 32 24 50 48 52C38 42 36 30 34 22C31 18 25 18 22 22Z"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28 19C28 13 33 10 38 11"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>

        {/* 6. Lower-Left Playful Squiggle Line */}
        <motion.div
          variants={doodleEntrance(0.68, 6)}
          initial="hidden"
          animate="show"
          className="absolute left-[3%] top-80 rotate-6"
        >
          <motion.svg
            animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
            transition={{
              duration: 6.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
            width="96"
            height="48"
            viewBox="0 0 110 54"
            fill="none"
          >
            <path
              d="M6 42C8 24 14 18 23 28C31 37 35 39 42 24C48 11 58 14 72 23C86 32 98 37 106 40"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>

        {/* 7. Left Sparkle Star Doodle */}
        <motion.div
          variants={doodleEntrance(0.36, -20)}
          initial="hidden"
          animate="show"
          className="absolute left-[8%] top-36"
        >
          <motion.svg
            animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 9.0, repeat: Infinity, ease: 'linear' }}
            width="28"
            height="28"
            viewBox="0 0 36 36"
            fill="none"
          >
            <path
              d="M18 4L21 15L32 18L21 21L18 32L15 21L4 18L15 15L18 4Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        {/* 8. Right-Side Garlic / Onion Bulb Doodle */}
        <motion.div
          variants={doodleEntrance(0.32, 14)}
          initial="hidden"
          animate="show"
          className="absolute right-[5%] top-52"
        >
          <motion.svg
            animate={{ y: [0, -7, 0], rotate: [12, 7, 12] }}
            transition={{
              duration: 5.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
            width="46"
            height="46"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M32 12C29 20 14 26 14 40C14 50 22 54 32 54C42 54 50 50 50 40C50 26 35 20 32 12Z"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32 14C26 28 25 42 32 54M32 14C38 28 39 42 32 54"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>

        {/* 9. Right-Side Swirl Doodle below Yummy */}
        <motion.div
          variants={doodleEntrance(0.42, -8)}
          initial="hidden"
          animate="show"
          className="absolute right-[11%] top-36 -rotate-6"
        >
          <motion.svg
            animate={{ x: [0, -5, 0], y: [0, -4, 0] }}
            transition={{
              duration: 5.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.1,
            }}
            width="76"
            height="42"
            viewBox="0 0 90 48"
            fill="none"
          >
            <path
              d="M8 30C24 14 42 38 58 22C68 12 76 18 84 14"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Cursive "Yummy!!" Callout on the Right with Spring Pop */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.75, rotate: -14 }}
        animate={{ opacity: 1, scale: 1, rotate: -6 }}
        transition={{ type: 'spring', damping: 16, stiffness: 200, delay: 0.3 }}
        whileHover={{ scale: 1.08, rotate: -2 }}
        className="hidden lg:block absolute right-12 top-36 select-none cursor-default"
      >
        <span
          style={{ fontFamily: '"Dancing Script", "Pacifico", cursive' }}
          className="font-cursive text-5xl xl:text-6xl text-ink/90 tracking-normal drop-shadow-sm"
        >
          Yummy!!
        </span>
      </motion.div>

      {/* Centered Impact Headline + Search Console */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
        <h1 className="display-hero text-secondary">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="inline-block"
              variants={heroHeadlineVariants}
              initial="hidden"
              animate="show"
              custom={0.06}
            >
              MAKE THE BEST WITH
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="inline-block"
              variants={heroHeadlineVariants}
              initial="hidden"
              animate="show"
              custom={0.18}
            >
              YOUR INGREDIENTS
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={fadeIn('up', 0.26, true, 0.75)}
          initial="hidden"
          animate="show"
          className="body-editorial text-umber max-w-2xl mx-auto font-medium"
        >
          Tell us what ingredients are in your fridge or a dish you’re craving
          tonight. Get concrete recipes with exact measurements and step-by-step
          cooking videos.
        </motion.p>

        {/* Search & Pantry Builder Console */}
        <div className="pt-2 text-left">{children}</div>
      </div>
    </section>
  );
}

export default Tagline;
