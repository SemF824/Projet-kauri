import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';
import { Archive, Trash2, Mail, MailOpen, ArchiveRestore } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

interface SwipeableNotificationProps {
  id: string;
  isRead: boolean;
  isArchived?: boolean;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onToggleRead: (id: string) => void;
  children: React.ReactNode;
}

export const SwipeableNotification: React.FC<SwipeableNotificationProps> = ({
  id,
  isRead,
  isArchived = false,
  onDelete,
  onArchive,
  onToggleRead,
  children,
}) => {
  const { isDarkMode } = useDarkMode();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const x = useMotionValue(0);
  const controls = useAnimation();
  const constraintsRef = useRef<HTMLDivElement>(null);

  const actionWidth = 70;
  const leftActionThreshold = actionWidth; // drag right to trigger mark read/unread
  const rightActionThreshold = -actionWidth * 2; // drag left to trigger archive/delete

  const handleDragEnd = async (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > leftActionThreshold || velocity > 500) {
      // Trigger left action (Mark as read/unread)
      onToggleRead(id);
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    } else if (offset < rightActionThreshold || velocity < -500) {
      // Trigger right action (Delete or Archive)
      // Usually, just snapping open the actions is enough, but Apple Mail deletes if dragged far enough.
      // We will snap open to show Archive / Delete
      controls.start({ x: rightActionThreshold, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    } else if (offset < 0) {
      // Snap open if dragged more than half of one action
      if (offset < -actionWidth / 2) {
        controls.start({ x: rightActionThreshold, transition: { type: 'spring', stiffness: 300, damping: 30 } });
      } else {
        controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } });
      }
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    }
  };

  const handleActionClick = (action: 'delete' | 'archive') => {
    controls.start({ x: 0 });
    if (action === 'delete') {
      setIsDeleting(true);
      setTimeout(() => onDelete(id), 300); // Wait for animation
    } else {
      onArchive(id);
    }
  };

  if (isDeleting) {
    return null; // A simple exit animation could be added here
  }

  return (
    <div className="relative overflow-hidden mb-2" ref={constraintsRef}>
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between rounded-2xl overflow-hidden">
        {/* Left Action (Mark Read/Unread) */}
        <div className="h-full flex items-center bg-[#006D77] px-4 w-1/2">
          {isRead ? <Mail className="w-6 h-6 text-white" /> : <MailOpen className="w-6 h-6 text-white" />}
        </div>
        
        {/* Right Actions (Archive, Delete) */}
        <div className="h-full flex items-center justify-end w-1/2">
          <button 
            onClick={() => handleActionClick('archive')}
            className="h-full w-[70px] bg-[#64748B] flex items-center justify-center"
          >
            {isArchived ? (
              <ArchiveRestore className="w-5 h-5 text-white" />
            ) : (
              <Archive className="w-5 h-5 text-white" />
            )}
          </button>
          <button 
            onClick={() => handleActionClick('delete')}
            className="h-full w-[70px] bg-[#EF4444] flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: rightActionThreshold, right: actionWidth }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className={`relative z-10 rounded-2xl shadow-sm ${
          isDarkMode ? 'bg-[#1E293B]' : 'bg-white'
        }`}
      >
        {children}
      </motion.div>
    </div>
  );
};
