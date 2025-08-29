import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';
import CardExerciseLargeSkeleton from '../CardExerciseLarge/skeleton';

export default function ExercisesListSkeleton() {
    return (
        <View className="w-[95%]">
            {/* Title skeleton */}
            <Skeleton 
                className="h-7 w-48 rounded mb-4" 
                mode="dark" 
            />

            {/* Exercise list skeletons - showing 5 exercise skeletons */}
            <CardExerciseLargeSkeleton />
            <CardExerciseLargeSkeleton />
            <CardExerciseLargeSkeleton />
            <CardExerciseLargeSkeleton />
            <CardExerciseLargeSkeleton />
        </View>
    );
}