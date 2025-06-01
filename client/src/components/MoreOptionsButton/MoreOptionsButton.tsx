import { useState, useRef, useEffect } from "react";
import "./moreOptionsButton.css";

const DropdownMenuButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    // Затваряне при клик извън менюто
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="menuWrapper" ref={menuRef}>
            <span
                className={`menuBtn menuBtn-visible`}
                onClick={toggleMenu}
                aria-label="More options"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </svg>
            </span>

            <div className={`dropdownMenu ${isOpen ? "show" : ""}`}>
                <button onClick={() => alert("You are going to delete this chat")}>Delete</button>
            </div>
        </div>
    );
};

export default DropdownMenuButton;
