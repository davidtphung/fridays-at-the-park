'use client';

import Image from 'next/image';
import { X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useQueueStore } from '@/stores/queueStore';
import { usePlayerStore } from '@/stores/playerStore';
import { formatDuration } from '@/lib/format';

export function QueueDrawer() {
  const { queue, isOpen, setOpen, removeFromQueue, clearQueue, setQueue } = useQueueStore();
  const play = usePlayerStore((s) => s.play);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-[72px] w-full sm:w-96 z-40 bg-bg-secondary border-l border-border shadow-xl overflow-hidden flex flex-col"
        role="complementary"
        aria-label="Play queue"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Queue ({queue.length})</h2>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="text-xs text-text-secondary hover:text-accent transition-colors px-2 py-1"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close queue"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Queue list */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-text-secondary">
              Queue is empty
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={queue}
              onReorder={setQueue}
              className="p-2 space-y-1"
            >
              {queue.map((track, index) => (
                <Reorder.Item
                  key={track.id}
                  value={track}
                  className="flex items-center gap-3 p-2 rounded-lg bg-bg-primary/50 hover:bg-bg-tertiary transition-colors cursor-grab active:cursor-grabbing"
                >
                  <GripVertical size={14} className="text-text-secondary shrink-0" aria-hidden="true" />
                  <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                    <Image src={track.coverImage} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{track.title}</p>
                    <p className="text-xs text-text-secondary truncate">
                      {track.artists.map(a => a.artist.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-xs text-text-secondary tabular-nums shrink-0">
                    {formatDuration(track.duration)}
                  </span>
                  <button
                    onClick={() => removeFromQueue(index)}
                    className="p-1 text-text-secondary hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={`Remove ${track.title} from queue`}
                  >
                    <X size={14} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* Live region */}
        <div className="sr-only" aria-live="polite">
          {queue.length} tracks in queue
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
