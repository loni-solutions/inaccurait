from scraper import get_top_python_questions
from gptasker import ask_question


def generate_stackov_articles(mode: str):
    questions = get_top_python_questions(mode)
    articles = []
    
    for i, question in enumerate(questions, start=1):
        print(f'question {i}.... {question["title"]}')
        try:
            answer = ask_question(
                question["body"], question["title"], question["link"], question['id'])
            answer['date'] = question['date']
            articles.append(answer)
            print(f'asnwered\n')
        except Exception as e:
            print('Error:', e)
    return articles
