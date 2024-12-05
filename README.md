# Carousel 👋

Preview
![](https://github.com/tatasulysta/carousel/blob/main/demo.gif)<br/>
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Note
This application was primarily developed and tested using Android emulator to validate its core functionality and behavior. Although the testing environment was Android-specific, the development process focused on ensuring responsiveness and adaptability across different screen sizes and resolution. To achieve this, the application were designed using relative dimensions derived from the device's screen size, such as percentages of the screen width and height.
## Process

Using the react-native-reanimated library to optimized the feature by using:

- useSharedValue to manage animation states for 2 specific state which is offset (track down scroll offset) and expand (to manage expand state).
- interpolate to calculate scale transformations of card
- useAnimatedStyle to compute scale, width, height, and etc.
- withTiming to add smooth transition
  with useSharedValue and useAnimatedStyle efficiently avoid unecessary re-renders of the component

Issue encountered
While most of the process goes smoothly there are issues encountered during the development:

- Padding horizontal<br/>
  issue: The last item in the carousel was not fully visible due to the paddingHorizontal.<br/>
  - Replaced paddingHorizontal with paddingEnd to ensure proper spacing while preventing clipping the last item.
  - Adjusted the left and right properties in the expandStyle animation to ensure these changes and the expanded card aligns correctly.
- Unwanted expansion of the non-centered card <br/>
  issue: non-centered card can be expanded if pressed <br/>
  solve:

  - Calculated card scale value using the interpolate function.<br/>
  - Verified the card scale is greater than 0.99 before allowing it to expand, to ensure only the focused card can be expand.

- Avoid scrolling on expand state <br/>
  issue: User can scroll while on of the card is on expand state <br/>
  solve:<br/>
  - By adding an overlay layer, we ensure that user interactions outside the expanded card are detected, allowing the expansion to close automatically when the screen is tapped. This approach simplifies the logic by delegating the collapse functionality to the overlay's press handler.
  - The current close button is included purely for UX purposes, providing indication of a close action, but it does not have an actual press handler in the implementaion. The overlay takes full responsibility for handling the collapse functionality.
