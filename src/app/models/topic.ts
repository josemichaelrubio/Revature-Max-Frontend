import { Tech } from './tech';

export class Topic {
  id: number;
  tech: Tech;
  name: string;

  constructor(topic: any) {
    this.id = topic.id;
    this.tech = topic.tech;
    this.name = topic.name;
  }
}
