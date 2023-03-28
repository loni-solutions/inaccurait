import json
from google.cloud import storage
from generator import generate_stackov_articles

# Initialize GCS
storage_client = storage.Client()
bucket_name = "inaccurait-articles-1"
bucket = storage_client.get_bucket(bucket_name)


def store_articles(request):
    mode = "alltime"
    if request:
        request_data = request.get_json(force=True)
        mode = request_data.get("mode", "today")

    new_articles = generate_stackov_articles(mode)
    print("new articles received")
    for article in new_articles:
        blob = bucket.blob(f'articles/{article["id"]}.json')
        blob.upload_from_string(json.dumps(article), content_type="application/json")

    return json.dumps({"status": "success"}), 200
    # print(json.dumps({"status": "success"}), 200)


if __name__ == "__main__":
    store_articles({"mode": "alltime"})
