import { WebPlugin } from '@capacitor/core';
import type {
  Overrides,
  ReclaimInAppCapacitorSdkPlugin,
  Request,
  Response,
  VerificationOptionsOptional
} from './definitions';

export class ReclaimInAppCapacitorSdkWeb extends WebPlugin implements ReclaimInAppCapacitorSdkPlugin {
  startVerification(_: Request): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  startVerificationFromUrl(_: { value: string }): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  setOverrides(_: Overrides): Promise<void> {
    throw new Error('Method not implemented.');
  }
  clearAllOverrides(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setVerificationOptions(_: VerificationOptionsOptional): Promise<void> {
    throw new Error('Method not implemented.');
  }
  reply(_: { replyId: string, reply: boolean }): void {
    throw new Error('Method not implemented.');
  }
  replyWithString(_: { replyId: string; value: string; }): void {
    throw new Error('Method not implemented.');
  }
  ping(): Promise<{ value: boolean }> {
    return Promise.resolve({ value: true });
  }
}
