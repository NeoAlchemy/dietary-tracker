import azure.functions as func
import logging
import json
import os
import uuid
from openai import OpenAI
from types import SimpleNamespace
from dotenv import load_dotenv
from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential


app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)
load_dotenv()

@app.route(route="dietary", methods=['GET'])
def getDietary(req: func.HttpRequest) -> func.HttpResponse:
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

@app.route(route="dietary", methods=['POST'])
def postDietary(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = req.get_json()  # Attempt to get the JSON body
    except ValueError:
        logging.error("Receiving body not in JSON format")
        return func.HttpResponse("Bad request: body not in JSON format", status_code=400)

    if body is None:
        logging.error("No data found in the request")
        return func.HttpResponse("Bad request: no data found", status_code=400)

    # Check if 'name' key exists in the body before accessing it
    if 'name' in body:
        logging.info(body)
        body['id'] = str(uuid.uuid4())
    else:
        logging.info("No name in the body")

    try: 
        credential = DefaultAzureCredential()
        client = CosmosClient(url="https://dietarytracker.documents.azure.com:443/", credential=credential)
        database = client.get_database_client("Dietary")
        container = database.get_container_client("dietarydb")
        created_item = container.upsert_item(body=body)
    except Exception as e:
        logging.info(e)

    return func.HttpResponse('{ "success": True}')


@app.route(route="historyList", methods=['GET'])
def getHistoryList(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try: 
        credential = DefaultAzureCredential()
        client = CosmosClient(url="https://dietarytracker.documents.azure.com:443/", credential=credential)
        database = client.get_database_client("Dietary")
        container = database.get_container_client("dietarydb")
        items = list(container.query_items(query='SELECT * FROM c WHERE DateTimeDiff("day", c.date, GetCurrentDateTime()) <= 30', enable_cross_partition_query=True))
        logging.info(items)
    except Exception as e:
        logging.info(e)

    return func.HttpResponse(json.dumps(items))

