import { FC } from 'react';
import { SignUp } from '@clerk/clerk-react';
import './signUpPage.css';

const SignUpPage: FC = () => {
  return (
    <div className="signUpPage">
      <SignUp path="/sign-up" />
    </div>
  );
};

export default SignUpPage;
