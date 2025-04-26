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

interface Navigator extends NavigatorShare {} 