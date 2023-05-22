import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import NlwLogo from "../src/assets/nlw-spacetime-logo.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { api } from "../src/lib/api";

export default function NewMemories() {
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const [previw, setPreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState("");

  async function openImagePicker() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (result.assets[0]) {
        setPreview(result.assets[0].uri);
      }
    } catch (err) {}

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync("token");

    let coverUrl = "";

    if (previw) {
      const uploadFormData = new FormData();

      uploadFormData.append("file", {
        uri: previw,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      coverUrl = uploadResponse.data.fileUrl;
    }

    await api.post(
      "/users",
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/memories");
  }

  return (
    <ScrollView
      className="flex-1 flex-grow px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NlwLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#ffff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? "#9b79ea" : "#9e9ea0"}
            trackColor={{ false: "#767577", true: "#372560" }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          onPress={openImagePicker}
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {previw ? (
            <Image
              source={{ uri: previw }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center  gap-2">
              <Icon name="image" color={"#FFF"} />
              <Text className="font-body text-sm text-gray-200">
                Adiocinar ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50"
          textAlignVertical="top"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity
          onPress={handleCreateMemory}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
          activeOpacity={0.7}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
