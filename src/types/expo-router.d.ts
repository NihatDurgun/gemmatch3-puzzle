declare module 'expo-router' {
  import * as React from 'react';
  export const Stack: React.ComponentType<{
    screenOptions?: {
      headerShown?: boolean;
      contentStyle?: { backgroundColor?: string };
      [key: string]: any;
    };
    [key: string]: any;
  }>;
  export function useRouter(): any;
  export function useLocalSearchParams(): any;
}
