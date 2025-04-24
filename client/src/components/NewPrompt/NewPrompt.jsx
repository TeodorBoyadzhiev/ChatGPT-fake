import React, { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import './newPrompt.css';
import { IKImage } from 'imagekitio-react';
import { main } from '../../lib/gemini';
import Markdown from 'react-markdown';

const NewPrompt = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: ""
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [answer, question, img.dbData]);

  const add = async (text) => {
    setQuestion(text);
    setAnswer(main(text));
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
          urlEndpoint={"https://ik.imagekit.io/6rb8jp8qk"}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{width: "380px"}]}
          
        />
      )}

      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message'>{answer}</div>}

      <div className="endChat" ref={endRef}></div>
        <form className="newForm" onSubmit={handleSubmit} >
          <Upload setImg={setImg}/>
          <input id="file" type="file" multiple={false} hidden />
          <input type="text" name="text" placeholder="Ask anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
    </>
  )
}

export default NewPrompt