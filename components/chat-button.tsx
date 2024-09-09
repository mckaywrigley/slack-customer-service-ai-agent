"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function ChatButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? <X size={24} /> : <MessageCircle size={24} />}
    </motion.button>
  );
}
