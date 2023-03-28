from flask import Flask, jsonify, send_from_directory, request
from google.cloud import storage
import json
from collections import defaultdict
import re
from datetime import datetime
from flask_cors import CORS


app = Flask(
    __name__,
    static_folder="react_app/build/static",
    template_folder="react_app/build",
)
CORS(app)

# Initialize GCS
storage_client = storage.Client()
bucket_name = "inaccurait-articles-1"
bucket = storage_client.get_bucket(bucket_name)


def get_articles(page: int, per_page: int):
    prefix = "articles/"
    blobs = bucket.list_blobs(prefix=prefix)
    articles = []

    start_index = (page - 1) * per_page
    end_index = start_index + per_page

    for index, blob in enumerate(blobs):
        if index >= end_index:
            break

        if index >= start_index:
            article_json = blob.download_as_text()
            article = json.loads(article_json)
            articles.append(article)

    return articles


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_static(path):
    if path and not path.startswith("api"):
        return send_from_directory("react_app/build", path)
    else:
        return send_from_directory("react_app/build", "index.html")


@app.route("/api/articles")
def api_articles():
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)

    days_with_articles = defaultdict(list)
    articles = get_articles(page, per_page)

    for article in articles:
        if "date" in article:
            day = article["date"]
        else:
            day = datetime.today().strftime("%Y-%m-%d")
        days_with_articles[day].append(article)

    return jsonify(days_with_articles)


if __name__ == "__main__":
    app.run(port=8080)
