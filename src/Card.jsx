
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
                variants={fadeIn("up", 0.1, true)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: true, amount: 0.2 }}
                className="bg-primary customshadow rounded-lg p-5 flex flex-row sm:flex-col justify-between w-full sm:w-72  transition-transform duration-300 transform hover:-translate-y-2">

                <div className="hidden sm:flex justify-between items-start w-full">
                    <div className="pr-3">
                        <h3 className="text-2xl sm:text-3xl font-semibold text-secondary leading-tight">{props.recipeName}</h3>
                        <p className="text-sm text-neutral-500 mt-1">{props.ingredients ? props.ingredients.length : 0} ingredients</p>
                    </div>
                    <div className="ml-2">
                        <span className="bg-darkprimary text-secondary text-xs font-medium px-3 py-1 rounded-full">{props.cuisine}</span>
                    </div>
                </div>

                <div className="sm:hidden flex gap-3 w-full">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg bg-darkprimary/20 p-3 w-20">
                        <div className="bg-darkprimary text-secondary w-10 h-10 rounded-lg flex items-center justify-center text-lg">
                            <i className="ri-bowl-line"></i>
                        </div>
                        <p className="text-[10px] text-neutral-500 text-center mt-2 font-medium">{props.cuisine}</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary leading-tight">{props.recipeName}</h3>
                            <p className="text-xs text-neutral-500 mt-1">{props.ingredients ? props.ingredients.length : 0} ingredients</p>
                            <div className="mt-2 bg-neutral-400 rounded-full w-full h-0.5"></div>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                <div className="flex flex-col items-center text-center">
                                    <i className="ri-bowl-line text-secondary text-lg"></i>
                                    <div className="text-[9px] text-neutral-500 mt-1">Taste</div>
                                    <div className="text-xs text-secondary font-medium">{props.tasteRating}/5</div>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <i className="ri-restaurant-line text-secondary text-lg"></i>
                                    <div className="text-[9px] text-neutral-500 mt-1">Serving</div>
                                    <div className="text-xs text-secondary font-medium">{props.serving}</div>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <i className="ri-run-line text-secondary text-lg"></i>
                                    <div className="text-[9px] text-neutral-500 mt-1">Calories</div>
                                    <div className="text-xs text-secondary font-medium">{props.calories}</div>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <i className="ri-timer-2-line text-secondary text-lg"></i>
                                    <div className="text-[9px] text-neutral-500 mt-1">Time</div>
                                    <div className="text-xs text-secondary font-medium">{props.timeRequired}</div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-secondary text-primary w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm mt-3"
                            onClick={() => setShowRecipe(true)}
                        >
                            Recipe
                            <i className="ri-arrow-right-line" />
                        </button>
                    </div>
                </div>

                <div className="hidden sm:block w-full">
                    <div className="mt-3 bg-neutral-400 rounded-full w-full h-0.5"></div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-3 p-2 rounded-md bg-[rgba(255,255,255,0.02)]">
                            <div className="w-10 h-10 rounded-full bg-darkprimary text-secondary flex items-center justify-center text-lg">
                                <i className="ri-bowl-line"></i>
                            </div>
                            <div>
                                <div className="text-xs text-neutral-500">Taste</div>
                                <div className="text-sm text-secondary font-medium">{props.tasteRating}/5</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 rounded-md bg-[rgba(255,255,255,0.02)]">
                            <div className="w-10 h-10 rounded-full bg-darkprimary text-secondary flex items-center justify-center text-lg">
                                <i className="ri-restaurant-line"></i>
                            </div>
                            <div>
                                <div className="text-xs text-neutral-500">Serving</div>
                                <div className="text-sm text-secondary font-medium">{props.serving}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 rounded-md bg-[rgba(255,255,255,0.02)]">
                            <div className="w-10 h-10 rounded-full bg-darkprimary text-secondary flex items-center justify-center text-lg">
                                <i className="ri-run-line"></i>
                            </div>
                            <div>
                                <div className="text-xs text-neutral-500">Calories</div>
                                <div className="text-sm text-secondary font-medium">{props.calories}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 rounded-md bg-[rgba(255,255,255,0.02)]">
                            <div className="w-10 h-10 rounded-full bg-darkprimary text-secondary flex items-center justify-center text-lg">
                                <i className="ri-timer-2-line"></i>
                            </div>
                            <div>
                                <div className="text-xs text-neutral-500">Time</div>
                                <div className="text-sm text-secondary font-medium">{props.timeRequired}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="bg-secondary text-primary w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                            onClick={() => setShowRecipe(true)}
                        >
                            Recipe
                            <i className="ri-arrow-right-line" />
                        </button>
                    </div>
                </div>

            </motion.article>

            {showRecipe && (
                <RecipePopUp
                    onClose={() => setShowRecipe(false)}
                    recipeName={props.recipeName}
                    cuisine={props.cuisine}
                    ingredients={props.ingredients}
                    steps={props.steps}
                    timeRequired={props.timeRequired}
                    tasteRating={props.tasteRating}
                    serving={props.serving}
                />
            )}

        </>
    )
}

export default Card