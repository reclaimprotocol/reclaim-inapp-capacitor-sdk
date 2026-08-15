# Migration

## 0.42.1

### Android

- The bundled `org.reclaimprotocol:inapp_sdk` dependency is now `0.42.1`. If you have pinned or overriden this dependency in your `build.gradle`, update it to `0.42.1`.
- Run an `npx cap sync` and build your android project again.

### iOS

- Make sure if you are using the latest versions of `ReclaimInAppSdk` cocoapod if you have overriden this dependency in your `Podfile`. Latest version on [cocoapods.org is 0.42.1](https://cocoapods.org/pods/ReclaimInAppSdk).
- Run a `pod install --repo-update`. If this fails for reasons related to the `ReclaimInAppSdk`, try running `pod update ReclaimInAppSdk`.
- Refer: https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/README.md#ios-setup

## 0.7.0

### iOS

- Make sure if you are using the latest versions of `ReclaimInAppSdk` cocoapod if you have overriden this dependency in your `Podfile`. Latest version on [cocoapods.org is 0.7.0](https://cocoapods.org/pods/ReclaimInAppSdk).
- Run a `pod install --repo-update`. If this fails for reasons related to the `ReclaimInAppSdk`, try running `pod update ReclaimInAppSdk`.
- Refer: https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/README.md#ios-setup

## 0.6.0

Note: Run an `npx cap sync` after completing migrations.

### Android

#### Update repository URL

- Remove version in `reclaimStorageUrl`
- With this change, repositories in your build.gradle or settings.gradle may look like this:

```diff
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    String flutterStorageUrl = System.env.FLUTTER_STORAGE_BASE_URL ?: "https://storage.googleapis.com"
-   String reclaimStorageUrl = System.env.RECLAIM_STORAGE_BASE_URL ?: "https://reclaim-inapp-sdk.s3.ap-south-1.amazonaws.com/android/0.3.0/repo"
+   String reclaimStorageUrl = System.env.RECLAIM_STORAGE_BASE_URL ?: "https://reclaim-inapp-sdk.s3.ap-south-1.amazonaws.com/android/repo"
    repositories {
        google()
        mavenCentral()
        maven {
            url "$reclaimStorageUrl"
        }
        maven {
            url "$flutterStorageUrl/download.flutter.io"
        }
    }
}
```

- Build your android project again
- Refer: https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/README.md#android-setup

### iOS

- Make sure if you are using the latest versions of `ReclaimInAppSdk` cocoapod if you have overriden this dependency in your `Podfile`. Latest version on [cocoapods.org is 0.6.0](https://cocoapods.org/pods/ReclaimInAppSdk).
- Run a `pod install --repo-update`. If this fails for reasons related to the `ReclaimInAppSdk`, try running `pod update ReclaimInAppSdk`.
- Refer: https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/README.md#ios-setup
