import { Link } from "react-router-dom";
import "./landingpage.css";
import { TypeAnimation } from "react-type-animation";
import { useState, FC } from "react";

type TypingStatus = "human1" | "human2" | "bot";

const Homepage: FC = () => {
  const [typingStatus, setTypingStatus] = useState<TypingStatus>("human1");

  const getImageSrc = (status: TypingStatus): string => {
    switch (status) {
      case "human1":
        return "/human1.jpeg";
      case "human2":
        return "/human2.jpeg";
      case "bot":
        return "/bot.png";
      default:
        return "/bot.png";
    }
  };

  const getAltText = (status: TypingStatus): string => {
    switch (status) {
      case "human1":
        return "User Human 1";
      case "human2":
        return "User Human 2";
      case "bot":
        return "Chat Bot";
      default:
        return "Chat Image";
    }
  };

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="Decorative Orbital Graphic" className="orbital" />
      <div className="left">
        <h1>LAMA AI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint
          dolorem doloribus, architecto dolor.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="Robot illustration" className="bot" />
          <div className="chat">
            <img
              src={getImageSrc(typingStatus)}
              alt={getAltText(typingStatus)}
            />
            <TypeAnimation
              sequence={[
                "Human:We produce food for Mice",
                2000,
                () => setTypingStatus("bot"),
                "Bot:We produce food for Hamsters",
                2000,
                () => setTypingStatus("human2"),
                "Human2:We produce food for Guinea Pigs",
                2000,
                () => setTypingStatus("bot"),
                "Bot:We produce food for Chinchillas",
                2000,
                () => setTypingStatus("human1"),
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="LAMA AI Logo" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;