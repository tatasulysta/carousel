import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  ImageSourcePropType,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: wWidth, height: wHeight } = Dimensions.get("window");
const ASPECT_RATIO = 3 / 5;
const IMAGE_WIDTH = wWidth * 0.7;
const IMAGE_HEIGHT = wHeight * ASPECT_RATIO;
const DEFAULT_SPACING = 20;

type ImageType = {
  source: ImageSourcePropType;
  offset: SharedValue<number>;
  index: number;
};

function ImageItem(props: ImageType) {
  const { source, offset, index } = props;
  const isExpanded = useSharedValue(false);

  const imageStyle = useAnimatedStyle(() => {
    //SCROLL SCALING
    const scale = interpolate(
      offset.value,
      [index - 1, index, index + 1],
      [1, 1.3, 1],
      Extrapolation.CLAMP,
    );

    // EXPAND
    const height = isExpanded.value
      ? withTiming(wHeight * 0.7)
      : withTiming(IMAGE_HEIGHT);

    const width = isExpanded.value
      ? withTiming(wWidth * 0.9)
      : withTiming(IMAGE_WIDTH);

    return {
      transform: [{ scale }],
      width,
      height,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        isExpanded.value = !isExpanded.value;
      }}
    >
      <View style={styles.imageContainer}>
        <Animated.Image
          source={source}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const ITEMS = [
  {
    id: "e",
    source: require("@/assets/images/image-1.jpg"),
  },
  {
    id: "2",
    source: require("@/assets/images/image-2.jpg"),
  },
  {
    id: "3",
    source: require("@/assets/images/image-3.jpg"),
  },
  {
    id: "4",
    source: require("@/assets/images/image-4.jpg"),
  },
  {
    id: "5",
    source: require("@/assets/images/image-5.jpg"),
  },
];

export default function HomeScreen() {
  const offset = useSharedValue(0);
  const expandedIndex = useSharedValue(-1);

  const setExpandedIndex = (index: number) => {
    expandedIndex.value = expandedIndex.value === index ? -1 : index; // Toggle
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    offset.value = event.contentOffset.x / (IMAGE_WIDTH + DEFAULT_SPACING);
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={ITEMS}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ImageItem source={item.source} offset={offset} index={index} />
        )}
        snapToInterval={IMAGE_WIDTH + DEFAULT_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        style={styles.list}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  listContent: {
    gap: DEFAULT_SPACING,
    paddingRight: DEFAULT_SPACING,
  },
  list: {
    flexGrow: 0,
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    aspectRatio: ASPECT_RATIO,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
