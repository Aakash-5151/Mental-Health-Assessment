import pickle
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load trained model
model = pickle.load(open("stress_model.pkl","rb"))
vectorizer = pickle.load(open("vectorizer.pkl","rb"))

@app.route("/predict", methods=["POST"])

def predict():

    data = request.json
    message = data["message"]

    text_vec = vectorizer.transform([message])

    prediction = model.predict(text_vec)[0]

    response = ""

    if prediction == "high":
        response = "It seems you are experiencing stress. Try deep breathing."

    elif prediction == "medium":
        response = "You might be slightly stressed. Consider taking a short break."

    else:
        response = "You seem calm. Keep maintaining your mental wellness."

    return jsonify({
        "prediction": prediction,
        "reply": response
    })

if __name__ == "__main__":
    app.run(port=5001)