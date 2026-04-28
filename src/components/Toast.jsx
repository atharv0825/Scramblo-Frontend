import { useEffect, useState } from "react";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsInfoCircleFill,
} from "react-icons/bs";

function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [message]);


  const config = {
    success: {
      icon: <BsCheckCircleFill className="text-green-400" />,
      border: "border-green-400/40",
    },
    error: {
      icon: <BsXCircleFill className="text-red-400" />,
      border: "border-red-400/40",
    },
    info: {
      icon: <BsInfoCircleFill className="text-blue-400" />,
      border: "border-blue-400/40",
    },
  };

  const { icon, border } = config[type] || config.info;

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div
        className={`
          flex items-center gap-3 px-6 py-3 rounded-2xl shadow-lg
          backdrop-blur-lg bg-white/20 border ${border}
          text-gray-900 font-medium
        `}
      >
        {/* Icon */}
        <span className="text-lg">{icon}</span>

        {/* Message */}
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Toast;