'use client'
import SideNav from '@/components/SideNav'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
    const [user, setUser] = useState<{ username: string, email: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Retrieve user data from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Redirect to login page if no user data is found
            router.push('/auth/signin');
        }
    }, [router]);

    return (
        <>
            <div className="flex h-screen">
                <SideNav />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-x-hidden overflow-y-auto pl-8">
                        <div className="container mx-auto py-6">
                            <p>Overview</p>
                            {user && (
                                <p className="mt-4 text-lg">
                                    Welcome {user.username ? user.username : user.email}!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page