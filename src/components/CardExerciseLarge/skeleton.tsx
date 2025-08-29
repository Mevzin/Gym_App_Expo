import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

export default function CardExerciseLargeSkeleton() {
    return (
        <View className="w-[100%] h-24 bg-secondary/30 rounded-lg my-3 px-5 items-center justify-between flex-row">
            <View className="flex-row justify-center items-center">
                <View className="mr-3">
                    {/* Check circle icon skeleton */}
                    <Skeleton 
                        className="w-[25px] h-[25px] rounded-full" 
                        mode="dark" 
                    />
                </View>
                <View>
                    {/* Exercise name skeleton */}
                    <Skeleton 
                        className="h-6 w-40 rounded mb-1" 
                        mode="dark" 
                    />
                    {/* Exercise sets/reps skeleton */}
                    <Skeleton 
                        className="h-4 w-16 rounded" 
                        mode="dark" 
                    />
                </View>
            </View>
            <View>
                {/* Weight lifter icon skeleton */}
                <Skeleton 
                    className="w-[20px] h-[20px] rounded" 
                    mode="dark" 
                />
            </View>
        </View>
    );
}