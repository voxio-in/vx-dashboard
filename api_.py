import requests 
import json
from requests import Response 
import os 

def hit_api(
    method : str , 
    url : str , 
    json_data : dict | None = None
) -> Response | None : 

    try : 

        if method == 'GET' : return requests.get(
            url = url , 
            json = json_data , 
            headers = {
                "Authorization": f"Bearer {os.getenv('HF_TOKEN' , '')}",
                "Content-Type": "application/json"
            }
        )
        elif method == 'POST' : return requests.post(
            url = url , 
            json = json_data , 
            headers = {
                "Authorization": f"Bearer {os.getenv('HF_TOKEN' , '')}",
                "Content-Type": "application/json"
            }
        )

        print(f'invalid method {method}')

    except Exception as e : print(f'Encountered Error while trying to hit the api {e}')

def signup_user(username : str , password : str , config : dict) -> str | None : 

    response : Response | None = hit_api(
        method = 'POST' , 
        url = f"{config['settings']['url']}/{username}/{password}/add" , 
    )

    if (
        response and 
        response.status_code == 200
    ) : return response.text 
def authenticate_user(username : str , password : str , config : dict) -> bool :  

    response : Response | None = hit_api(
        method = 'POST' , 
        url = f"{config['settings']['url']}/{username}/{password}/authenticate"
    )

    if (
        response and 
        response.status_code == 200 and 
        response.text == 'True'
    ) : return True 
    return False
def get_user_api_key(username : str , config : dict) -> str | None :

    response : Response | None = hit_api(
        method = 'GET' , 
        url = f"{config['settings']['url']}/{username}/api_key"
    )

    if (
        response and 
        response.status_code == 200
    ) : return response.text

    return None 
def get_current_config(api_key : str , service_type : str , config : dict)  : 

    response : Response | None = hit_api(
        method = 'GET' , 
        url = f"{config['settings']['url']}/{api_key}/{service_type}"
    )

    if (
        response and 
        response.status_code == 200 
    ) : return json.loads(response.text)
    return None 
def update_config(api_key : str , service_type : str , config : dict , updating_config : dict) -> bool :

    response : Response | None = hit_api(
        method = 'POST' , 
        url = f"{config['settings']['url']}/{api_key}/{service_type}" , 
        json_data = updating_config
    )

    if (
        response and 
        response.status_code == 200
    ) : return True 
    return False