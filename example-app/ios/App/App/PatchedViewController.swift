//
//  PatchedViewController.swift
//  App
//
//  Created by Mushaheed Syed on 08/03/25.
//

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
