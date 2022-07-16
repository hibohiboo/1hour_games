const config = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID as string,
  messagingSenderId: import.meta.env
    .VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
}
export default config
