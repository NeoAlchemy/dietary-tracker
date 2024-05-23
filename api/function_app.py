import azure.functions as func
import logging
import json
import os
import uuid
from openai import OpenAI
from types import SimpleNamespace
from azure.monitor.opentelemetry import configure_azure_monitor
from dotenv import load_dotenv
from azure.cosmos import CosmosClient
from datetime import datetime, timedelta
import pytz


app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)
logger = logging.getLogger(__name__)
load_dotenv()
configure_azure_monitor()

@app.route(route="dietary", methods=['GET'])
def getDietary(req: func.HttpRequest) -> func.HttpResponse:
    logger.info('Python HTTP trigger function processed a request.')

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
        client = OpenAI(
            organization='org-W0yiHQz05KvGawnWjdyzc09s',
            project='proj_GUaZv3zs1gDGWrTzf5iFQYch',
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        
        #with open("system_prompt.txt", "r") as system_prompt_file:
        #    system_prompt = system_prompt_file.read()
        #
        #response = client.chat.completions.create(
        #    model="gpt-3.5-turbo",
        #    messages=[
        #        {
        #        "role": "system",
        #        "content": system_prompt
        #        },
        #        {
        #        "role": "user",
        #        "content": input
        #        }
        #    ],
        #    temperature=0.8,
        #    max_tokens=256,
        #    top_p=1,
        #    frequency_penalty=0,
        #    presence_penalty=0
        #)

        thread = client.beta.threads.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                        "type": "text",
                        "text": input
                        }
                    ]
                }
            ]
        )
        run = client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id="asst_SsyqTBBZeyhhUKw3ldlVPDP7"
        )
        thread_message = client.beta.threads.messages.list(thread.id)
        
        logging.info(thread_message.data[0].content[0].text.value)
        response = thread_message.data[0].content[0].text.value[8:-4]

        dietaryData = json.loads(response, object_hook=lambda d: SimpleNamespace(**d))
        
        logger.info(dietaryData)
        return func.HttpResponse(response)
    else:
        return func.HttpResponse(
             "Missing input",
             status_code=200
        )

@app.route(route="dietary", methods=['POST'])
def postDietary(req: func.HttpRequest) -> func.HttpResponse:
    logger.info('Python HTTP trigger function processed a request.')
    connection_string = os.environ.get('COSMOS_DB_CONNECTION_STRING')

    try:
        body = req.get_json()  # Attempt to get the JSON body
    except ValueError:
        logger.error("Receiving body not in JSON format")
        return func.HttpResponse("Bad request: body not in JSON format", status_code=400)

    if body is None:
        logger.error("No data found in the request")
        return func.HttpResponse("Bad request: no data found", status_code=400)

    # Check if 'name' key exists in the body before accessing it
    for item in body:
        logger.info(item)
        item['id'] = str(uuid.uuid4())
        try: 
            client = CosmosClient.from_connection_string(connection_string)
            database = client.get_database_client("Dietary")
            container = database.get_container_client("dietarydb")
            created_item = container.upsert_item(body=item)
        except Exception as e:
            logger.info(e)

    return func.HttpResponse('{ "success": True}')


@app.route(route="historyList", methods=['GET'])
def getHistoryList(req: func.HttpRequest) -> func.HttpResponse:
    logger.info('Python HTTP trigger function processed a request.')
    connection_string = os.environ.get('COSMOS_DB_CONNECTION_STRING')

    try: 
        client = CosmosClient.from_connection_string(connection_string)
        database = client.get_database_client("Dietary")
        container = database.get_container_client("dietarydb")
        items = list(container.query_items(query='SELECT * FROM c WHERE DateTimeDiff("day", c.date, GetCurrentDateTime()) <= 30', enable_cross_partition_query=True))
        logger.info(items)
    except Exception as e:
        logger.info(e)

    return func.HttpResponse(json.dumps(items))

@app.route(route="historyItem", methods=['DELETE'])
def deleteHistoryItem(req: func.HttpRequest) -> func.HttpResponse:
    logger.info('Python HTTP trigger function processed a request.')
    connection_string = os.environ.get('COSMOS_DB_CONNECTION_STRING')
    input = req.params.get('id')

    if input:
        try: 
            client = CosmosClient.from_connection_string(connection_string)
            database = client.get_database_client("Dietary")
            container = database.get_container_client("dietarydb")
            items = container.delete_item(item=input, partition_key=input)
            logger.info(items)
        except Exception as e:
            logger.info(e)
        return func.HttpResponse('{ "success": true}')
    
    else:
        return func.HttpResponse(
             '{"error": "Missing input" }',
             status_code=200
        )


@app.route(route="historyItem", methods=['POST'])
def postHistoryItem(req: func.HttpRequest) -> func.HttpResponse:
    logger.info('Python HTTP trigger function processed a request.')
    connection_string = os.environ.get('COSMOS_DB_CONNECTION_STRING')

    try:
        body = req.get_json()  # Attempt to get the JSON body
    except ValueError:
        logger.error("Receiving body not in JSON format")
        return func.HttpResponse("Bad request: body not in JSON format", status_code=400)

    if body is None:
        logger.error("No data found in the request")
        return func.HttpResponse("Bad request: no data found", status_code=400)

    # Check if 'name' key exists in the body before accessing it
    if 'id' in body:
        logger.info(body)
    else:
        logger.info("No id in the body")

    try: 
        client = CosmosClient.from_connection_string(connection_string)
        database = client.get_database_client("Dietary")
        container = database.get_container_client("dietarydb")
        item = container.read_item(item=body['id'], partition_key=body['id'])
        item['name'] = body['name']
        item['volume'] = body['volume']
        item['unit'] = body['unit']
        item['caffeine'] = body['caffeine']
        item['date'] = body['date']
        item['id'] = body['id']
        response = container.replace_item(item=item, body=item)

    except Exception as e:
        logger.error(e)

    return func.HttpResponse('{ "success": True}')


@app.route(route="dashboard", methods=['GET'])
def getDashboard(req: func.HttpRequest) -> func.HttpResponse:
    logger.info('Python HTTP trigger function processed a request.')
    count = 0
    dashboard = {}
    caffeine = 0
    occurance = req.params.get('occurance')
    connection_string = os.environ.get('COSMOS_DB_CONNECTION_STRING')

    if occurance:

        count = 0
        if occurance == 'DAILY': 
            count = '1'
        elif occurance == 'WEEKLY':
            count = '7'
        elif occurance == 'MONTHLY':
            count = '30'
        
        central_tz = pytz.timezone('US/Central')
        now_utc = datetime.now(pytz.utc)

        now_central = now_utc.astimezone(central_tz)

        start_of_day_central = now_central.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_day_utc = start_of_day_central.astimezone(pytz.utc)

        end_of_day_central = start_of_day_central + timedelta(days=1)
        end_of_day_utc = end_of_day_central.astimezone(pytz.utc)
        start_of_day_str = start_of_day_utc.strftime('%Y-%m-%dT%H:%M:%SZ')
        end_of_day_str = end_of_day_utc.strftime('%Y-%m-%dT%H:%M:%SZ')      
        
        try: 
            client = CosmosClient.from_connection_string(connection_string)
            database = client.get_database_client("Dietary")
            container = database.get_container_client("dietarydb")
            items = list(container.query_items(query=f"SELECT * FROM c WHERE c.date >= '{start_of_day_str}' AND c.date < '{end_of_day_str}'", enable_cross_partition_query=True))
            logger.info(items)

            caffeineTotal = 0
            waterTotal = 0
            for item in items:
                caffeineTotal = caffeineTotal + int(item['caffeine'])
                if item['name'].lower() == "water":
                    waterTotal = waterTotal + int(item['volume'])
                    
            
            dashboard = { 'caffeineTotal' : caffeineTotal, 'waterTotal': waterTotal }
            

        except Exception as e:
            logger.error(e)
            return func.HttpResponse(
            '{"error": "error occurred" }',
             status_code=200
        )

        return func.HttpResponse(json.dumps(dashboard))
    
    else:
        return func.HttpResponse(
             '{"error": "Missing occurance" }',
             status_code=200
        )

