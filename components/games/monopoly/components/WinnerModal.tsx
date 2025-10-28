import { Button } from "@/components/ui/button";
import { Player } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface WinnerModalProps {
    winner: Player;
    onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative p-8 bg-linear-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl border border-purple-600 text-white text-center max-w-md mx-4"
                initial={{ scale: 0.7, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.7, y: 50 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-5xl font-extrabold mb-4 text-yellow-300 drop-shadow-lg">
                    🎉 Winner! 🎉
                </h2>
                <p className="text-3xl font-bold mb-6">
                    Congratulations,{" "}
                    <span style={{ color: winner.color }}>{winner.name}</span>!
                </p>
                <p className="text-lg mb-8 text-purple-200">
                    You have conquered the board and emerged victorious!
                </p>
                <Button
                    onClick={onClose}
                    className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Play Again
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default WinnerModal;
