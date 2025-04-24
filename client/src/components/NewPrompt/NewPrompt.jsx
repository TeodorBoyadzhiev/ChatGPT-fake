import React, { useEffect, useRef, useState } from 'react'
import Upload from '../upload/Upload'
import './newPrompt.css'
import { IKImage } from 'imagekitio-react';

const NewPrompt = () => {

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: ""
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

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

      <div className="endChat" ref={endRef}></div>
        <form className="newForm" ref={formRef}>
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