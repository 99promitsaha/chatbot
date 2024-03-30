import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const OpenAIComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // Set loading to true when form is submitted
      const generatedResponse = await generateResponse(prompt);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: prompt },
        { role: "assistant", content: generatedResponse },
      ]);
      setPrompt("");
      setError(null);
    } catch (error) {
      console.error("Error generating response:", error);
      setError("Error generating response. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after response is generated
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const generateResponse = async (prompt) => {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          max_tokens: 150,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(
        "Error generating response:",
        error.response.data.error.message
      );
      throw new Error(error.response.data.error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div
        className="bg-white p-5 rounded-lg border border-gray-300 w-full max-w-md"
        style={{ fontFamily: "Poppins" }}
      >
        <div className="flex justify-between mb-6">
          <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
          <p className="text-sm text-gray-600">Built by 99promitsaha</p>
        </div>
        <div
          className="overflow-y-auto h-96 mb-6"
          style={{ maxHeight: "calc(100% - 200px)" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-3 items-start">
              {msg.role === "assistant" && <h1>ChatGPT: </h1>}
              {msg.role === "user" && <h1>You: </h1>}
              <div>
                <p
                  className={`text-base font-small mb-4 ${
                    msg.role === "assistant" ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="flex justify-between" onSubmit={handleFormSubmit}>
          <input
            type="text"
            className="flex-1 h-10 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message"
            value={prompt}
            onChange={handlePromptChange}
            style={{ fontFamily: "Poppins" }}
          />
          <button
            type="submit"
            className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            style={{ fontFamily: "Poppins" }}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Sending..." : "Send"} {/* Change button text based on loading state */}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Generated Response:</h3>
            <p className="text-gray-800">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenAIComponent;