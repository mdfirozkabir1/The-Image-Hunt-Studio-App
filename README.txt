IMAGE HUNT - ANDROID APP (APK) BUILD

Site files ache "www" folder-e. Eta Capacitor diye Android app-e wrap kora.

OPTION A - GitHub (computer-e kichu install lagbe na)
1. Ei folder-ta notun GitHub repo-te upload koro (branch: main).
2. Repo > Actions > "Build APK" > Run workflow.
3. 3-5 minute por run-er niche Artifacts theke "image-hunt-apk" download koro.
4. Zip khule app-debug.apk phone-e pathao, install koro
   (Settings-e "Install unknown apps" allow korte hobe).

OPTION B - Nijer computer-e
Lagbe: Node 20+, JDK 21, Android Studio (Android SDK).
  npm install
  npm run setup
  npm run apk
APK pabe: android/app/build/outputs/apk/debug/app-debug.apk

Site-er kichu change korle "www" folder-e kore, tarpor:
  npx cap sync android   (ar abar npm run apk)

NOTE: Eta debug APK, nijer phone-e use-er jonno thik ache.
Google Play-te dite hole signed release build (AAB) lagbe.
