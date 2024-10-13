import { motion } from 'framer-motion';
import { fadeIn } from './variants.js';

function RandomDots() {
    return (
        <motion.div
            variants={fadeIn("", 0.2, true)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.7 }}


            className="w-full flex  md:mt-5 justify-between px-7">
            <i className="ri-bowl-line text-secondary text-2xl rotate-2"></i>


            <div className="flex space-x-20 md:space-x-64 ">
                <i className="ri-goblet-line text-secondary text-2xl rotate-6"></i>
                <i className="ri-cake-3-line text-secondary text-2xl -rotate-12"></i>
            </div>
        </motion.div>
    )
}

export default RandomDots