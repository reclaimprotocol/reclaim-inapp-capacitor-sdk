# @reclaimprotocol/inapp-capacitor-sdk

![NPM Version](https://img.shields.io/npm/v/%40reclaimprotocol%2Finapp-capacitor-sdk)

This SDK allows you to integrate Reclaim's in-app verification process into your Capacitor application.

[Refer Reclaim Protocol's official documentation for Capacitor SDK](https://docs.reclaimprotocol.org/inapp-sdks/capacitor)

## Prerequisites

- A [Reclaim account](https://dev.reclaimprotocol.org/explore) where you've created an app and have the app id, app secret.
- A provider id that you've added to your app in [Reclaim Devtools](https://dev.reclaimprotocol.org/explore).

## Example

- See the [Reclaim Example - Capacitor](https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/tree/main/example-app/README.md) for a complete example of how to use the SDK in a Capacitor application.

## Install

```bash
npm install @reclaimprotocol/inapp-capacitor-sdk
npx cap sync
```

## Setup

### Android Setup

Add the following to your `android/app/src/main/AndroidManifest.xml` file under the `<application>` tag:

```xml
      <activity
        android:name="org.reclaimprotocol.inapp_sdk.ReclaimActivity"
        android:theme="@style/Theme.ReclaimInAppSdk.LaunchTheme"
        android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
        android:hardwareAccelerated="true"
        android:windowSoftInputMode="adjustResize"
        />
```

add the following to the end of settings.gradle:

```groovy
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    String flutterStorageUrl = System.env.FLUTTER_STORAGE_BASE_URL ?: "https://storage.googleapis.com"
    String reclaimStorageUrl = System.env.RECLAIM_STORAGE_BASE_URL ?: "https://reclaim-inapp-sdk.s3.ap-south-1.amazonaws.com/android/0.3.0/repo"
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

(Ignore if already added in settings.gradle from above)
or alternatively add the following repositories to the relevant repositories block:

```groovy
String flutterStorageUrl = System.env.FLUTTER_STORAGE_BASE_URL ?: "https://storage.googleapis.com"
String reclaimStorageUrl = System.env.RECLAIM_STORAGE_BASE_URL ?: "https://reclaim-inapp-sdk.s3.ap-south-1.amazonaws.com/android/0.3.0/repo"
maven {
    url "$reclaimStorageUrl"
}
maven {
    url "$flutterStorageUrl/download.flutter.io"
}
```

Some projects may require you to add the repositories to the root `build.gradle` file or your app-level `build.gradle` file's allprojects section.

### iOS Setup

1. Make sure to define a global platform for your project in your `Podfile` with version 13.0 or higher.

```
platform :ios, '13.0' # or platform :ios, min_ios_version_supported
```

Ignore if you already have this declaration in your `Podfile`.

2. Add the following to your `Podfile` to override SDK dependency:

- This step is only required when facing issues with the resolved pod dependency. 
- You can override the version of dependency when you wish to use a specific version of the SDK.
- You can add a declaration in your `Podfile` to install the SDK from cocoapods, or from a specific git tag, head, commit, or branch.

##### From cocoapods (recommended)

```ruby
# Cocoapods is the recommended way to install the SDK.
pod 'ReclaimInAppSdk', '~> 0.3.0'
```

##### From a specific tag

```ruby
pod 'ReclaimInAppSdk', :git => 'https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk.git', :tag => '0.3.0'
```

##### From git HEAD

```ruby
pod 'ReclaimInAppSdk', :git => 'https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk.git'
```

##### From a specific commit

```ruby
pod 'ReclaimInAppSdk', :git => 'https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk.git', :commit => 'eeb5a5484a5927217065e5c988fab8201cb2db2e'
```

##### From a specific branch

```ruby
pod 'ReclaimInAppSdk', :git => 'https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk.git', :branch => 'main'
```

- After adding the dependency, your podfile may look like this:

```ruby
platform :ios, '13.0'

# ... some podfile content (removed for brevity)

target 'App' do
  capacitor_pods
  # Add your Pods here
  # This is the line that you may need to add in your podfile.
  pod 'ReclaimInAppSdk', '~> 0.3.0'
end
  # ... rest of the podfile. (removed for brevity)
```

3. Run `pod install` inside the `ios/` directory of your project.

```sh
cd ios/
pod install
```

#### Fixing runtime routing issue on iOS

This library uses a golang static library. Use of this has raised an issue in capacitor's swift router, causing the app to crash on startup with error message: **Error: The file "public" couldn't be opened.**

<img src="https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/screenshots/ios_crash.png?raw=true" alt="iOS crash" width="500">

There are open issues on both capacitor and golang's issue tracker to dicuss this problem:
* https://github.com/ionic-team/capacitor/issues/7844
* https://github.com/golang/go/issues/58225

A workaround is available to fix this issue and requires a custom view controller to be used in ios.

1. First, create a PatchedViewController.swift file by [opening Xcode](https://capacitorjs.com/docs/ios#opening-the-ios-project), right-clicking on the **App** group (under the App target), selecting **New File from Template** from the context menu, choosing **Cocoa Touch Class** in the window, set the **Subclass of:** to UIViewController in the next screen, and save the file.

<img src="https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/screenshots/1.png?raw=true" alt="New File from Template in Xcode" width="500">
<img src="https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/screenshots/2.png?raw=true" alt="Selecting a Cocoa Touch Class" width="500">
<img src="https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/screenshots/3.png?raw=true" alt="Creating a new Swift file" width="500">

2. Next, select the `Main.storyboard` file in the Project Navigator, select the **Bridge View Controller** in the **Bridge View Controller Scene**, select the **Identity Inspector** on the right, and change the name of the custom class to `PatchedViewController`.

<img src="https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/screenshots/4.png?raw=true" alt="Opening Identity Inspector for Main.storyboard" width="500">
<img src="https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/screenshots/5.png?raw=true" alt="Selecting PatchedViewController" width="500">

3. Finally, select the `PatchedViewController.swift` file in the Project Navigator and edit it to paste the following code:

```swift
import UIKit
import Capacitor

public struct PatchedRouter: Router {
    public init() {}
    public var basePath: String = ""
    public func route(for path: String) -> String {
        // FIX: Never pass an empty string here
        let pathUrl = URL(fileURLWithPath: path.isEmpty ? "/" : path)

        // If there's no path extension it also means the path is empty or a SPA route
        if pathUrl.pathExtension.isEmpty {
            return basePath + "/index.html"
        }

        return basePath + path
    }
}

class PatchedViewController: CAPBridgeViewController {
    // Passing our own router to fix the issue about go chdir on ios init issue
    override open func router() -> any Router {
        PatchedRouter()
    }
}
```

#### Fixing performance issues on IOS physical devices

Your app performance will be severely impacted when you run debug executable on a physical device. Fixing this requires a simple change in your Xcode project xcscheme.

#### Method 1: Update Environment Variables for XCScheme (Recommended) 
1. Open your iOS project (*.xcworkspace) in Xcode.
2. Click on the project target.
3. Click on the **Scheme** dropdown.

<img src="https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk/blob/83f23570a47828d011b713679852053acdba89c1/Screenshots/Install/10.png?raw=true" alt="Edit current xcscheme in Xcode" width="500">

4. Click on the **Edit Scheme** button.
5. Click on the **Run** tab.
6. Click on the **Arguments** tab and check the **Environment Variables** section.

<img src="https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk/blob/83f23570a47828d011b713679852053acdba89c1/Screenshots/Install/12.png?raw=true" alt="Enable Debug executable in Xcode" width="500">

7. Add the following environment variable:
    - Key: `GODEBUG`
    - Value: `asyncpreemptoff=1`
8. Click on the **Close** button in the dialog and build the project.
9. Run the app on a physical device.

#### Method 2: Disable "Debug executable"

This method is **not recommended** but could be useful if you don't want to add environment variables to the xcscheme.

1. Open your iOS project (*.xcworkspace) in Xcode.
2. Click on the project target.
3. Click on the **Scheme** dropdown.

<img src="https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk/blob/83f23570a47828d011b713679852053acdba89c1/Screenshots/Install/10.png?raw=true" alt="Edit current xcscheme in Xcode" width="500">

4. Click on the **Edit Scheme** button.
5. Click on the **Run** tab.
6. Uncheck the **Debug executable** checkbox.

<img src="https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk/blob/83f23570a47828d011b713679852053acdba89c1/Screenshots/Install/11.png?raw=true" alt="Enable Debug executable in Xcode" width="500">

## Usage

To use Reclaim InApp Sdk in your project, follow these steps:

1. Import the `@reclaimprotocol/inapp-capacitor-sdk` package in your project file.

```js
import { ReclaimVerification } from '@reclaimprotocol/inapp-capacitor-sdk';
```

2. Initialize the `ReclaimVerification` class to create an instance.

```js
const reclaimVerification = new ReclaimVerification();
```

3. Start the verification flow by providing the app id, secret and provider id.

```js
const verificationResult = await reclaimVerification.startVerification({
    appId: config.RECLAIM_APP_ID ?? '',
    secret: config.RECLAIM_APP_SECRET ?? '',
    providerId: providerId,
});
```

The returned result is a [ReclaimVerification.Response] object. This object contains a response that has proofs, exception, and the sessionId if the verification is successful.

### Exception Handling

If the verification ends with an exception, the exception is thrown as a [ReclaimVerification.ReclaimVerificationException] object.

Following is an example of how to handle the exception using [error.type]:

```js
try {
  // ... start verification
} catch (error) {
  if (error instanceof ReclaimVerification.ReclaimVerificationException) {
    switch (error.type) {
      case ReclaimVerification.ExceptionType.Cancelled:
        Snackbar.show({
          text: 'Verification cancelled',
          duration: Snackbar.LENGTH_LONG,
        });
        break;
      case ReclaimVerification.ExceptionType.Dismissed:
        Snackbar.show({
          text: 'Verification dismissed',
          duration: Snackbar.LENGTH_LONG,
        });
        break;
      case ReclaimVerification.ExceptionType.SessionExpired:
        Snackbar.show({
          text: 'Verification session expired',
          duration: Snackbar.LENGTH_LONG,
        });
        break;
      case ReclaimVerification.ExceptionType.Failed:
      default:
        Snackbar.show({
          text: 'Verification failed',
          duration: Snackbar.LENGTH_LONG,
        });
    }
  } else {
    Snackbar.show({
      text: error instanceof Error ? error.message : 'An unknown verification error occurred',
      duration: Snackbar.LENGTH_LONG,
    });
  }
}
```

This error also contains `sessionId`, `reason`, and `innerError` that can be used to get more details about the occurred error.

```js
error.sessionId
error.reason
error.innerError
```

## Advanced Usage

### Overriding SDK Config

```js
// Advanced Usage: Use ReclaimVerification.setOverrides for overriding sdk
reclaimVerification.setOverrides({
  appInfo: {
    appName: "Overriden Example",
    appImageUrl: "https://placehold.co/400x400/png"
  }
  // .. other overrides
})
```

Note: Overriding again will clear previous overrides

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
