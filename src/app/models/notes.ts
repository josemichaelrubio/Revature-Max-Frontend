export interface Notes {
    id: number | null;
    employee: { id: number, name: string };
    votes: number;
    content: string;
}