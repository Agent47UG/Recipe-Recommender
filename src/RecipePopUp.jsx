/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { fadeIn } from './variants.js';


function RecipePopUp(props) {
    return (
        <motion.div
            variants={fadeIn("", 0.05, true, 0.5)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.7 }}



            className="fixed overflow-y-scroll z-50 inset-0 bg-black top-0 flex justify-center md:items-center items-start bg-opacity-30 backdrop-blur-sm" >
            <div className="bg-primary  2xl:w-6/12 xl:w-7/12 lg:w-9/12 w-11/12 mt-1 mb-1 h-auto rounded-xl customshadow px-5 pt-5 pb-5">

                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <span className="text-3xl font-medium text-secondary  ">{props.recipeName}</span>

                        < i className="ri-close-circle-fill text-3xl text-secondary" onClick={props.onClose}></i>
                    </div>

                    <span className="text-xl font-medium text-neutral-500 ml-0.5">{props.cuisine}</span>

                    <div className="mt-1.5 bg-neutral-400 rounded-2xl w-full h-0.5"></div>
                </div>

                <div className="grid md:grid-cols-2 mt-5 gap-y-5">
                    <div>
                        <div className="text-2xl font-medium text-secondary  ">Time Required</div>

                        <div className="text-lg text-neutral-600">
                            {props.timeRequired + " Minutes"}
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-medium text-secondary  ">Serving</div>

                        <div className="text-lg text-neutral-600">
                            {props.serving + " People"}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 mt-5 gap-y-5">
                    <div>
                        <div className="text-2xl font-medium text-secondary  ">Ingredients</div>

                        <ol className="text-lg text-neutral-600">
                            {props.ingredients.map((item, index) => (
                                <li>{index + 1}. {item}</li>
                            ))}
                        </ol>
                    </div>

                    <div>
                        <div className="text-2xl font-medium text-secondary  ">How To Make</div>

                        <ol className="text-lg text-neutral-600">
                            {props.steps.map((item, index) => (
                                <li className="mt-1">{index + 1}. {item}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>

        </motion.div >
    )
}

export default RecipePopUp