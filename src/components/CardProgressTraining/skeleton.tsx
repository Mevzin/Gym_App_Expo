import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

export default function CardProgressTrainingSkeleton() {
    return (
        <View className="w-[95%] h-32 my-6 px-5 rounded-xl justify-center" style={{backgroundColor: '#1E1E1E'}}>
            <View className="flex-row justify-between mb-5">
                <View>
                    {/* Day title skeleton */}
                    <Skeleton 
                        className="h-6 w-48 rounded mb-2" 
                        mode="dark" 
                    />
                    {/* Exercise count and time skeleton */}
                    <Skeleton 
                        className="h-4 w-36 rounded" 
                        mode="dark" 
                    />
                </View>

                <View className="items-end">
                    {/* Progress counter skeleton */}
                    <Skeleton 
                        className="h-8 w-16 rounded mb-1" 
                        mode="dark" 
                    />
                    {/* "completed" text skeleton */}
                    <Skeleton 
                        className="h-3 w-20 rounded" 
                        mode="dark" 
                    />
                </View>
            </View>
            
            {/* Progress bar skeleton */}
            <Skeleton 
                className="h-[10px] w-[340px] rounded-full" 
                mode="dark" 
            />
        </View>
    );
}