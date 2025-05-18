"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        💰 Personal Expense Tracker
                    </CardTitle>
                    <CardDescription>
                        Sign in to track and manage your expenses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        variant="secondary"
                        width="full"
                        className="flex items-center justify-center gap-3"
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
                    </Button>

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
                </CardContent>
            </Card>
        </div>
    );
}