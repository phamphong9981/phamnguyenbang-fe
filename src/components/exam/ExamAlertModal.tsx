'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamAlertModalProps {
    isOpen: boolean;
    title?: string;
    message: string | React.ReactNode;
    type?: 'warning' | 'error' | 'info';
    onClose?: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    closeText?: string;
    hideCloseButton?: boolean;
}

export default function ExamAlertModal({
    isOpen,
    title,
    message,
    type = 'warning',
    onClose,
    onConfirm,
    confirmText = 'Đồng ý',
    closeText = 'Đóng',
    hideCloseButton = false
}: ExamAlertModalProps) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'warning':
                return (
                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:h-12 sm:w-12">
                        <svg className="h-8 w-8 text-orange-600 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                        <svg className="h-8 w-8 text-red-600 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            case 'info':
            default:
                return (
                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-12 sm:w-12">
                        <svg className="h-8 w-8 text-blue-600 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </div>
                );
        }
    };

    const getConfirmButtonStyles = () => {
        switch (type) {
            case 'error':
                return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
            case 'warning':
                return 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500';
            case 'info':
            default:
                return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
        }
    };

    return (
        <AnimatePresence>
            <div className="relative z-50">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100"
                        >
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    {getIcon()}
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        {title && (
                                            <h3 className="text-xl font-bold leading-6 text-gray-900 mb-2">
                                                {title}
                                            </h3>
                                        )}
                                        <div className="mt-2">
                                            <div className="text-base text-gray-600 whitespace-pre-wrap leading-relaxed">
                                                {message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                {onConfirm && (
                                    <button
                                        type="button"
                                        onClick={onConfirm}
                                        className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto transition-colors ${getConfirmButtonStyles()}`}
                                    >
                                        {confirmText}
                                    </button>
                                )}
                                {!hideCloseButton && onClose && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto transition-colors"
                                    >
                                        {closeText}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
