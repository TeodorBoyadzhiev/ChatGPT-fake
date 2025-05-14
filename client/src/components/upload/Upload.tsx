import { IKContext, IKUpload } from 'imagekitio-react';
import { useRef } from 'react';

const urlEndpoint: string = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey: string = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

interface UploadProps {
  setImg: React.Dispatch<React.SetStateAction<{
    isLoading: boolean;
    error: string;
    dbData: Record<string, any>;
    aiData?: Record<string, any>;
  }>>;
}

const authenticator = async (): Promise<{
  signature: string;
  expire: number;
  token: string;
}> => {
  const response = await fetch('http://localhost:3000/api/upload');
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const { signature, expire, token } = data;
  return { signature, expire, token };
};

const Upload: React.FC<UploadProps> = ({ setImg }) => {
const ikUploadRef = useRef<any>(null); // IKUpload does not provide strict ref type

const onError = (err: any): void => {
    // Handle both Error objects and React synthetic events gracefully
    if (err && typeof err === 'object' && 'message' in err) {
        console.error("Error", err.message);
    } else {
        console.error("Error", err);
    }
};

const onSuccess = (res: any) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
};

// Remove the unused UploadProgress interface and update the handler to match the expected type
const onUploadProgress = (evt: ProgressEvent<XMLHttpRequestEventTarget>): void => {
    if (evt.lengthComputable) {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        console.log("Progress", { loaded: evt.loaded, total: evt.total, percent });
    } else {
        console.log("Progress event received, but length is not computable.");
    }
};

const onUploadStart = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("Start", evt);
    setImg((prev) => ({ ...prev, isLoading: true }));
};

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: 'none' }}
        ref={ikUploadRef}
      />
      <label onClick={() => ikUploadRef.current?.click()}>
        <img src="/attachment.png" alt="Upload" />
      </label>
    </IKContext>
  );
};

export default Upload;