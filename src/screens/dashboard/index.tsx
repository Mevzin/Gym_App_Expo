import { SafeAreaView, ScrollView, View } from "react-native"
import CardProfile from "../../components/CardProfile"
import CardHero from "../../components/CardHero"
import CardQuickStart from "../../components/CardQuickStart"
import FeatureFeed from "../../components/FeatureFeed"


const Dashboard = () => {
    return (
        <SafeAreaView className="flex-1 bg-dark ">
            <ScrollView
                className="bg-primary"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center">
                    <CardProfile />
                    <CardHero />
                    <CardQuickStart />
                    <FeatureFeed />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Dashboard