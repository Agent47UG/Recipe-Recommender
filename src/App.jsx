import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Card from './Card';
import Nav from './Nav';
import Tagline from './Tagline';
import RandomDots from './RandomDots';
import InputField from './InputField';
import Footer from './Footer';
import loader from './assets/loader.svg'


function App() {
  const [question, setQuestion] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [quantity, setQuantity] = useState(5);
  const [recipes, setRecipes] = useState([]);
  const googleAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMIN_API_KEY);
  const preferredModels = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const responseSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        recipeName: { type: 'string' },
        ingredients: { type: 'array', items: { type: 'string' } },
        steps: { type: 'array', items: { type: 'string' } },
        cuisine: { type: 'string' },
        time_required: { type: 'number' },
        taste_rating: { type: 'number' },
        calories: { type: 'number' },
        serving: { type: 'number' },
      },
      required: [
        'recipeName',
        'ingredients',
        'steps',
        'cuisine',
        'time_required',
        'taste_rating',
        'calories',
        'serving',
      ],
    },
  };

  const prompt = `Generate exactly ${quantity} recipes matching this description: ${question}. Return only raw JSON and nothing else.

Output schema:
[
  {
    "recipeName": "string",
    "ingredients": ["string"],
    "steps": ["string"],
    "cuisine": "string",
    "time_required": number,
    "taste_rating": number,
    "calories": number,
    "serving": number
  }
]

Do not include markdown, explanation, or extra text.`;

  async function generateAnswer() {
    setLoadingMessage("Generating Recipes...");
    let lastError = null;

    for (const modelName of preferredModels) {
      const modelInstance = googleAI.getGenerativeModel({ model: modelName });

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const result = await modelInstance.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema,
            },
          });

          const responseText = result.response.text();
          const recipeList = JSON.parse(responseText);
          setRecipes(recipeList);
          setLoadingMessage("");
          return;
        } catch (e) {
          lastError = e;
          const status = e?.status ?? e?.response?.status ?? null;

          // Retry only on server busy / 503 errors with exponential backoff
          if (status === 503 || (e?.message && /\b503\b/.test(e.message))) {
            const delay = Math.pow(2, attempt) * 500; // 1s, 2s, 4s roughly
            await sleep(delay);
            continue; // retry same model
          }

          // For other recoverable server errors (5xx), try a short backoff
          if (status >= 500 && status < 600) {
            const delay = 1000;
            await sleep(delay);
            continue;
          }

          // For client errors or unknown issues, stop retrying this model
          break;
        }
      }

      // try next model in preferredModels list
    }

    console.error('All attempts failed:', lastError);
    setLoadingMessage('Service temporarily unavailable — please try again later.');
  }

  const getRecipeCards = () =>
    recipes.map((recipe, index) => (
      <Card
        key={index}
        recipeName={recipe.recipeName}
        ingredients={recipe.ingredients}
        steps={recipe.steps}
        tasteRating={recipe.taste_rating}
        serving={recipe.serving}
        calories={recipe.calories}
        timeRequired={recipe.time_required}
        cuisine={recipe.cuisine}
      />
    ));

  const onQuestionChange = (newQuestion) => {
    setQuestion(newQuestion);
  };

  const onQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };




  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />
      <RandomDots className='up' />
      <Tagline />
      <InputField generateRecipe={generateAnswer} onQuestionChange={onQuestionChange} quantity={quantity} onQuantityChange={onQuantityChange} />

      <main className='flex-grow'>
        <p className='text-secondary font-medium text-center text-lg mt-5'>{loadingMessage}</p>
        {loadingMessage &&
          <div className='flex justify-center'>
            <img src={loader} className='w-10'></img>
          </div>
        }

        <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-y-5 mt-10 justify-items-center mx-3'>
          {loadingMessage ? "" : getRecipeCards()}
        </div>
      </main>

      <Footer />
    </div >
  )
}

export default App
