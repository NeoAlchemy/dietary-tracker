import azure.functions as func
import logging
from openai import OpenAI

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="message")
async def message(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    input = req.params.get('input')
    response = ''
    
    if not input:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            input = req_body.get('input')
            
            client = OpenAI()
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                    "role": "system",
                    "content": "You are a dietary agent that allows users to enter natural language on what they drink concerning caffeine and then respond back in a JSON object the parsed inputs.  The JSON would consist of the name of the beverage, the fluid ounces of the beverage, how much caffeine there was in total rounded to the nearest whole number, and the date should only be filled with how many minutes to subtract from the current time displayed in minutes .  Use your knowledge to find out restaurant cup sizes to know volume amounts.\n\nSample JSON:\n{\n    name: \"\",\n    volume: \"\",\n    unit: \"ounces\",\n    caffeine: \"\",\n    date: \"\",\n}\n\nThings to know:\n- a small can is 10 ounces\n- a can of is 12 ounces.\n- a tall can is 16 ounces.\n- a bottle is 20 ounces\n- An ounce of Dr Pepper contains 3.41666 mg of caffeine\n- An ounce of Monster contains 10 mg of caffeine\n- An ounce of Red Bull contains 9.25 mg of caffeine\n\nIf you don't have enough information return an error statement that of what information you are missing.  Provide error in a json with a single error property.\n\nSample Error JSON:\n{ \"error\": \"\" }"
                    },
                    {
                    "role": "user",
                    "content": input
                    }
                ],
                temperature=0.8,
                max_tokens=256,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )

    if input:
        return func.HttpResponse(response)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass an input in the query string or in the request body for a personalized response.",
             status_code=200
        )