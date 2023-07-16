import { useSelector } from "react-redux";

export default function Username() {
  const { username } = useSelector((state) => state.user);
  if (!username) return null;
  return <div className="hidden text-sm font-semibold tracking-wider md:block">{username}</div>;
}
