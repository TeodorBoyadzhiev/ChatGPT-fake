import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import NewPrompt from "../../components/NewPrompt/NewPrompt";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./chatPage.css";

// Типове
interface Message {
  role: "user" | "model";
  parts: { text: string }[];
  img?: string;
}

interface ChatData {
  _id: string;
  history: Message[];
  title?: string;
}

interface LocationState {
  initialQuestion?: string;
}

const ChatPage = () => {
  const location = useLocation();
  const chatId = location.pathname.split("/").pop() || "";
  
  const initialQuestion =
    (location.state as LocationState)?.initialQuestion || "";

  const {
    isLoading,
    error,
    data,
  } = useQuery<ChatData>({
    queryKey: ["chats", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
    staleTime: 10000,
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            "Something went wrong!"
          ) : (
            data?.history?.map((message, i) => (
              <Fragment key={i}>
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={
                    message.role === "user" ? "message user" : "message"
                  }
                >
                  <ReactMarkdown
                    children={message.parts[0]?.text}
                    components={{
                      code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match && match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  />
                </div>
              </Fragment>
            ))
          )}

          {data && <NewPrompt data={data} initialQuestion={initialQuestion} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;