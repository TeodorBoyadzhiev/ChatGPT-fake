import { Fragment, FC, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

import NewPrompt from "../../components/NewPrompt/NewPrompt";
import ScrollButton from "../../components/ScrollToBottom/ScrollButton";
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

const ChatPage: FC = () => {
  const location = useLocation();
  const chatId = location.pathname.split("/").pop() || "";
  
  const initialQuestion =
    (location.state as LocationState)?.initialQuestion || "";

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  console.log(document.body.scrollHeight);
  console.log(document.body.clientHeight);

  return (
    <div className="chatPage">
      <div className="wrapper" ref={scrollContainerRef}>
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

          <div className="endChat" ref={bottomRef}></div>
        </div>

      </div>
      <ScrollButton direction="up" scrollContainer={scrollContainerRef} />
      <ScrollButton direction="down" scrollContainer={scrollContainerRef} targetRef={bottomRef} />
    </div>
  );
};

export default ChatPage;