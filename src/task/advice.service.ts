import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface Advice {
  slip: {
    id: number;
    advice: string;
  };
}

@Injectable()
export class AdviceService {
  private readonly logger = new Logger(AdviceService.name);
  private readonly adviceApiUrl = 'https://api.adviceslip.com/advice';

  async getRandomAdvice(): Promise<string> {
    try {
      const response = await axios.get<Advice>(this.adviceApiUrl, {
        timeout: 5000,
      });

      return response.data.slip.advice;
    } catch (error) {
      this.logger.error('Failed to fetch advice from API', error);

      const fallbackAdvices = [
        'Believe in yourself and all that you are.',
        'Every task you complete is a step closer to your goals.',
        'Progress, not perfection, is what matters.',
        'You have the power to make today amazing.',
        'Small steps every day lead to big changes.',
        'Your only limit is your mind.',
        'Great things never come from comfort zones.',
        'The only way to do great work is to love what you do.',
      ];

      const randomIndex = Math.floor(Math.random() * fallbackAdvices.length);
      return fallbackAdvices[randomIndex];
    }
  }
}
