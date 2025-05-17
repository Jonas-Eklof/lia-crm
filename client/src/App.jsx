import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./components/Main/Content/Content";
import { useState } from "react";
import Header from "./components/Main/Header/Header";

function App() {
  const [activeView, setActiveView] = useState("companies");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeView === "companies" && <Content />}
        </main>
      </div>
    </div>
  );
}

export default App;
