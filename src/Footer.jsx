import { motion } from 'framer-motion';
import { fadeIn } from './variants.js';

function Footer() {
  return (
    <motion.footer
      variants={fadeIn('up1', 0.15, true)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="border-t editorial-border bg-darkprimary/50 mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b editorial-border items-end">
          <div className="text-center sm:text-left lg:col-span-7">
            <h2 className="h1-editorial text-ink">
              Because good food is meant to be{' '}
              <span className="font-editorial-italic text-secondary">shared.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex justify-center sm:justify-start lg:justify-end items-center gap-6">
            <div className="flex items-center justify-center gap-3 text-xl text-ink">
              <motion.a
                href="https://github.com/Agent47UG"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                data-cursor="GITHUB"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-11 h-11 rounded-full border editorial-border bg-surface flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
              >
                <i className="ri-github-fill"></i>
              </motion.a>
              <motion.a
                href="https://www.ujwal.site/"
                target="_blank"
                rel="noreferrer"
                aria-label="Portfolio"
                data-cursor="SITE"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-11 h-11 rounded-full border editorial-border bg-surface flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
              >
                <i className="ri-code-s-slash-line text-lg"></i>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/ujwal-ghodeswar-268209241"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                data-cursor="LINKEDIN"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-11 h-11 rounded-full border editorial-border bg-surface flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
              >
                <i className="ri-linkedin-box-fill"></i>
              </motion.a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-stone">
          <span>©{new Date().getFullYear()} <span className="text-secondary">recipe.recommend</span> v2</span>
          <span className="flex items-center gap-1">
            Made with love for home cooks by{' '}
            <motion.a
              href="https://www.ujwal.site/"
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: '"Dancing Script", "Pacifico", cursive' }}
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-block font-cursive text-base sm:text-lg text-secondary hover:text-ink transition-colors tracking-normal"
            >
              Ujwal
            </motion.a>
          </span>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
