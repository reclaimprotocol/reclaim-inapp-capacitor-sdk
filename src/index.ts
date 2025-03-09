import { type ReclaimVerificationApi, ReclaimVerificationPlatform, ReclaimVerificationPlatformImpl } from './ReclaimVerificationPlatform';
export { ReclaimVerificationPlatform, ReclaimVerificationApi, ReclaimVerificationPlatformImpl } from './ReclaimVerificationPlatform';
export type { ReclaimVerificationApi as ReclaimVerificationApiType, ReclaimResult } from './ReclaimVerificationPlatform';

export class ReclaimVerification {
  public channel: ReclaimVerificationPlatform;

  private static defaultChannel: ReclaimVerificationPlatform | null = null;

  public constructor(channel?: ReclaimVerificationPlatform) {
    if (channel) {
      this.channel = channel;
    } else {
      if (ReclaimVerification.defaultChannel == null) {
        ReclaimVerification.defaultChannel = new ReclaimVerificationPlatformImpl();
      }
      this.channel = ReclaimVerification.defaultChannel;
    }
  }

  public async startVerification(request: ReclaimVerificationApi.Request): Promise<ReclaimVerificationApi.Response> {
    return this.channel.startVerification(request);
  }

  public async startVerificationFromUrl(requestUrl: string): Promise<ReclaimVerificationApi.Response> {
    return this.channel.startVerificationFromUrl(requestUrl);
  }

  public async ping(): Promise<boolean> {
    return this.channel.ping();
  }

  public setOverrides(overrides: ReclaimVerificationApi.OverrideConfig) {
    return this.channel.setOverrides(overrides);
  }

  public clearAllOverrides() {
    return this.channel.clearAllOverrides();
  }
}