import { User } from 'entities/User';

export const buildCreateOriginEndpointParams = (user: User) => ({
  Id: `origin-endpoint-user-${user.id}-channel-${user.awsMediaPackageChannelId}`,
  ChannelId: user.awsMediaPackageChannelId,
  Description: user.username,
  StartoverWindowSeconds: 0,
  TimeDelaySeconds: 0,
  ManifestName: 'index',
  Whitelist: [],
  HlsPackage: {
    SegmentDurationSeconds: 2,
    PlaylistWindowSeconds: 6,
    AdMarkers: 'NONE',
    ProgramDateTimeIntervalSeconds: 0,
    UseAudioRenditionGroup: false,
    IncludeIframeOnlyStream: false,
    AdTriggers: [
      'SPLICE_INSERT',
      'PROVIDER_ADVERTISEMENT',
      'DISTRIBUTOR_ADVERTISEMENT',
      'PROVIDER_PLACEMENT_OPPORTUNITY',
      'DISTRIBUTOR_PLACEMENT_OPPORTUNITY',
    ],
    AdsOnDeliveryRestrictions: 'RESTRICTED',
    StreamSelection: {
      StreamOrder: 'ORIGINAL',
    },
  },
  Origination: 'ALLOW',
});
