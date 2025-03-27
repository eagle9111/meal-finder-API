import {  Text, View, ActivityIndicator, Image, TextInput, TouchableOpacity, ScrollView, Linking } from "react-native";
import { useState } from "react";
import { MagnifyingGlassIcon, BookOpenIcon, LinkIcon } from "react-native-heroicons/outline";

export default function Index() {
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFood, setSearchFood] = useState("");
  const [error, setError] = useState(null);

  const FetchFood = async () => {
    if (!searchFood.trim()) {
      setError("Please enter a search term");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
     `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${searchFood}`

      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch food data");
      }

      if (!data.meals || data.meals.length === 0) {
        throw new Error("No meals found");
      }

      setFood(data.meals);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    FetchFood();
  };

  // Function to extract ingredients and measurements
  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
        ingredients.push({
          ingredient: meal[`strIngredient${i}`],
          measure: meal[`strMeasure${i}`] || ""
        });
      }
    }
    return ingredients;
  };

  const openYoutube = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const openSource = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-800 mb-1">Meal Finder</Text>
        <Text className="text-gray-500">Discover delicious recipes</Text>
        <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 max-w-xs">
        <Text className="text-blue-800 text-sm text-center">
          <Text className="font-semibold">Tip: </Text>
          Try these valid meal IDs:{" "}
          <Text className="font-bold text-blue-600">52772, 52802, 52844, 52977, 53013</Text>
        </Text>
      </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 flex-row items-center bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2">
          <MagnifyingGlassIcon size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search for meals..."
            value={searchFood}
            onChangeText={setSearchFood}
            className="ml-2 flex-1 text-gray-700"
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity
          onPress={handleSearch}
          className="ml-2 bg-blue-500 rounded-lg px-4 py-2 shadow-sm"
          disabled={loading}
        >
          <Text className="text-white font-medium">Search</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View className="mb-4 p-3 bg-red-100 rounded-lg">
          <Text className="text-red-700">{error}</Text>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Searching for meals...</Text>
        </View>
      )}

      {/* Results */}
      {!loading && food.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false} className="mb-20">
          <Text className="text-xl font-semibold text-gray-800 mb-3">Results</Text>
          {food.map((item) => {
            const ingredients = getIngredients(item);
            
            return (
              <View key={item.idMeal} className="bg-white rounded-xl shadow-sm p-4 mb-6">
                {/* Meal Image */}
                <Image 
                  source={{ uri: item.strMealThumb }} 
                  className="w-full h-48 rounded-lg mb-3" 
                  resizeMode="cover"
                />
                
                {/* Meal Title */}
                <Text className="text-2xl font-bold text-gray-800 mb-2">{item.strMeal}</Text>
                
                {/* Category and Area */}
                <View className="flex-row items-center mb-4">
                  <Text className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
                    {item.strCategory}
                  </Text>
                  {item.strArea && (
                    <Text className="text-gray-500 bg-gray-50 px-3 py-1 rounded-full text-sm font-medium ml-2">
                      {item.strArea}
                    </Text>
                  )}
                </View>
                
                {/* Ingredients Section */}
                <View className="mb-4">
                  <Text className="text-lg font-semibold text-gray-800 mb-2">Ingredients</Text>
                  <View className="flex-row flex-wrap">
                    {ingredients.map((ing, index) => (
                      <View key={index} className="bg-gray-50 rounded-lg px-3 py-2 mr-2 mb-2">
                        <Text className="text-gray-700 text-sm">
                          {ing.measure} {ing.ingredient}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                {/* Instructions Section */}
                <View className="mb-4">
                  <Text className="text-lg font-semibold text-gray-800 mb-2">Instructions</Text>
                  <Text className="text-gray-600 text-base">{item.strInstructions}</Text>
                </View>
                
                {/* Video and Source Links */}
                <View className="flex-row justify-between">
                  {item.strYoutube && (
                    <TouchableOpacity 
                      onPress={() => openYoutube(item.strYoutube)}
                      className="flex-row items-center bg-red-100 px-3 py-2 rounded-lg"
                    >
                      <BookOpenIcon size={18} color="#DC2626" />
                      <Text className="text-red-600 ml-2">Watch Video</Text>
                    </TouchableOpacity>
                  )}
                  
                  {item.strSource && (
                    <TouchableOpacity 
                      onPress={() => openSource(item.strSource)}
                      className="flex-row items-center bg-blue-100 px-3 py-2 rounded-lg"
                    >
                      <LinkIcon size={18} color="#2563EB" />
                      <Text className="text-blue-600 ml-2">View Source</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Empty State */}
      {!loading && food.length === 0 && !error && (
        <View className="flex-1 justify-center items-center">
          <Image 
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3723/3723725.png" }} 
            className="w-32 h-32 opacity-50 mb-4"
          />
          <Text className="text-gray-500 text-lg">Search for delicious meals</Text>
        </View>
      )}
    </View>
  );
}