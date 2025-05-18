import { useLayoutEffect, useState } from "react";
import "./scrollButtons.css";

interface ScrollButtonProps {
  direction: "up" | "down";
  scrollContainer: React.RefObject<HTMLDivElement>;
  targetRef?: React.RefObject<HTMLDivElement>;
}

const ScrollButton = ({ direction, scrollContainer, targetRef }: ScrollButtonProps) => {
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
        
      if (direction === "down") {
        setVisible(distanceFromBottom > 50);
      } else if (direction === "up") {
        setVisible(container.scrollTop > 50);
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainer, direction]);

  const handleClick = () => {
    if (direction === "down" && targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (direction === "up") {
      scrollContainer.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const arrow = direction === "up" ? "↑" : "↓";

  if (!visible) return null;

  return (
    <button className={`scrollBtn scrollBtn-${direction}`} onClick={handleClick}>
      {arrow}
    </button>
  );
};

export default ScrollButton;
