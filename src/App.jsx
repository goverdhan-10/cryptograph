import { useState } from "react";
import "./App.css";
import Topbar from "./Topbar/Topbar";
import Sidebar from "./Leftsidebar/Leftsidebar";
import CoinChart from "./Center/Chart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      {/* Topbar */}
      <Topbar />

      {/* Main Content */}
      <div className="main-content flex h-[calc(100vh-4rem)]"> {/* Adjust height to account for Topbar */}
        {/* Sidebar */}
        <div className="sidebar bg-gray-900 overflow-y-auto"> {/* Enable scrolling for sidebar */}
          <Sidebar />
        </div>

        {/* Center Component */}
        <div className="flex-1 overflow-y-auto"> {/* Enable scrolling for center component */}
          <CoinChart coinId="bitcoin" />
        </div>
      </div>
    </div>
  );
}

export default App;