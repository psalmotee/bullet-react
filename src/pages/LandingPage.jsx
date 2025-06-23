import { useNavigate } from "react-router-dom";
import { Home, Github } from "lucide-react";
import reactLogo from "../assets/react.svg";
import Button from "../components/ui/Button";

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Logo */}
        <img 
          src={reactLogo} 
          className="h-24 mx-auto mb-8 animate-spin-slow" 
          alt="React logo" 
        />
        
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Bulletproof React
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Showcasing Best Practices For Building React Applications
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="min-w-[200px]"
          >
            <Home size={20} />
            Get Started
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            className="min-w-[200px]"
            onClick={() => window.open("http://github.com/psalmotee", "_blank")}
          >
            <Github size={20} />
            Github Repo
          </Button>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Home className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Architecture</h3>
          <p className="text-gray-600">Built with the latest React patterns and best practices</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Github className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Source</h3>
          <p className="text-gray-600">Free and open source with comprehensive documentation</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Home className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Production Ready</h3>
          <p className="text-gray-600">Scalable and maintainable code structure</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;