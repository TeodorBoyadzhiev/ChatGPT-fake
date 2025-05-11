import { Fragment } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import NewPrompt from "../../components/NewPrompt/NewPrompt";
import "./chatPage.css";

const ChatPage = () => {
  const location = useLocation();
  const chatId = location.pathname.split("/").pop();
  const initialQuestion = location.state?.initialQuestion || "";

  const { isPending, error, data } = useQuery({
    queryKey: ["chats", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
    staleTime: 10000,
  });

  console.log("ChatPage: ", data)

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
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
                    <div>{message.parts[0]?.text}</div>
                  </div>
                </Fragment>
              ))}

          {data && <NewPrompt data={data} initialQuestion={initialQuestion}/>}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;