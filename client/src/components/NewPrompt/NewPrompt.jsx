import React, { useEffect, useRef } from 'react'
import Upload from '../upload/Upload'
import './newPrompt.css'

const NewPrompt = () => {

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <div>NewPrompt</div>
      <div className="endChat" ref={endRef}></div>
        <form className="newForm" ref={formRef}>
          <Upload />
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