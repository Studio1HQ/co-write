import { createRoot } from "react-dom/client";
import CoWrite from "./cowrite";
import "./cowrite.css";

createRoot(document.body).render(<CoWrite />);

export { CoWrite };
export default CoWrite;