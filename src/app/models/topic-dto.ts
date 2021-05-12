import { Topic } from './topic';
import { Notes } from './notes';

export interface TopicDTO {
    competency: number;
    fav_notes_id: number;
    notes: Notes[];
}