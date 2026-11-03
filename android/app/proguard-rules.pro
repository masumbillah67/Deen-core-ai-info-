# ==============================================================================
# ProGuard & R8 Configuration for Capacitor Android Application
# ==============================================================================

# Preserve line numbers and source file names for readable crash stack traces
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Keep native (JNI) method names and classes
-keepclasseswithmembernames class * {
    native <methods>;
}

# ------------------------------------------------------------------------------
# WebView & JavaScript Interfaces (CRITICAL FOR CAPACITOR)
# ------------------------------------------------------------------------------
# Preserve JavaScript interface methods so that WebView can invoke native methods
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# AndroidX WebKit
-keep class androidx.webkit.** { *; }
-dontwarn androidx.webkit.**

# ------------------------------------------------------------------------------
# Capacitor Core & Plugins
# ------------------------------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }

# Keep Plugin annotations and reflectively accessed methods
-keep @interface com.getcapacitor.annotation.CapacitorPlugin
-keep @interface com.getcapacitor.annotation.Permission
-keep @interface com.getcapacitor.annotation.ActivityCallback
-keep @interface com.getcapacitor.PluginMethod

-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
    public <fields>;
}

-keepclassmembers class com.getcapacitor.BridgeActivity {
    public <methods>;
}

# ------------------------------------------------------------------------------
# Cordova Compatibility (capacitor-cordova-android-plugins)
# ------------------------------------------------------------------------------
-keep class org.apache.cordova.** { *; }
-keep interface org.apache.cordova.** { *; }
-keep class * extends org.apache.cordova.CordovaPlugin {
    public <methods>;
}

# ------------------------------------------------------------------------------
# Android Support / AndroidX / Material
# ------------------------------------------------------------------------------
-dontwarn androidx.**
-keep class androidx.core.app.CoreComponentFactory { *; }
-keep class androidx.core.content.FileProvider { *; }

# Google Play Services / Firebase optional warnings
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
