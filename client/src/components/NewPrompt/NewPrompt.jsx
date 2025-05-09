import React, { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import './newPrompt.css';
import { IKImage } from 'imagekitio-react';
import { main } from '../../lib/gemini';
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({data, initialQuestion }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {}
  });
  const queryClient = useQueryClient();
  const endRef = useRef(null);
  const formRef = useRef(null);
  const hasAskedInitialQuestion = useRef(false);


  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [answer, question, img.dbData]);


  useEffect(() => {
    if (initialQuestion && data?._id && !hasAskedInitialQuestion.current) {
      hasAskedInitialQuestion.current = true;
      add(initialQuestion);
    }
  }, [initialQuestion, data?._id]);


  const mutation = useMutation({
    mutationFn: async ({answer, question}) => {
      if (!data?._id) return null;
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      setQuestion("");
      queryClient
        .invalidateQueries({ queryKey: ["chats", data._id] })
        .then(() => {
          formRef.current.reset();
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text) => {
    setQuestion(text);
    const result = await main(text);
    setAnswer(result);
    mutation.mutate({answer: result, question: text});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;

    if (!text) return;

    add(text);
  }

  return (
    <>
    {img.isLoading && <div className='loading'>Loading...</div>}
    {
      img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{width: "380px"}]}
          
        />
      )}
      
      {answer && <div className='message'>{answer}</div>}

      <div className="endChat" ref={endRef}></div>
        <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
          <Upload setImg={setImg}/>
          <input id="file" type="file" multiple={false} hidden />
          <input type="text" name="text" placeholder="Ask anything..." disabled={mutation.isPending}/>
          <button disabled={mutation.isPending}>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
    </>
  )
}

export default NewPrompt