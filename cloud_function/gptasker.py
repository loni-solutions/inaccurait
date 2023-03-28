from datetime import datetime
import openai

# set up the OpenAI API client
api_key = ""
# use the davinci model for generating code
model_engine = "gpt-3.5-turbo"


def ask_question(question_body, question_title, question_link, questoin_id):
    openai.api_key = api_key

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a AI progamming expert who writes articles with code snippets in python.",
            },
            {"role": "user", "content": f"{question_body}"},
        ],
        max_tokens=2000,
        n=1,
        stop=None,
        temperature=0.5,
        top_p=1,
    )

    return {
        "id": questoin_id,
        "title": question_title,
        "body": response["choices"][0]["message"]["content"],
        "link": question_link,
    }
