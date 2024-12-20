from flask import Flask, request, jsonify
import openai

openai.api_key = "YOUR_OPENAI_API_KEY"

app = Flask(__name__)


@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data['question']

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Answer the following question about health and diseases: {question}",
        max_tokens=100
    )

    answer = response.choices[0].text.strip()
    return jsonify({"answer": answer})


if __name__ == '__main__':
    app.run(debug=True)
