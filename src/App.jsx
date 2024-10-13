import { useState } from 'react';
import axios from 'axios';
import Card from './Card';
import Nav from './Nav';
import Tagline from './Tagline';
import RandomDots from './RandomDots';
import InputField from './InputField';
import Footer from './Footer';
import loader from './assets/loader.svg'


function App() {
  const [question, setQuestion] = useState("");
  const [isloading, setLoading] = useState("");
  const [quantity, setQuantity] = useState(5);
  const [recipies, setRecipies] = useState({});

  const prompt = `${quantity} recipes that fits the description${question}using this JSON schema:

Recipe = {"recipeName": string,"ingredients": Array,"steps":Array,":cuisine":string,"time_required" : number,"taste_rating":number,"calories":number,"serving":number}
add quantity required for specified serving in the ingredients
dont include next line formatting
Return: Array<Recipe> without '''json at start dont add addtionial Details about recipe name, add quantity required for specified serving in the ingredients`;




  async function generateAnswer() {
    setLoading("Generating Recipes...");
    const reponse = await axios({
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + import.meta.env.VITE_GEMIN_API_KEY,
      method: 'post',
      data: {
        contents:
          [
            {
              parts: [{ text: prompt }]
            },
          ],
      },
    });

    try {
      let response = reponse['data']['candidates'][0]['content']['parts'][0]['text'];
      response = response.replace(/^```json/, '');
      response = response.replace(/```$/, '');
      console.log(response)
      const recipe = JSON.parse(response);
      console.log(recipe[0])
      setRecipies(recipe)
      setLoading("")
    }
    catch (e) {
      setLoading("An Error Occurred..Please try again! ☹")
      console.log(e);
    }
  }


  const getRecipie = (count) => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push(<Card keys={i} recipeName={recipies[i]["recipeName"]} ingredients={recipies[i]["ingredients"]} steps={recipies[i]["steps"]} tasteRating={recipies[i]["taste_rating"]} serving={recipies[i]["serving"]} calories={recipies[i]["calories"]} timeRequired={recipies[i]["time_required"]} cuisine={recipies[i]["cuisine"]}></Card>)
    }
    return arr;
  }

  const onQuestionChange = (newQuestion) => {
    setQuestion(newQuestion)
  }

  const onQuantityChange = (newQuantity) => {
    setQuantity(newQuantity)
  }




  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />
      <RandomDots className='up' />
      <Tagline />
      <InputField generateRecipe={generateAnswer} onQuestionChange={onQuestionChange} quantity={quantity} onQuantityChange={onQuantityChange} />

      <main className='flex-grow'>
        <p className='text-secondary font-medium text-center text-lg mt-5'>{isloading}</p>
        {isloading &&
          <div className='flex justify-center'>
            <img src={loader} className='w-10'></img>
          </div>
        }

        <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-y-5 mt-10 justify-items-center'>
          {isloading ? "" : getRecipie(Object.keys(recipies).length)}
        </div>
      </main>

      <Footer />
    </div >
  )
}

export default App
