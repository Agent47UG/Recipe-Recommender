/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { fadeIn } from './variants.js';


function InputField(props) {
    return (
        <motion.div
            variants={fadeIn("up", 0.2, true)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.7 }}

            className="w-full flex justify-center  md:mt-12 mt-10" >
            <div className="bg-secondary rounded-l-lg px-4 z-50 customshadow flex justify-center items-center">
                <select value={props.quantity} className="bg-secondary text-xl text-primary text-center" onChange={(e) => props.onQuantityChange(parseInt(e.target.value))}>
                    {Array.from({ length: 10 }, (_, i) => i + 1)
                        .map(num => <option value={num} key={num} className="">{num}</option>
                        )}
                </select>
            </div>

            <input type="text" placeholder="What are you craving today?" className=" h-14 pl-5 w-7/12 md:w-5/12 md:text-xl customshadow bg-darkprimary text-secondary font-semibold placeholder-grey outline-none" onChange={(e) => props.onQuestionChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { props.generateRecipe(); } }} />
            <button className="bg-secondary rounded-r-xl md:px-5 px-2 text-primary customshadow font-semibold" onClick={props.generateRecipe}>Let&apos;s Cook!</button>
        </motion.div>
    )
}

export default InputField
