import { useEffect, useRef, useState, FormEvent } from "react";
import { IKImage } from "imagekitio-react";
import { main } from "../../lib/gemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Upload from "../upload/Upload";
import TypingDots from "../TypingDots/TypingDots";
import ReactMarkdown from "react-markdown";
import "./newPrompt.css";

interface ChatData {
  _id: string;
  [key: string]: any;
}

interface NewPromptProps {
  data: ChatData;
  initialQuestion?: string;
}

interface ImgState {
  isLoading: boolean;
  error: string;
  dbData: {
    filePath?: string;
    [key: string]: any;
  };
}

interface MutationPayload {
  question?: string;
  answer: string;
}

const NewPrompt = ({ data, initialQuestion }: NewPromptProps) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [img, setImg] = useState<ImgState>({
    isLoading: false,
    error: "",
    dbData: {},
  });
  const [thinking, setThinking] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const questionRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const hasAskedInitialQuestion = useRef<boolean>(false);

  useEffect(() => {
    questionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer, question, img.dbData]);

  useEffect(() => {
    if (initialQuestion && data?._id && !hasAskedInitialQuestion.current) {
      hasAskedInitialQuestion.current = true;
      add(initialQuestion, true);
    }
  }, [initialQuestion, data?._id]);

  const mutation = useMutation({
    mutationFn: async ({ answer, question }: MutationPayload) => {
      if (!data?._id) return null;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question?.length ? question : undefined,
            answer,
            img: img.dbData?.filePath || undefined,
          }),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chats", data._id] })
        .then(() => {
          formRef.current?.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
          });
        });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const add = async (text: string, initial: boolean = false) => {
    if (!initial) {
      setQuestion(text);
      setThinking(true);
      const result = await main(text);
      setThinking(false);
      setAnswer(result);
      mutation.mutate({ answer: result, question: text });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const input = form.elements.namedItem("text") as HTMLInputElement;
    const text = input?.value.trim();

    if (!text) return;

    add(text);
  };

  return (
    <>
      {img.isLoading && <div className="loading">Loading...</div>}

      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData.filePath}
          width="380"
          transformation={[{ width: "380px" }]}
        />
      )}

      {question && <div className="message user" ref={questionRef}>{question}</div>}
      {thinking && <TypingDots />}
      {answer && (
        <div className="message">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input
          type="text"
          name="text"
          placeholder="Ask anything..."
          disabled={mutation.isLoading}
        />
        <button disabled={mutation.isLoading}>
          <img src="/arrow.png" alt="Send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
