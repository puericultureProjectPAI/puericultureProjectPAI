import "./App.css";
import InstallPWA from "./common/components/InstallPWA";

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* The installation banner handles its own visibility logic */}
      <InstallPWA />

      <header className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Puericulture Platform
        </h1>
      </header>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          Project PAI
        </p>

        <button className="w-full sm:bg-red-500 sm:w-96 bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition">
          Do nothing
        </button>
      </div>
    </div>
  );
}

export default App;
