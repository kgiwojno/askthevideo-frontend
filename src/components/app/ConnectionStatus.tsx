import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConnectionStatusProps {
  isOffline: boolean;
}

const ConnectionStatus = ({ isOffline }: ConnectionStatusProps) => (
  <AnimatePresence>
    {isOffline && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-destructive/10 border-b border-destructive/30 px-4 py-2 flex items-center justify-center gap-2 text-xs text-destructive"
      >
        <WifiOff className="w-3.5 h-3.5" />
        <span>Backend unreachable — running in offline mode</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConnectionStatus;
