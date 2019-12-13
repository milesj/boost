export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'type'>;
