declare module "voxioagent" {
  export function initVoxioAgent(config: {
    apiKey: string;
    position?: {
      bottom?: string;
      right?: string;
      top?: string;
      left?: string;
    };
    floating?: boolean;
    [key: string]: any; // Allow additional properties
  }): Promise<{
    destroy: () => void;
    [key: string]: any;
  }>;
}
