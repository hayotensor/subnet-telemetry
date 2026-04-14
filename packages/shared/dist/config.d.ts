/**
 * Shared configuration utility to handle universal settings like Ports.
 * Priority: CLI Arguments > Environment Variables > Defaults
 */
export interface SystemConfig {
    port: number;
    host: string;
}
export declare function getConfig(defaults?: Partial<SystemConfig>): SystemConfig;
