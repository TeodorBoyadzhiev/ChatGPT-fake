import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { main } from '../../lib/gemini';
import "./dashboardPage.css";

interface MutationInput {
  text: string;
  answer: string;
}

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation<string, Error, MutationInput>({
    mutationFn: async ({ text, answer }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, answer }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      return data;
    },
    onSuccess: (id, { text }) => {
      queryClient.invalidateQueries({ queryKey: ["userchats"] });
      navigate(`/dashboard/chats/${id}`, { state: { initialQuestion: text } });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text")?.toString().trim();

    if (!text) return;

    try {
      const answer = await main(text);
      mutation.mutate({ text, answer });
    } catch (err) {
      console.error("Error during AI response or mutation:", err);
    }
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>LAMA AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="Chat" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="Image" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="Code" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button type="submit">
            <img src="/arrow.png" alt="Submit" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;