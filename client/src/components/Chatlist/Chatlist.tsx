import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./chatList.css";

type Chat = {
  _id: string;
  title: string;
}

const ChatList = () => {
  const { isLoading, error, data } = useQuery<Chat[]>({
    queryKey: ["userchats"],
    queryFn: async () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
    // enabled: false
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore Lama AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isLoading
          ? "Loading..."
          : error
            ? "Something went wrong!"
            : data?.map((chat) => (
              <NavLink to={`/dashboard/chats/${chat._id}`} key={chat._id} className={({ isActive }) => isActive ? "active" : ""}>
                {chat.title}
              </NavLink>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to Lama AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;