export type PartialConfig<T> = Omit<T, 'description' | 'type'>;
