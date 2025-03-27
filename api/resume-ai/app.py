from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Resume knowledge base
RESUME_KNOWLEDGE = """
John Appleseed is a Principal Data Architect with 10+ years of experience at Apple.
Key positions:
- Principal Data Architect, Apple (2021-Present)
- Senior Data Engineer, Apple (2018-2021)
- Data Engineer, Tesla (2016-2018)
- Software Developer, IBM (2014-2016)

Education:
- MS in Computer Science, Stanford University (2014)
- BS in Computer Engineering, UC Berkeley (2012)

Technical Skills:
- Data Engineering: Python, SQL, Spark, Airflow, BigQuery, Dataflow
- DevOps: Docker, Kubernetes, Terraform, AWS, CI/CD pipelines
- Cloud: AWS (Certified Solutions Architect), GCP (Professional Data Engineer), Azure
- Machine Learning: TensorFlow, PyTorch, scikit-learn

Notable Projects:
- Designed Apple's next-gen data pipeline handling 1B+ daily events
- Implemented real-time analytics platform for Apple Services
- Led migration of Tesla's data warehouse to Google Cloud
"""

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are a professional resume assistant. Use this knowledge base to answer questions:\n{RESUME_KNOWLEDGE}\n\nBe concise and professional in your responses."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=256
        )
        
        return jsonify({
            "reply": response.choices[0].message.content
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)