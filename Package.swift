// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ReclaimprotocolInappCapacitorSdk",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "ReclaimprotocolInappCapacitorSdk",
            targets: ["ReclaimInAppCapacitorSdkPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0"),
        .package(url: "https://github.com/reclaimprotocol/reclaim-inapp-ios-sdk.git", from: "0.3.0")
    ],
    targets: [
        .target(
            name: "ReclaimInAppCapacitorSdkPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "ReclaimInAppSdk", package: "reclaim-inapp-ios-sdk")
            ],
            path: "ios/Sources/ReclaimInAppCapacitorSdkPlugin"),
        .testTarget(
            name: "ReclaimInAppCapacitorSdkPluginTests",
            dependencies: ["ReclaimInAppCapacitorSdkPlugin"],
            path: "ios/Tests/ReclaimInAppCapacitorSdkPluginTests")
    ]
)