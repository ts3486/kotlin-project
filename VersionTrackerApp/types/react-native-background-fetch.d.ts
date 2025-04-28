declare module 'react-native-background-fetch' {
  interface BackgroundFetchConfig {
    minimumFetchInterval?: number;
    stopOnTerminate?: boolean;
    enableHeadless?: boolean;
    startOnBoot?: boolean;
  }

  type BackgroundFetchCallback = (taskId: string) => void;

  const BackgroundFetch: {
    configure: (config: BackgroundFetchConfig, callback: BackgroundFetchCallback) => Promise<void>;
    finish: (taskId: string) => void;
  };

  export default BackgroundFetch;
} 