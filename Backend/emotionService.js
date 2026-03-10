const { HfInference } = require("@huggingface/inference");

// Initialize the Hugging Face Inference client
// It will automatically use the HF_TOKEN environment variable.
const hf = new HfInference();

async function detectEmotion(text) {
  try {
    const response = await hf.textClassification({
      model: "SamLowe/roberta-base-go_emotions",
      inputs: text,
    });
    return response;
  } catch (error) {
    console.error("Error detecting emotion:", error);
    return { error: "Failed to detect emotion." };
  }
}

module.exports = detectEmotion;