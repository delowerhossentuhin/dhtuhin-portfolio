'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SubscribeModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-950 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">Newsletter</p>
                <h2 className="mt-2 font-display text-2xl text-white">Stay in the loop.</h2>
                <p className="mt-1 text-sm text-ink-300">
                  Get an email when a new post lands. No marketing, no schedule.
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid h-8 w-8 flex-none place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-200 hover:text-white transition"
              >
                <X size={14} />
              </button>
            </div>
            <NewsletterForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}