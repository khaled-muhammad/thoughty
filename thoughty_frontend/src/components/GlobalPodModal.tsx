import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePodModal } from '../contexts/PodModalContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalPodModal() {
  const { isOpen, closeModal, newPodData, setNewPodData, handleCreatePod } = usePodModal();

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-md"
            onClick={closeModal}
          />

          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 20,
              filter: "blur(10px)"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              filter: "blur(0px)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 20,
              filter: "blur(10px)"
            }}
            transition={{ 
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="relative bg-card-bg/90 backdrop-filter backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl transform max-w-lg w-full border border-white/10"
          >
            {/* Modal Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="border-b border-white/10 px-6 py-5 bg-gradient-to-r from-primary/10 to-accent/10"
            >
              <div className="flex justify-between items-center">
                <motion.h5 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-xl font-semibold text-light"
                >
                  Create New Thought Pod
                </motion.h5>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  type="button"
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
                  onClick={closeModal}
                >
                  <FontAwesomeIcon icon={faTimes} className="text-lg" />
                </motion.button>
              </div>
            </motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="px-6 py-6 bg-gradient-to-br from-card-bg/50 to-card-bg/80"
            >
              <form onSubmit={(e) => { e.preventDefault(); handleCreatePod(); }} className="space-y-6 text-left">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <label className="block text-left text-light mb-2 font-medium">Title</label>
                  <input
                    type="text"
                    value={newPodData.title}
                    onChange={(e) => setNewPodData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter pod title"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm text-light border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 hover:bg-white/10"
                    required
                  />
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <label className="block text-left text-light mb-2 font-medium">Content</label>
                  <textarea
                    value={newPodData.content}
                    onChange={(e) => setNewPodData(prev => ({ ...prev, content: e.target.value }))}
                    rows={5}
                    placeholder="Enter your content here..."
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm text-light border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 resize-none hover:bg-white/10"
                    required
                  />
                </motion.div>

                {/* Stage */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <label className="block text-left text-light mb-2 font-medium">Stage</label>
                  <select
                    value={newPodData.stage}
                    onChange={(e) => setNewPodData(prev => ({ ...prev, stage: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm text-light border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 hover:bg-white/10"
                  >
                    <option value="seed" className="bg-darker">Seed</option>
                    <option value="sprout" className="bg-darker">Sprout</option>
                    <option value="bloom" className="bg-darker">Bloom</option>
                    <option value="fruit" className="bg-darker">Fruit</option>
                  </select>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <label className="block text-left text-light mb-2 font-medium">Tags</label>
                  <input
                    type="text"
                    value={newPodData.tags}
                    onChange={(e) => setNewPodData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags (comma separated)"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm text-light border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 hover:bg-white/10"
                  />
                </motion.div>

                {/* Version */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <label className="block text-left text-light mb-2 font-medium">Version</label>
                  <input
                    type="text"
                    value={newPodData.version}
                    onChange={(e) => setNewPodData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm text-light border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 hover:bg-white/10"
                  />
                </motion.div>

                {/* Public Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={newPodData.isPublic}
                    onChange={(e) => setNewPodData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-5 h-5 text-primary bg-white/10 border-white/20 rounded focus:ring-primary/50 focus:ring-2 transition-all duration-200"
                  />
                  <label className="text-left text-light font-medium">Make this pod public</label>
                </motion.div>
              </form>
            </motion.div>

            {/* Modal Footer */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              className="border-t border-white/10 px-6 py-5 flex justify-end space-x-3 bg-gradient-to-r from-card-bg/80 to-card-bg/60"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={closeModal}
                className="px-6 py-3 bg-white/10 text-light rounded-xl hover:bg-white/20 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleCreatePod}
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
              >
                Create Pod
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 