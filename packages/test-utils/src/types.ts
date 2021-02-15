export type DirectoryContent = string | null;

export type DirectoryJSON = Record<string, DirectoryContent>;

export type DirectoryStructure = DirectoryJSON | ((root: string) => DirectoryJSON);
