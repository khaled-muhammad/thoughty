import { useState } from 'react';
import type { Pod } from '../../types/pods';

interface PodCommentsProps {
  selectedPod: Pod;
  onEmojiReaction: (podId: number, commentId: number, emoji: string) => void;
  onAddComment: (comment: string) => void;
}

export default function PodComments({ selectedPod, onEmojiReaction, onAddComment }: PodCommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
  };

  return (
    <div className="mb-4">
      <h6 className="text-light font-semibold mb-4 text-lg">
        Comments & Feedback
      </h6>
      <div className="comment-section mb-4 max-h-64 overflow-y-auto space-y-4">
        {selectedPod.comments && selectedPod.comments.length > 0 ? selectedPod.comments.map((comment) => (
          <div key={comment.id} className="comment p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-primary-light">{comment.author}</span>
              <span className="text-gray-400 text-sm">{comment.timestamp}</span>
            </div>
            <p className="mb-3 text-light">{comment.content}</p>
            <div className="emoji-reactions flex items-center space-x-4">
              {(comment.reactions || []).map((reaction) => (
                <div key={reaction.emoji} className="flex items-center space-x-1">
                  <button
                    className={`emoji-reaction cursor-pointer text-lg transition-all duration-200 p-1 rounded-lg hover:bg-white/10 ${
                      reaction.userReacted 
                        ? 'reacted opacity-100 scale-110 bg-primary/20 text-primary' 
                        : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    onClick={() => onEmojiReaction(selectedPod.id, comment.id, reaction.emoji)}
                  >
                    {reaction.emoji}
                  </button>
                  <span className={`reaction-count text-sm font-medium transition-colors duration-200 ${
                    reaction.userReacted ? 'text-primary' : 'text-gray-400'
                  }`}>
                    {reaction.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="text-gray-400 text-center py-4">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          className="bg-white/5 backdrop-blur-sm text-light border border-white/20 rounded-xl px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
          placeholder="Add a comment..."
        />
        <button 
          onClick={handleAddComment}
          className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Post
        </button>
      </div>
    </div>
  );
}