import { motion } from 'framer-motion';
import { fadeIn } from './variants.js';


function Footer() {
    return (
        <motion.footer
            variants={fadeIn("up1", 0.2, true)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.7 }}
            className="bg-primary text-secondary py-5 mt-1 justify-evenly flex">
            <div className="container grid gap-2 lg:grid-cols-2 ">
                <div
                    className="flex justify-center">
                    <p className="text-base font-medium ">
                        Happy Cooking! :&#41;
                    </p>
                </div>
                <div className="text-2xl flex gap-5 justify-center">
                    <a href="https://github.com/Agent47UG" target="_blank">
                        <i className="ri-github-fill "></i>
                    </a>
                    <a href="https://www.ujwalg.tech/" target="_blank">
                        <i className="ri-code-s-slash-line text-xl"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/ujwal-ghodeswar-268209241" target="_blank">
                        <i className="ri-linkedin-box-fill"></i>
                    </a>
                </div>
            </div >
        </motion.footer >
    )
}

export default Footer;