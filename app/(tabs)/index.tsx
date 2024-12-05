import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  ImageSourcePropType,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";

const { width: wWidth, height: wHeight } = Dimensions.get("window");

const IMAGE_WIDTH = wWidth * 0.7;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.2;
const DEFAULT_SPACING = 20;

const ITEMS = [
  { id: "1", source: require("@/assets/images/image-1.jpg") },
  { id: "2", source: require("@/assets/images/image-2.jpg") },
  { id: "3", source: require("@/assets/images/image-3.jpg") },
  { id: "4", source: require("@/assets/images/image-4.jpg") },
  { id: "5", source: require("@/assets/images/image-5.jpg") },
];

type ImageCardProps = {
  expand: Animated.SharedValue<number>;
  offset: Animated.SharedValue<number>;
  toggleExpand: (idx: number) => void;
  source: ImageSourcePropType;
  index: number;
};

function ImageCard(props: ImageCardProps) {
  const { source, index, offset, toggleExpand, expand } = props;

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      offset.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
    };
  });

  const expandStyle = useAnimatedStyle(() => {
    const isExpand = expand.value === index;
    return {
      width: isExpand ? withTiming(wWidth) : withTiming(IMAGE_WIDTH),
      height: isExpand ? withTiming(wHeight) : withTiming(IMAGE_HEIGHT),
      left: isExpand ? withTiming(0) : withTiming((wWidth - IMAGE_WIDTH) / 2),
      right: isExpand ? withTiming(0) : withTiming((wWidth - IMAGE_WIDTH) / 2),
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const isExpand = expand.value === index;
    return { borderRadius: isExpand ? withTiming(0) : withTiming(12) };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const isExpand = expand.value === index;
    return {
      opacity: withTiming(isExpand ? 1 : 0, { duration: 200 }),
      position: "absolute",
      top: 16,
      right: 16,
    };
  });

  return (
    <TouchableWithoutFeedback onPress={() => toggleExpand(index)}>
      <Animated.View style={[styles.cardContainer, animatedStyle, expandStyle]}>
        <Animated.Image
          source={source}
          style={[styles.cardImage, imageStyle]}
          resizeMode="cover"
        />

        <Animated.View style={[buttonStyle]}>
          <TouchableOpacity onPress={() => toggleExpand(-1)}>
            <Text style={{ fontSize: 22 }}>X</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function HomeScreen() {
  const offset = useSharedValue(0);
  const expand = useSharedValue(-1);

  const onScroll = useAnimatedScrollHandler((event) => {
    offset.value = event.contentOffset.x / (IMAGE_WIDTH + DEFAULT_SPACING);
  });

  const toggleExpand = (index: number) => {
    const scale = interpolate(
      offset.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );

    if (scale >= 0.99) expand.value = expand.value === index ? -1 : index;
  };

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: expand.value > -1 ? 1 : 0,
      zIndex: expand.value > -1 ? 9 : 0,
    };
  });

  return (
    <View style={styles.container}>
      {/* OVERLAYER FOR DETECT SCROLL */}
      <TouchableWithoutFeedback onPress={() => (expand.value = -1)}>
        <Animated.View style={[styles.overlay, overlayStyle]} />
      </TouchableWithoutFeedback>
      <Animated.FlatList
        data={ITEMS}
        horizontal
        renderItem={({ item, index }) => (
          <ImageCard
            source={item.source}
            index={index}
            offset={offset}
            toggleExpand={toggleExpand}
            expand={expand}
          />
        )}
        keyExtractor={(item) => item.id}
        snapToInterval={IMAGE_WIDTH + DEFAULT_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
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
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  },
  carouselContent: {
    gap: DEFAULT_SPACING,
    // paddingHorizontal: DEFAULT_SPACING,
    paddingEnd: wWidth - IMAGE_WIDTH,
  },
  cardContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  overlay: StyleSheet.absoluteFillObject,
});
