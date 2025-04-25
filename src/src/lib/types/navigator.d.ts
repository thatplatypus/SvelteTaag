// Define the Web Share API types
interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface NavigatorShare {
  share?(data?: ShareData): Promise<void>;
  canShare?(data?: ShareData): boolean;
}

// Add share methods to the Navigator interface
interface Navigator extends NavigatorShare {} 