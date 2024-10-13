
/* eslint-disable react/prop-types */

import { useState } from "react"
import RecipePopUp from "./RecipePopUp"
import { motion } from 'framer-motion';
import { fadeIn } from './variants.js';


function Card(props) {
    const [showRecipe, setShowRecipe] = useState(false)

    return (
        <>
            <motion.article
                variants={fadeIn("up", props.keys * 0.1, true)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: true, amount: 0.7 }}

                className="bg-primary customshadow h-98 w-80 rounded-lg p-4 flex flex-col justify-between">
                <span className="text-3xl font-medium text-secondary  ">{props.recipeName}</span>
                <span className="text-l font-medium text-neutral-500 ml-0.5">{props.cuisine}</span>


                <div className="mt-1.5 bg-neutral-400 rounded-2xl w-full h-0.5"></div>

                <div className=" grid grid-cols-2 justify-items-center items-center py-5 gap-y-5">
                    <div className="text-2xl font-medium flex flex-col justify-items-center text-center text-neutral-500">
                        <i className="ri-bowl-line"></i>
                        Taste
                        <span className="text-center text-secondary">
                            {props.tasteRating}
                        </span>
                    </div>
                    <div className="text-2xl font-medium flex flex-col justify-items-center text-center text-neutral-500">
                        <i className="ri-restaurant-line"></i>
                        Serving
                        <span className="text-center text-secondary">
                            {props.serving}
                        </span>
                    </div>
                    <div className="text-2xl font-medium flex flex-col justify-items-center text-center text-neutral-500">
                        <i className="ri-run-line"></i>
                        Calories
                        <span className="text-center text-secondary">
                            {props.calories}
                        </span>
                    </div>
                    <div className="text-2xl font-medium flex flex-col justify-items-center text-center text-neutral-500">
                        <i className="ri-timer-2-line"></i>
                        Time
                        <span className="text-center text-secondary">
                            {props.timeRequired}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center bottom-0">

                    <button className="bg-secondary text-primary w-36 h-12 rounded-md mt-2" onClick={() => setShowRecipe(true)}>
                        Recipe
                        < i className="ml-2  ri-arrow-right-line"></i>
                    </button>
                </div>

            </motion.article>

            {showRecipe && <RecipePopUp onClose={() => setShowRecipe(false)} recipeName={props.recipeName} cuisine={props.cuisine} ingredients={props.ingredients} steps={props.steps} timeRequired={props.timeRequired} serving={props.serving} />}

        </>
    )
}

export default Card