import { motion } from 'framer-motion';
import { fadeIn } from './variants.js';

function Tagline() {
    return (
        <motion.div
            variants={fadeIn("up", 0.2, true)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.7 }}


            className="text-secondary grid grid-cols-1  md:grid-cols-3 justify-items-center gap-2 mt-9 font-medium md:ml-5 ml-7 mr-5" >
            <p className="md:max-w-md max-w-sm">
                Tired of staring blankly into your fridge, wondering what to cook?  Say goodbye to mealtime monotony! Our website takes the guesswork out of cooking by suggesting delicious recipes based on the ingredients you have on hand, your taste preferences, and even your favorite cuisines.
            </p>

            <p className="md:max-w-md max-w-sm md:block hidden">
                Whether you&apos;re a seasoned chef or a kitchen novice, we&apos;ll help you whip up culinary masterpieces with ease. Craving comfort food? We&apos;ve got you covered.  Looking for a quick and healthy weeknight dinner?  No problem!
            </p>

            <p className="md:max-w-md max-w-sm  md:block hidden">
                Simply tell us what you&apos;re craving or whats in your pantry, and we&apos;ll provide a curated selection of recipes that are sure to tantalize your taste buds. Get ready to discover new flavors and rediscover the joy of cooking!
            </p>
        </motion.div>
    )
}

export default Tagline