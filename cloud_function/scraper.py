import requests
from datetime import datetime, timedelta
import html
from google.cloud import storage


def get_top_python_questions(mode: str):
    storage_client = storage.Client()
    bucket_name = "inaccurait-articles-1"
    bucket = storage_client.get_bucket(bucket_name)

    end_date = datetime.today().strftime("%Y-%m-%d")
    if mode == "alltime":
        start_date = (datetime.today() - timedelta(days=1827)).strftime("%Y-%m-%d")
    else:
        start_date = (datetime.today() - timedelta(days=245)).strftime("%Y-%m-%d")
    url = f"https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=python&site=stackoverflow&fromdate={start_date}&todate={end_date}&filter=withbody&pagesize=100"
    response = requests.get(url)
    json_data = response.json()
    items = json_data["items"]
    print(len(items))
    questions = []
    bucket_list = list(bucket.list_blobs())
    for item in items:
        if exists_in_bucket(bucket_list, item["question_id"]):
            continue
        id = item["question_id"]
        title = item["title"]
        decoded_title = html.unescape(title)
        link = item["link"]
        body = item["body"]
        decoded_body = html.unescape(body)
        if is_question_body_too_long(decoded_body):
            continue
        questions.append(
            {
                "id": id,
                "title": decoded_title,
                "link": link,
                "body": decoded_body,
                "date": datetime.today().strftime("%Y-%m-%d"),
            }
        )
        if len(questions) == 10:
            return questions
    return questions


def is_question_body_too_long(question_body):
    return len(question_body.split()) > 1000


def exists_in_bucket(bucket_list, question_id):
    for blob in bucket_list:
        if blob.name.endswith(".json"):
            filename = blob.name.split("/")[-1][:-5]
            if str(filename) == str(question_id):
                return True
    return False
