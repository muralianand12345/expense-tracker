"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signIn("google", { callbackUrl: "/app" });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        💰 Personal Expense Tracker
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Sign in to track and manage your expenses
                    </p>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-700 px-4 py-3 text-gray-700 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-offset-0"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                    ) : (
                        <Image
                            src="/google-logo.svg"
                            alt="Google Logo"
                            width={20}
                            height={20}
                        />
                    )}
                    <span>Sign in with Google</span>
                </button>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        By signing in, you agree to our{" "}
                        <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}