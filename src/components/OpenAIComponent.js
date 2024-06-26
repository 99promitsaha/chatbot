import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const OpenAIComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: prompt },
      ]);
      const generatedResponse = await generateResponse(prompt, messages);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: generatedResponse },
      ]);
      setPrompt("");
      setError(null);
    } catch (error) {
      console.error("Error generating response:", error);
      setError("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      return;
    }
    handleSubmit();
    setPrompt("");
  };

  const generateResponse = async (prompt, previousMessages) => {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          max_tokens: 500,
          messages: [
            {
              role: "system",
              content:
                "Please respond in a sarcastic yet informative way! Add emoji's in your answer to make it more fun!",
            },
            ...previousMessages,
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
      <div className="bg-white p-5 rounded-lg border border-gray-300 w-full max-w-md">
        <div className="flex justify-between mb-6">
          <h2
            className="font-semibold text-xl tracking-tight"
            style={{ fontFamily: "Poppins" }}
          >
            ChaatGPT 🇮🇳
          </h2>
          <p
            className="text-sm text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            Built by{" "}
            <a href="https://twitter.com/99promitsaha" target="blank">
              <span className="underline text-blue-500">99promitsaha</span>
            </a>
          </p>
        </div>
        {/* Initial message section */}
        <div className="mb-6">
          <p
            className="text-sm text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            🔓 Messages are not end-to-end encrypted.
          </p>
        </div>
        <div
          className="overflow-y-auto h-96 mb-6"
          style={{ maxHeight: "calc(100% - 200px)" }}
        >
          {/* Chat messages */}
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-3 items-start mb-4">
              <div
                className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl dark:bg-gray-700 ${
                  msg.role === "assistant" ? "bg-green-100" : "bg-gray-100"
                } ${msg.role === "user" ? "ml-auto" : ""}`}
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span
                    className={`text-sm font-semibold ${
                      msg.role === "assistant"
                        ? "text-green-900"
                        : "text-gray-900"
                    } dark:text-white`}
                  >
                    {msg.role === "assistant" ? "ChaatGPT Bhai" : "You"}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString()}{" "}
                  </span>
                </div>
                <p
                  className={`text-sm font-normal py-2.5 ${
                    msg.role === "assistant"
                      ? "text-green-900"
                      : "text-gray-800"
                  } dark:text-white`}
                >
                  {msg.content}
                </p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Read
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="flex flex-wrap items-center justify-between bg-white-200 rounded-md p-2"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            className="flex-1 h-10 px-3 rounded-full border border-gray-300 mb-4 md:mb-0 md:mr-2"
            placeholder="Text Message"
            value={prompt}
            onChange={handlePromptChange}
            style={{ fontFamily: "Poppins" }}
            disabled={loading}
          />
          <button
            type="submit"
            className={`w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ${
              loading ? "cursor-not-allowed" : ""
            }`}
            style={{ fontFamily: "Poppins" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-1 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Thinking
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm">Generated Response:</h3>
            <p className="text-gray-800">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenAIComponent;
