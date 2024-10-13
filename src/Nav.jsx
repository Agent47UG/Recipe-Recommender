import { motion } from 'framer-motion';
import { fadeIn } from './variants';

function Nav() {
    return (
        <>
            <header className="bg-primary sticky top-0 z-20 mx-auto w-full items-center p-8">
                <nav className="flex items-center justify-between">
                    <motion.div
                        variants={fadeIn("down", 0.2, true)}
                        initial="hidden"
                        whileInView={"show"}
                        viewport={{ once: true, amount: 0.7 }}
                        className="text-secondary text-2xl font-medium">recipe.recommend</motion.div>


                    <motion.div
                        variants={fadeIn("left", 0.2)}
                        initial="hidden"
                        whileInView={"show"}
                        viewport={{ once: true, amount: 0.7 }}
                        className="text-secondary text-sm font-semibold font-roboto">BY UJWAL</motion.div>
                </nav>
            </header>
        </>
    )
}

export default Nav