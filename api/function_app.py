import azure.functions as func
import logging
import json
import os
from openai import OpenAI
from types import SimpleNamespace
from dotenv import load_dotenv

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="dietary")
def message(req: func.HttpRequest) -> func.HttpResponse:
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

    if input:
        load_dotenv()
        logging.info(os.environ.get("OPENAI_API_KEY"))
        client = OpenAI(
            organization='org-W0yiHQz05KvGawnWjdyzc09s',
            project='proj_GUaZv3zs1gDGWrTzf5iFQYch',
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        with open("system_prompt.txt", "r") as system_prompt_file:
            system_prompt = system_prompt_file.read()

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                "role": "system",
                "content": system_prompt
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
        dietaryData = json.loads(response.choices[0].message.content, object_hook=lambda d: SimpleNamespace(**d))
        
        logging.info(dietaryData)
        return func.HttpResponse(response.choices[0].message.content)
    else:
        return func.HttpResponse(
             "Missing input",
             status_code=200
        )