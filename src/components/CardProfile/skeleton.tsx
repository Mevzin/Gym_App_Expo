import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

export default function CardProfileSkeleton() {
    return (
        <View className="flex-row mt-5 w-[90%] h-[60px] justify-between">
            <View className="flex-1 flex-row my-auto">
                {/* Avatar skeleton */}
                <Skeleton 
                    className="w-[50px] h-[50px] rounded-full" 
                    mode="dark" 
                />

                <View className="flex-1 justify-center ml-3">
                    {/* Welcome text skeleton */}
                    <Skeleton 
                        className="h-3 w-20 rounded mb-1" 
                        mode="dark" 
                    />
                    {/* User name skeleton */}
                    <Skeleton 
                        className="h-5 w-32 rounded mb-1" 
                        mode="dark" 
                    />
                    {/* Date skeleton */}
                    <Skeleton 
                        className="h-3 w-24 rounded" 
                        mode="dark" 
                    />
                </View>
            </View>
            
            <View className="my-auto">
                {/* Notification button skeleton */}
                <Skeleton 
                    className="w-[45px] h-[45px] rounded-lg" 
                    mode="dark" 
                />
            </View>
        </View>
    );
}