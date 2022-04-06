import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
  Date: any;
  DateTime: any;
  EventData: any;
};






export type Query = {
  __typename?: 'Query';
  users: Array<UserType>;
  user: UserType;
  nocCodes: Array<OperatorType>;
  operators: OperatorsPage;
  operator?: Maybe<OperatorType>;
  /** Get events list. */
  events: EventsPage;
  /**
   * Get event stats, get the total number of events
   * broken down per day for a given date range.
   */
  eventStats: Array<EventStatsType>;
  /** Get user invitation details for a given key. */
  invitation?: Maybe<InvitationType>;
  /** Resolve all user roles configured in the system. */
  roles: Array<RoleType>;
  /** Resolve all alerts configured for a system. */
  userAlerts: Array<AlertType>;
  /** Resolve a single user alert by id. */
  userAlert?: Maybe<AlertType>;
  /** Resolve an on-time performance query */
  onTimePerformance: OnTimePerformanceType;
  /** Get meta-data about a service. */
  serviceInfo: ServiceInfoType;
  /** Resolve service pattern data */
  servicePatternsInfo: Array<Maybe<ServicePatternType>>;
  /** Resolve transit model data. */
  transitModel?: Maybe<TransitModelType>;
  /** Real-time performance metrics. */
  realTimeMetrics: OnTimePerformanceType;
  /** Namespace for GpsFeed queries. */
  gpsFeed: GpsFeedNamespace;
  /** Resolve corridor queries. */
  corridor: CorridorNamespace;
  /** Namespace for VehicleReplay queries. */
  vehicleReplay: VehicleReplayNamespace;
  /** Resolve headway metrics */
  headwayMetrics: HeadwayMetricsType;
};


export type QueryOperatorsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
  filterBy?: Maybe<OperatorFilterType>;
  sortBy?: Maybe<OperatorSortType>;
};


export type QueryOperatorArgs = {
  nocCode: Scalars['String'];
};


export type QueryEventsArgs = {
  nocCode: Scalars['String'];
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
};


export type QueryEventStatsArgs = {
  nocCode: Scalars['String'];
  start: Scalars['Date'];
  end: Scalars['Date'];
};


export type QueryInvitationArgs = {
  key?: Maybe<Scalars['String']>;
};


export type QueryUserAlertArgs = {
  alertId?: Maybe<Scalars['String']>;
};


export type QueryServiceInfoArgs = {
  serviceId: Scalars['String'];
};


export type QueryServicePatternsInfoArgs = {
  servicePatternIds?: Maybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponseType;
  logout: Scalars['Boolean'];
  /** Invite a user to signup to the system. */
  inviteUser: InvitationResponseType;
  /** Adds a user to the system when user signs up by following the invitation link. */
  signUp: SignUpResponseType;
  /**
   * Initiate a reset password request. This sends an email to the user
   * to reset the password.
   */
  requestResetPassword: MutationResponseType;
  /** Check if the reset password token is valid. */
  verifyResetPasswordToken?: Maybe<Scalars['Boolean']>;
  /**
   * Resets users password once the user follows the reset password link
   * sent to his or her mailbox.
   */
  resetPassword: MutationResponseType;
  /** Update a user. */
  updateUser: UserUpdateResponseType;
  /** Delete a user. */
  deleteUser: MutationResponseType;
  /** Create an user alert. */
  addUserAlert: MutationResponseType;
  /** Edit an user alert. */
  updateUserAlert: MutationResponseType;
  /** Delete an user alert. */
  deleteUserAlert: MutationResponseType;
  /** Create a corridor. */
  createCorridor: MutationResponseType;
  /** Delete a corridor. */
  deleteCorridor: MutationResponseType;
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationInviteUserArgs = {
  payload: InvitationInput;
};


export type MutationSignUpArgs = {
  payload: SignUpInput;
};


export type MutationRequestResetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationVerifyResetPasswordTokenArgs = {
  uid: Scalars['String'];
  token: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  uid: Scalars['String'];
  token: Scalars['String'];
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  username: Scalars['String'];
  payload: UserInput;
};


export type MutationDeleteUserArgs = {
  username: Scalars['String'];
};


export type MutationAddUserAlertArgs = {
  payload: AlertInputType;
};


export type MutationUpdateUserAlertArgs = {
  alertId: Scalars['String'];
  payload: AlertInputType;
};


export type MutationDeleteUserAlertArgs = {
  alertId: Scalars['String'];
};


export type MutationCreateCorridorArgs = {
  payload: CorridorInputType;
};


export type MutationDeleteCorridorArgs = {
  corridorId: Scalars['Int'];
};

export enum SortOrderEnum {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  totalCount: Scalars['Int'];
  next?: Maybe<Scalars['Int']>;
};

export type MutationResponseType = {
  __typename?: 'MutationResponseType';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type DateTimeRangeInput = {
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
};

/** This input object is used to refer to related objects like foreign keys. */
export type ObjectReferenceType = {
  id: Scalars['String'];
};

export type VehicleStatsType = {
  __typename?: 'VehicleStatsType';
  timestamp?: Maybe<Scalars['DateTime']>;
  actual?: Maybe<Scalars['Int']>;
  expected?: Maybe<Scalars['Int']>;
};

export type FeedMonitoringType = {
  __typename?: 'FeedMonitoringType';
  feedStatus: Scalars['Boolean'];
  /** This is percentage of availability of the feed in the last 24 hours. */
  availability?: Maybe<Scalars['Float']>;
  /** If the feed status is Active, then when was it last down. */
  lastOutage?: Maybe<Scalars['DateTime']>;
  /** If the feed status is Down, then since when was it unavailable. */
  unavailableSince?: Maybe<Scalars['DateTime']>;
  /** Feed monitoring vehicles stats - over last 24 hours. */
  liveStats: LiveStatsType;
  /** Feed monitoring vehicle stats - Historical feed stats for a given day. */
  historicalStats: HistoricalStatsType;
  /** Feed monitoring vehicle stats over a custom time range. */
  vehicleStats: Array<VehicleStatsType>;
};


export type FeedMonitoringTypeHistoricalStatsArgs = {
  date: Scalars['Date'];
};


export type FeedMonitoringTypeVehicleStatsArgs = {
  granularity: Granularity;
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
};

export type LiveStatsType = {
  __typename?: 'LiveStatsType';
  /** Number  of vehicles running today. */
  currentVehicles?: Maybe<Scalars['Int']>;
  /** Number of expected vehicles to be running today. */
  expectedVehicles?: Maybe<Scalars['Int']>;
  updateFrequency?: Maybe<Scalars['Int']>;
  /** Number of warning in the feed for today. */
  feedAlerts?: Maybe<Scalars['Int']>;
  /** Number of errors in the feed for today. */
  feedErrors?: Maybe<Scalars['Int']>;
  /** Hourly vehicle counts for today. */
  last24Hours: Array<Maybe<VehicleStatsType>>;
  /** Vehicle counts per minute for the last 20 minutes. */
  last20Minutes: Array<Maybe<VehicleStatsType>>;
};

export type HistoricalStatsType = {
  __typename?: 'HistoricalStatsType';
  availability?: Maybe<Scalars['Float']>;
  compliance?: Maybe<Scalars['Float']>;
  updateFrequency?: Maybe<Scalars['Int']>;
  vehicleStats: Array<Maybe<VehicleStatsType>>;
};

export enum Granularity {
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Month = 'month'
}

export enum FeedStatusEnum {
  Up = 'UP',
  Down = 'DOWN'
}

export type TransitModelType = {
  __typename?: 'TransitModelType';
  /** Transit data to fetch lines for an operator. */
  lines: PaginatedLineType;
};


export type TransitModelTypeLinesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
  filterBy?: Maybe<LineFilterType>;
};

export type LineFilterType = {
  /** Filter by a set of line ids. */
  lineIds?: Maybe<Array<Scalars['String']>>;
};

export type PaginatedLineType = {
  __typename?: 'PaginatedLineType';
  /** Paginated type for a list of lines. */
  pageInfo?: Maybe<PageInfo>;
  items?: Maybe<Array<LineType>>;
};

export type LineType = {
  __typename?: 'LineType';
  /** Line id's for list of operators. */
  lineId: Scalars['String'];
  lineNumber: Scalars['String'];
  lineName: Scalars['String'];
  servicePatterns: Array<Maybe<ServicePatternType>>;
  onTimePerformance: Array<Maybe<OnTimePerformanceType>>;
};

/** Represents stops along a service pattern. */
export type StopType = {
  __typename?: 'StopType';
  stopId: Scalars['String'];
  stopName: Scalars['String'];
  lon: Scalars['Float'];
  lat: Scalars['Float'];
};

/** Represents service patterns and stops along a service. */
export type ServicePatternType = {
  __typename?: 'ServicePatternType';
  servicePatternId: Scalars['String'];
  name: Scalars['String'];
  stops: Array<Maybe<StopType>>;
};

export type OperatorsPage = {
  __typename?: 'OperatorsPage';
  pageInfo?: Maybe<PageInfo>;
  items: Array<Maybe<OperatorType>>;
};

export type OperatorType = {
  __typename?: 'OperatorType';
  name?: Maybe<Scalars['String']>;
  nocCode: Scalars['String'];
  operatorId: Scalars['String'];
  feedMonitoring: FeedMonitoringType;
  transitModel: TransitModelType;
};

export type OperatorFilterType = {
  /** Filter by operator name, does a exact search. */
  name?: Maybe<Scalars['String']>;
  /** Filter by operator name containing the search term. */
  name__icontains?: Maybe<Scalars['String']>;
  /** Filter by feed status. */
  feedStatus?: Maybe<FeedStatusEnum>;
  /** Filter by a set of noc codes. */
  nocCodes?: Maybe<Array<Scalars['String']>>;
};

export type OperatorSortType = {
  order?: Maybe<SortOrderEnum>;
  field?: Maybe<OperatorSortEnum>;
};

export enum OperatorSortEnum {
  FeedAvailability = 'feed_availability'
}

export type ServiceInfoType = {
  __typename?: 'ServiceInfoType';
  serviceId: Scalars['String'];
  serviceName: Scalars['String'];
  serviceNumber: Scalars['String'];
};

export type OperatorInfoType = {
  __typename?: 'OperatorInfoType';
  /** Information about an operator. */
  operatorId: Scalars['String'];
  operatorName: Scalars['String'];
  nocCode: Scalars['String'];
};

export type GpsPointType = {
  __typename?: 'GpsPointType';
  /** Represents a GPS location */
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

/** Represents information about stop locality */
export type LocalityType = {
  __typename?: 'LocalityType';
  localityId: Scalars['String'];
  localityName: Scalars['String'];
  localityAreaName: Scalars['String'];
  localityAreaId: Scalars['String'];
};

/** Represents information about stops. */
export type StopInfoType = {
  __typename?: 'StopInfoType';
  stopId: Scalars['String'];
  stopName: Scalars['String'];
  stopLocation: GpsPointType;
  stopLocality: LocalityType;
};

export type UserType = {
  __typename?: 'UserType';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  organisation?: Maybe<OrganisationType>;
  roles: Array<RoleType>;
};

export type OrganisationType = {
  __typename?: 'OrganisationType';
  id: Scalars['String'];
  name: Scalars['String'];
  operators?: Maybe<Array<OperatorType>>;
};

export type InvitationType = {
  __typename?: 'InvitationType';
  email: Scalars['String'];
  accepted: Scalars['Boolean'];
  organisation?: Maybe<OrganisationType>;
  role?: Maybe<RoleType>;
};

export enum ScopeEnum {
  System = 'system',
  Organisation = 'organisation'
}

export type RoleType = {
  __typename?: 'RoleType';
  id: Scalars['String'];
  name: Scalars['String'];
  scope: ScopeEnum;
};

export type LoginResponseType = {
  __typename?: 'LoginResponseType';
  success: Scalars['Boolean'];
  expiresAt?: Maybe<Scalars['DateTime']>;
};

export type SignUpResponseType = {
  __typename?: 'SignUpResponseType';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type SignUpInput = {
  key: Scalars['String'];
  password: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type UserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  role?: Maybe<ObjectReferenceType>;
};

export type UserUpdateResponseType = {
  __typename?: 'UserUpdateResponseType';
  error?: Maybe<Scalars['String']>;
  user?: Maybe<UserType>;
};

export type InvitationInput = {
  organisation?: Maybe<ObjectReferenceType>;
  role: ObjectReferenceType;
  email: Scalars['String'];
};

export type InvitationResponseType = {
  __typename?: 'InvitationResponseType';
  error?: Maybe<Scalars['String']>;
  invitation?: Maybe<InvitationType>;
};


export type EventType = {
  __typename?: 'EventType';
  /** Timestamp when the event was generated. */
  timestamp?: Maybe<Scalars['DateTime']>;
  /** Type of the event. */
  type?: Maybe<Scalars['String']>;
  /** If the feed status is Active, then when was it last down. */
  data?: Maybe<Scalars['EventData']>;
};

export type EventStatsType = {
  __typename?: 'EventStatsType';
  /** Total count of events for a day. */
  count?: Maybe<Scalars['Int']>;
  /** The day for the event count. */
  day?: Maybe<Scalars['Date']>;
};

export type EventsPage = {
  __typename?: 'EventsPage';
  items?: Maybe<Array<EventType>>;
  pageInfo?: Maybe<PageInfo>;
};

export enum AlertTypeEnum {
  FeedFailure = 'FeedFailure',
  VehicleCountDisparity = 'VehicleCountDisparity',
  FeedComplianceFailure = 'FeedComplianceFailure'
}

export type AlertType = {
  __typename?: 'AlertType';
  /** The id of the alert. */
  alertId?: Maybe<Scalars['String']>;
  /** The type of the alert. */
  alertType?: Maybe<AlertTypeEnum>;
  /** User that created the alert. */
  createdBy?: Maybe<UserType>;
  /** User that the alert will send an email to. */
  sendTo?: Maybe<UserType>;
  /** How many minutes that an event must perist before alert is sent. */
  eventHysterisis?: Maybe<Scalars['Int']>;
  /** How many events must be generated before an alert is sent. */
  eventThreshold?: Maybe<Scalars['Int']>;
};

export type AlertInputType = {
  /** The type of the alert. */
  alertType?: Maybe<AlertTypeEnum>;
  /** User that the alert will send an email to. */
  sendTo?: Maybe<ObjectReferenceType>;
  /** How many minutes that an event must perist before alert is sent. */
  eventHysterisis?: Maybe<Scalars['Int']>;
  /** How many events must be generated before an alert is sent. */
  eventThreshold?: Maybe<Scalars['Int']>;
};

export type OnTimePerformanceType = {
  __typename?: 'OnTimePerformanceType';
  /** Punctuality overview for operators */
  punctualityOverview?: Maybe<PunctualityTotalsType>;
  /** Punctuality per service for an operator. */
  servicePunctuality?: Maybe<Array<ServicePunctualityType>>;
  /** Punctuality for a single operator as a time-series. */
  punctualityTimeSeries?: Maybe<Array<PunctualityTimeSeriesType>>;
  /** Delay histogram for services of a given operator. */
  delayFrequency?: Maybe<Array<DelayFrequencyType>>;
  /** Punctuality histogram per hour of day for a single operator. */
  punctualityTimeOfDay?: Maybe<Array<PunctualityTimeOfDayType>>;
  /** Punctuality histogram per day of week for a single operator. */
  punctualityDayOfWeek?: Maybe<Array<PunctualityDayOfWeekType>>;
  /** Detailed performance per service for an operator. */
  servicePerformance?: Maybe<Array<ServicePerformanceType>>;
  /** Per-stop punctuality for a service. */
  stopPerformance?: Maybe<Array<StopPerformanceType>>;
  /** Performance for list of operators */
  operatorPerformance: OperatorPerformancePage;
};


export type OnTimePerformanceTypePunctualityOverviewArgs = {
  inputs: PerformanceInputType;
};


export type OnTimePerformanceTypeServicePunctualityArgs = {
  inputs: ServicePerformanceInputType;
};


export type OnTimePerformanceTypePunctualityTimeSeriesArgs = {
  inputs: PerformanceInputType;
};


export type OnTimePerformanceTypeDelayFrequencyArgs = {
  inputs: PerformanceInputType;
};


export type OnTimePerformanceTypePunctualityTimeOfDayArgs = {
  inputs: PerformanceInputType;
};


export type OnTimePerformanceTypePunctualityDayOfWeekArgs = {
  inputs: PerformanceInputType;
};


export type OnTimePerformanceTypeServicePerformanceArgs = {
  inputs: PerformanceInputType;
};


export type OnTimePerformanceTypeStopPerformanceArgs = {
  inputs: PerformanceInputType;
};


export type OnTimePerformanceTypeOperatorPerformanceArgs = {
  inputs: PerformanceInputType;
};

/** Interface for punctuality response. */
export type IPunctualityType = {
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
};

/** Type to represent punctuality of a service. */
export type PunctualityTotalsType = IPunctualityType & {
  __typename?: 'PunctualityTotalsType';
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
  scheduled: Scalars['Int'];
  completed: Scalars['Int'];
  averageDeviation: Scalars['Float'];
};

/** Type to represent punctuality numbers in a time-series. */
export type PunctualityTimeSeriesType = IPunctualityType & {
  __typename?: 'PunctualityTimeSeriesType';
  ts: Scalars['DateTime'];
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
};

/** Type to represent punctuality histogram per-hour in a day. */
export type PunctualityTimeOfDayType = IPunctualityType & {
  __typename?: 'PunctualityTimeOfDayType';
  timeOfDay: Scalars['Time'];
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
};

/** Type to represent punctuality histogram per-day-of-week in a day. */
export type PunctualityDayOfWeekType = IPunctualityType & {
  __typename?: 'PunctualityDayOfWeekType';
  dayOfWeek: Scalars['Int'];
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
};

/** Type to represent frequence of services in delay buckets. */
export type DelayFrequencyType = {
  __typename?: 'DelayFrequencyType';
  bucket: Scalars['Int'];
  frequency: Scalars['Int'];
};

/** Type to represent puntuality of a service. */
export type ServicePunctualityType = IPunctualityType & {
  __typename?: 'ServicePunctualityType';
  nocCode: Scalars['String'];
  lineId: Scalars['String'];
  lineInfo: ServiceInfoType;
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
  rank: Scalars['Float'];
  /**
   * Get the performance numbers for a previous period
   * for comparison with current period.
   */
  trend?: Maybe<ServicePunctualityType>;
};


/** Type to represent puntuality of a service. */
export type ServicePunctualityTypeTrendArgs = {
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
};

export type LineInfoType = {
  __typename?: 'LineInfoType';
  lineNumber: Scalars['String'];
  lineName: Scalars['String'];
};

/**
 * Type to represent performance metrics for services.
 * This may be merged with ServicePunctualityType in the future.
 */
export type ServicePerformanceType = IPunctualityType & {
  __typename?: 'ServicePerformanceType';
  lineId: Scalars['String'];
  lineInfo: ServiceInfoType;
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
  averageDelay: Scalars['Float'];
  scheduledDepartures: Scalars['Int'];
  actualDepartures: Scalars['Int'];
};

/** Type to represent performance metrics for stops for a service. */
export type StopPerformanceType = IPunctualityType & {
  __typename?: 'StopPerformanceType';
  lineId: Scalars['String'];
  stopId: Scalars['String'];
  stopInfo: StopInfoType;
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
  averageDelay: Scalars['Float'];
  scheduledDepartures: Scalars['Int'];
  actualDepartures: Scalars['Int'];
  timingPoint: Scalars['Boolean'];
};

export type PerformanceInputType = {
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
  filters?: Maybe<PerformanceFiltersInputType>;
  paging?: Maybe<PagingInputType>;
  sortBy?: Maybe<PunctualitySortType>;
};

export type PagingInputType = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Int']>;
};

export type PerformanceFiltersInputType = {
  nocCodes?: Maybe<Array<Maybe<Scalars['String']>>>;
  lineIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  timingPointsOnly?: Maybe<Scalars['Boolean']>;
  startTime?: Maybe<Scalars['Time']>;
  endTime?: Maybe<Scalars['Time']>;
  dayOfWeekFlags?: Maybe<DayOfWeekFlagsInputType>;
  minDelay?: Maybe<Scalars['Int']>;
  maxDelay?: Maybe<Scalars['Int']>;
  excludeItoLineId?: Maybe<Scalars['String']>;
  granularity?: Maybe<Granularity>;
};

export type DayOfWeekFlagsInputType = {
  monday: Scalars['Boolean'];
  tuesday: Scalars['Boolean'];
  wednesday: Scalars['Boolean'];
  thursday: Scalars['Boolean'];
  friday: Scalars['Boolean'];
  saturday: Scalars['Boolean'];
  sunday: Scalars['Boolean'];
};

export enum RankingOrder {
  Ascending = 'ascending',
  Descending = 'descending'
}

export type ServicePerformanceInputType = {
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
  filters?: Maybe<PerformanceFiltersInputType>;
  order?: Maybe<RankingOrder>;
  limit?: Maybe<Scalars['Int']>;
};

/** Type to represent performance metrics for operators. */
export type OperatorPerformanceType = IPunctualityType & {
  __typename?: 'OperatorPerformanceType';
  nocCode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  early: Scalars['Int'];
  onTime: Scalars['Int'];
  late: Scalars['Int'];
  averageDelay: Scalars['Float'];
  scheduledDepartures: Scalars['Int'];
  actualDepartures: Scalars['Int'];
};

/** Represents a single page in a paginated response for operator performance results. */
export type OperatorPerformancePage = {
  __typename?: 'OperatorPerformancePage';
  pageInfo?: Maybe<PageInfo>;
  items: Array<Maybe<OperatorPerformanceType>>;
};

/** Represents a sorting type for list of operators. */
export type PunctualitySortType = {
  order?: Maybe<SortOrderEnum>;
  field?: Maybe<PunctualitySortEnum>;
};

export enum PunctualitySortEnum {
  Early = 'early',
  OnTime = 'on_time',
  Late = 'late'
}

/** Type to represent all queries related to GPS feeds. */
export type GpsFeedNamespace = {
  __typename?: 'GpsFeedNamespace';
  /** Get all journeys from the gps feed. */
  getJourneys: Array<Maybe<GpsFeedType>>;
  /** Get all unmatched journeys from the gps feed. */
  getUnmatchedJourneys: Array<Maybe<GpsFeedType>>;
  /**
   * Get stale journeys, journeys that have a matched vehicle journey
   * but haven't sent a GPS feed for more than a minute.
   */
  getStaleJourneys: Array<Maybe<GpsFeedType>>;
  /** Get gps feed for a specific journey. */
  getJourney: Array<Maybe<GpsFeedType>>;
  /**
   * Get count of matched vehicles.
   * 
   * You can filter counts for a set of noc codes.
   * Note that unmatched count are for all unmatched vehicles
   * running on lines that were being operated by operators
   * that were either filtered by nocCodes filter or all
   * operators that the organisation of the user is
   * configured with.
   */
  getVehicleCounts: VehicleCountType;
};


/** Type to represent all queries related to GPS feeds. */
export type GpsFeedNamespaceGetJourneysArgs = {
  inputs: GpsFeedInputType;
};


/** Type to represent all queries related to GPS feeds. */
export type GpsFeedNamespaceGetUnmatchedJourneysArgs = {
  inputs: GpsFeedInputType;
};


/** Type to represent all queries related to GPS feeds. */
export type GpsFeedNamespaceGetStaleJourneysArgs = {
  timeAgo: Scalars['String'];
};


/** Type to represent all queries related to GPS feeds. */
export type GpsFeedNamespaceGetJourneyArgs = {
  journeyId: Scalars['String'];
  startTime: Scalars['DateTime'];
};


/** Type to represent all queries related to GPS feeds. */
export type GpsFeedNamespaceGetVehicleCountsArgs = {
  timeAgo: Scalars['String'];
  nocCodes?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Type to represent input paramweters to get real-time gps feeds. */
export type GpsFeedInputType = {
  /**
   * A string contains a past interval suffixed with the time-unit. Examples are
   * - 1h: Gets GPS feed for the last 1 hour
   * - 10m: Gets GPS feed for the last 10 minutes.
   * This string must adhere to TimeStream timeAgo specifications.
   */
  timeAgo: Scalars['String'];
  filters?: Maybe<GpsFeedFilterInputType>;
  /**
   * Whether to load all events for each journey. By default this is false
   * where the API returns the latest GPS position of each ongoing journey.
   */
  loadTrails?: Maybe<Scalars['Boolean']>;
};

/** Filters for GPS feed. */
export type GpsFeedFilterInputType = {
  nocCodes?: Maybe<Array<Maybe<Scalars['String']>>>;
  lineIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  journeyIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The vehicleIds filters is only used with getUnmatchedJourneys. */
  vehicleIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/**
 * GPS feed status for each feed event.
 * 
 * Stale - Latest feed event is more than a minute old.
 * Active - Latest feed event is a not stale.
 */
export enum GpsFeedStatus {
  Active = 'Active',
  Stale = 'Stale'
}

/**
 * Vehicle journey status.
 * 
 * Started - This feed event is for a journey that's supposed to be running.
 * Completed - This feed event is for a journey that's supposed to have been completed.
 */
export enum GpsFeedJourneyStatus {
  Unknown = 'Unknown',
  Started = 'Started',
  Completed = 'Completed'
}

/** Type to represent a GPS feed response. */
export type GpsFeedType = {
  __typename?: 'GpsFeedType';
  ts: Scalars['DateTime'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  vehicleId: Scalars['String'];
  vehicleJourneyId?: Maybe<Scalars['String']>;
  servicePatternId?: Maybe<Scalars['String']>;
  delay?: Maybe<Scalars['Int']>;
  startTime?: Maybe<Scalars['DateTime']>;
  scheduledDeparture?: Maybe<Scalars['DateTime']>;
  operatorInfo?: Maybe<OperatorInfoType>;
  serviceInfo: ServiceInfoType;
  previousStopInfo?: Maybe<StopInfoType>;
  feedStatus?: Maybe<GpsFeedStatus>;
  journeyStatus?: Maybe<GpsFeedJourneyStatus>;
};

/** Type to represent vehicle counts. */
export type VehicleCountType = {
  __typename?: 'VehicleCountType';
  matched: Scalars['Int'];
  unmatched: Scalars['Int'];
};

export type CorridorNamespace = {
  __typename?: 'CorridorNamespace';
  /** Add first stop in corridor. */
  addFirstStop: Array<Maybe<StopType>>;
  /** Add subsequent stops in corridor. */
  addSubsequentStops: Array<Maybe<StopType>>;
  /** List corridors. */
  corridorList?: Maybe<Array<Maybe<CorridorType>>>;
  /** Add subsequent stops in corridor. */
  stats?: Maybe<CorridorStatsType>;
  /** Get a corridor by id. */
  getCorridor: CorridorType;
};


export type CorridorNamespaceAddFirstStopArgs = {
  searchString: Scalars['String'];
};


export type CorridorNamespaceAddSubsequentStopsArgs = {
  stopList: Array<Maybe<Scalars['String']>>;
};


export type CorridorNamespaceStatsArgs = {
  inputs: CorridorStatsInputType;
};


export type CorridorNamespaceGetCorridorArgs = {
  corridorId: Scalars['Int'];
};

export type CorridorStatsType = {
  __typename?: 'CorridorStatsType';
  /** Summary stats for a corridor. */
  summaryStats?: Maybe<CorridorSummaryStatsType>;
  /**
   * Overview stats for a corridor.
   * This includes min/max/percentiles journey time
   */
  journeyTimeStats: Array<Maybe<CorridorJourneyTimeStatsType>>;
  /** Journey time stats grouped by time of day. */
  journeyTimeTimeOfDayStats: Array<Maybe<CorridorStatsTimeOfDayType>>;
  /** Journey time stats grouped by day of week. */
  journeyTimeDayOfWeekStats: Array<Maybe<CorridorStatsDayOfWeekType>>;
  /** Journey time stats grouped by noc_code, service pattern and line. */
  journeyTimePerServiceStats: Array<Maybe<CorridorStatsPerServiceType>>;
  /** Journey time histogram. */
  journeyTimeHistogram: Array<Maybe<CorridorStatsHistogramType>>;
};

export type CorridorSummaryStatsType = {
  __typename?: 'CorridorSummaryStatsType';
  /** Response for corridor summary stats. */
  totalTransits?: Maybe<Scalars['Int']>;
  numberOfServices?: Maybe<Scalars['Int']>;
  averageJourneyTime?: Maybe<Scalars['Int']>;
  scheduledJourneyTime?: Maybe<Scalars['Int']>;
  scheduledTransits?: Maybe<Scalars['Int']>;
  percentile95?: Maybe<Scalars['Float']>;
  operatorName?: Maybe<Scalars['String']>;
};

export type ICorridorJourneyTimeStats = {
  minTransitTime: Scalars['Int'];
  maxTransitTime: Scalars['Int'];
  avgTransitTime?: Maybe<Scalars['Float']>;
  percentile5?: Maybe<Scalars['Float']>;
  percentile25?: Maybe<Scalars['Float']>;
  percentile75?: Maybe<Scalars['Float']>;
  percentile95?: Maybe<Scalars['Float']>;
};

export type CorridorJourneyTimeStatsType = ICorridorJourneyTimeStats & {
  __typename?: 'CorridorJourneyTimeStatsType';
  /** Response for corridor journey time stats. */
  ts: Scalars['DateTime'];
  minTransitTime: Scalars['Int'];
  maxTransitTime: Scalars['Int'];
  avgTransitTime?: Maybe<Scalars['Float']>;
  percentile5?: Maybe<Scalars['Float']>;
  percentile25?: Maybe<Scalars['Float']>;
  percentile75?: Maybe<Scalars['Float']>;
  percentile95?: Maybe<Scalars['Float']>;
};

export type CorridorStatsTimeOfDayType = ICorridorJourneyTimeStats & {
  __typename?: 'CorridorStatsTimeOfDayType';
  /** Response for corridor journey time stats grouped by time of day. */
  hour: Scalars['Int'];
  minTransitTime: Scalars['Int'];
  maxTransitTime: Scalars['Int'];
  avgTransitTime?: Maybe<Scalars['Float']>;
  percentile5?: Maybe<Scalars['Float']>;
  percentile25?: Maybe<Scalars['Float']>;
  percentile75?: Maybe<Scalars['Float']>;
  percentile95?: Maybe<Scalars['Float']>;
};

export type CorridorStatsDayOfWeekType = ICorridorJourneyTimeStats & {
  __typename?: 'CorridorStatsDayOfWeekType';
  /** Response for corridor journey time stats grouped by day of week. */
  dow: Scalars['Int'];
  minTransitTime: Scalars['Int'];
  maxTransitTime: Scalars['Int'];
  avgTransitTime?: Maybe<Scalars['Float']>;
  percentile5?: Maybe<Scalars['Float']>;
  percentile25?: Maybe<Scalars['Float']>;
  percentile75?: Maybe<Scalars['Float']>;
  percentile95?: Maybe<Scalars['Float']>;
};

export type CorridorStatsPerServiceType = {
  __typename?: 'CorridorStatsPerServiceType';
  /** Response for corridor journey time stats grouped by noc code, line and service pattern. */
  lineName: Scalars['String'];
  servicePatternName: Scalars['String'];
  noc: Scalars['String'];
  totalJourneyTime?: Maybe<Scalars['Int']>;
  recordedTransits?: Maybe<Scalars['Int']>;
  scheduledTransits?: Maybe<Scalars['Int']>;
  totalScheduledJourneyTime?: Maybe<Scalars['Int']>;
  operatorName?: Maybe<Scalars['String']>;
};

export type CorridorHistogramType = {
  __typename?: 'CorridorHistogramType';
  /** Histogram type. */
  bin?: Maybe<Scalars['Int']>;
  freq?: Maybe<Scalars['Int']>;
};

export type CorridorStatsHistogramType = {
  __typename?: 'CorridorStatsHistogramType';
  /** Response for corridor journey time histogram stats. */
  ts?: Maybe<Scalars['DateTime']>;
  hist?: Maybe<Array<Maybe<CorridorHistogramType>>>;
};

export enum CorridorGranularity {
  Hour = 'hour',
  Day = 'day',
  Month = 'month'
}

export type CorridorStatsInputType = {
  /** Input type for corridor stats queries. */
  corridorId: Scalars['String'];
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
  granularity?: Maybe<CorridorGranularity>;
  stopList?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CorridorInputType = {
  /** Input type for corridor creation. */
  name: Scalars['String'];
  stopIds: Array<Maybe<Scalars['String']>>;
};

export type CorridorType = {
  __typename?: 'CorridorType';
  /** Response type for corridor queries. */
  id: Scalars['Int'];
  name: Scalars['String'];
  stops: Array<Maybe<StopInfoType>>;
  createdBy: UserType;
};

export type VehicleReplayNamespace = {
  __typename?: 'VehicleReplayNamespace';
  /** Vehicle replay API. */
  getJourneys: Array<Maybe<GpsFeedType>>;
  /** Get vehicle replay for a single journey. */
  getJourney: Array<Maybe<GpsFeedType>>;
};


export type VehicleReplayNamespaceGetJourneysArgs = {
  inputs: VehicleReplayInputType;
};


export type VehicleReplayNamespaceGetJourneyArgs = {
  journeyId: Scalars['String'];
  startTime: Scalars['DateTime'];
};

/** Type to represent input paramweters to get vehicle replay data. */
export type VehicleReplayInputType = {
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
  filters?: Maybe<VehicleReplayFilterInputType>;
};

/** Filters for vehicle replay API. */
export type VehicleReplayFilterInputType = {
  lineIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  stopIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type HeadwayMetricsType = {
  __typename?: 'HeadwayMetricsType';
  /** Returns summary headway metrics like excess-wait times. */
  headwayOverview: HeadwayOverviewType;
  /** Headway for a single line as a time-series. */
  headwayTimeSeries?: Maybe<Array<HeadwayTimeSeriesType>>;
  /** Headway histogram per hour of day for a single line. */
  headwayTimeOfDay?: Maybe<Array<HeadwayTimeOfDayType>>;
  /** Headway histogram per day of week for a single line. */
  headwayDayOfWeek?: Maybe<Array<HeadwayDayOfWeekType>>;
  /** Get a list of frequent services. */
  frequentServices?: Maybe<Array<FrequentServiceType>>;
  /** Get information about a frequent service. */
  frequentServiceInfo: FrequentServiceInfoType;
};


export type HeadwayMetricsTypeHeadwayOverviewArgs = {
  inputs: HeadwayInputType;
};


export type HeadwayMetricsTypeHeadwayTimeSeriesArgs = {
  inputs: HeadwayInputType;
};


export type HeadwayMetricsTypeHeadwayTimeOfDayArgs = {
  inputs: HeadwayInputType;
};


export type HeadwayMetricsTypeHeadwayDayOfWeekArgs = {
  inputs: HeadwayInputType;
};


export type HeadwayMetricsTypeFrequentServicesArgs = {
  noc: Scalars['String'];
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
};


export type HeadwayMetricsTypeFrequentServiceInfoArgs = {
  noc: Scalars['String'];
  lineId: Scalars['String'];
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
};

/** Interface for headway response. */
export type IHeadwayType = {
  actualWaitTime: Scalars['Float'];
  scheduledWaitTime: Scalars['Float'];
  excessWaitTime: Scalars['Float'];
};

/** Type to represent headway overview. */
export type HeadwayOverviewType = IHeadwayType & {
  __typename?: 'HeadwayOverviewType';
  actualWaitTime: Scalars['Float'];
  scheduledWaitTime: Scalars['Float'];
  excessWaitTime: Scalars['Float'];
};

/** Type to represent headway metrics in a time-series. */
export type HeadwayTimeSeriesType = IHeadwayType & {
  __typename?: 'HeadwayTimeSeriesType';
  ts: Scalars['DateTime'];
  actualWaitTime: Scalars['Float'];
  scheduledWaitTime: Scalars['Float'];
  excessWaitTime: Scalars['Float'];
};

/** Type to represent headway metrics per time-of-day. */
export type HeadwayTimeOfDayType = IHeadwayType & {
  __typename?: 'HeadwayTimeOfDayType';
  timeOfDay: Scalars['Time'];
  actualWaitTime: Scalars['Float'];
  scheduledWaitTime: Scalars['Float'];
  excessWaitTime: Scalars['Float'];
};

/** Type to represent headway metrics per-day-of-week. */
export type HeadwayDayOfWeekType = IHeadwayType & {
  __typename?: 'HeadwayDayOfWeekType';
  dayOfWeek: Scalars['Int'];
  actualWaitTime: Scalars['Float'];
  scheduledWaitTime: Scalars['Float'];
  excessWaitTime: Scalars['Float'];
};

export type HeadwayInputType = {
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
  filters?: Maybe<HeadwayFiltersInputType>;
  sortBy?: Maybe<HeadwaySortType>;
};

export type HeadwayFiltersInputType = {
  nocCodes?: Maybe<Array<Maybe<Scalars['String']>>>;
  lineIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  startTime?: Maybe<Scalars['Time']>;
  endTime?: Maybe<Scalars['Time']>;
  dayOfWeekFlags?: Maybe<DayOfWeekFlagsInputType>;
  granularity?: Maybe<Granularity>;
};

/** Represents a sorting type for list of operators. */
export type HeadwaySortType = {
  order?: Maybe<SortOrderEnum>;
  field?: Maybe<HeadwaySortEnum>;
};

export enum HeadwaySortEnum {
  ActualWaitTime = 'actualWaitTime',
  ScheduledWaitTime = 'scheduledWaitTime',
  ExcessWaitTime = 'excessWaitTime'
}

/** Type to represent a frequent service. */
export type FrequentServiceType = {
  __typename?: 'FrequentServiceType';
  serviceId: Scalars['String'];
  serviceInfo: ServiceInfoType;
};

/** Type to represent info about a particular frequent service. */
export type FrequentServiceInfoType = {
  __typename?: 'FrequentServiceInfoType';
  /** Number of hours that the service runs frequently. */
  numHours: Scalars['Int'];
  /** Total number of hours the services has actually run. */
  totalHours: Scalars['Int'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponseType' }
    & Pick<LoginResponseType, 'success' | 'expiresAt'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'UserType' }
    & UserFragment
  ) }
);

export type CorridorsStopSearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type CorridorsStopSearchQuery = (
  { __typename?: 'Query' }
  & { corridor: (
    { __typename?: 'CorridorNamespace' }
    & { addFirstStop: Array<Maybe<(
      { __typename?: 'StopType' }
      & Pick<StopType, 'stopId' | 'stopName' | 'lat' | 'lon'>
    )>> }
  ) }
);

export type CorridorsSubsequentStopsQueryVariables = Exact<{
  stopList: Array<Maybe<Scalars['String']>>;
}>;


export type CorridorsSubsequentStopsQuery = (
  { __typename?: 'Query' }
  & { corridor: (
    { __typename?: 'CorridorNamespace' }
    & { addSubsequentStops: Array<Maybe<(
      { __typename?: 'StopType' }
      & Pick<StopType, 'stopId' | 'stopName' | 'lon' | 'lat'>
    )>> }
  ) }
);

export type CorridorsListQueryVariables = Exact<{ [key: string]: never; }>;


export type CorridorsListQuery = (
  { __typename?: 'Query' }
  & { corridor: (
    { __typename?: 'CorridorNamespace' }
    & { corridorList?: Maybe<Array<Maybe<(
      { __typename?: 'CorridorType' }
      & Pick<CorridorType, 'id' | 'name'>
      & { stops: Array<Maybe<(
        { __typename?: 'StopInfoType' }
        & Pick<StopInfoType, 'stopId'>
      )>> }
    )>>> }
  ) }
);

export type GetCorridorQueryVariables = Exact<{
  corridorId: Scalars['Int'];
}>;


export type GetCorridorQuery = (
  { __typename?: 'Query' }
  & { corridor: (
    { __typename?: 'CorridorNamespace' }
    & { getCorridor: (
      { __typename?: 'CorridorType' }
      & Pick<CorridorType, 'id' | 'name'>
      & { stops: Array<Maybe<(
        { __typename?: 'StopInfoType' }
        & Pick<StopInfoType, 'stopId' | 'stopName'>
        & { stopLocation: (
          { __typename?: 'GpsPointType' }
          & Pick<GpsPointType, 'latitude' | 'longitude'>
        ), stopLocality: (
          { __typename?: 'LocalityType' }
          & Pick<LocalityType, 'localityId' | 'localityName' | 'localityAreaId' | 'localityAreaName'>
        ) }
      )>> }
    ) }
  ) }
);

export type CorridorStatsQueryVariables = Exact<{
  params: CorridorStatsInputType;
}>;


export type CorridorStatsQuery = (
  { __typename?: 'Query' }
  & { corridor: (
    { __typename?: 'CorridorNamespace' }
    & { stats?: Maybe<(
      { __typename?: 'CorridorStatsType' }
      & { summaryStats?: Maybe<(
        { __typename?: 'CorridorSummaryStatsType' }
        & Pick<CorridorSummaryStatsType, 'totalTransits' | 'numberOfServices' | 'averageJourneyTime' | 'scheduledTransits'>
      )>, journeyTimeStats: Array<Maybe<(
        { __typename?: 'CorridorJourneyTimeStatsType' }
        & Pick<CorridorJourneyTimeStatsType, 'ts' | 'minTransitTime' | 'maxTransitTime' | 'avgTransitTime' | 'percentile25' | 'percentile75'>
      )>>, journeyTimeTimeOfDayStats: Array<Maybe<(
        { __typename?: 'CorridorStatsTimeOfDayType' }
        & Pick<CorridorStatsTimeOfDayType, 'hour' | 'minTransitTime' | 'maxTransitTime' | 'avgTransitTime' | 'percentile25' | 'percentile75'>
      )>>, journeyTimeDayOfWeekStats: Array<Maybe<(
        { __typename?: 'CorridorStatsDayOfWeekType' }
        & Pick<CorridorStatsDayOfWeekType, 'dow' | 'minTransitTime' | 'maxTransitTime' | 'avgTransitTime' | 'percentile25' | 'percentile75'>
      )>>, journeyTimePerServiceStats: Array<Maybe<(
        { __typename?: 'CorridorStatsPerServiceType' }
        & Pick<CorridorStatsPerServiceType, 'lineName' | 'servicePatternName' | 'noc' | 'operatorName' | 'totalJourneyTime' | 'recordedTransits' | 'scheduledTransits'>
      )>>, journeyTimeHistogram: Array<Maybe<(
        { __typename?: 'CorridorStatsHistogramType' }
        & Pick<CorridorStatsHistogramType, 'ts'>
        & { hist?: Maybe<Array<Maybe<(
          { __typename?: 'CorridorHistogramType' }
          & Pick<CorridorHistogramType, 'bin' | 'freq'>
        )>>> }
      )>> }
    )> }
  ) }
);

export type CreateCorridorMutationVariables = Exact<{
  name: Scalars['String'];
  stopIds: Array<Maybe<Scalars['String']>>;
}>;


export type CreateCorridorMutation = (
  { __typename?: 'Mutation' }
  & { createCorridor: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'success' | 'error'>
  ) }
);

export type DeleteCorridorMutationVariables = Exact<{
  corridorId: Scalars['Int'];
}>;


export type DeleteCorridorMutation = (
  { __typename?: 'Mutation' }
  & { deleteCorridor: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'success' | 'error'>
  ) }
);

export type OperatorDashboardFragment = (
  { __typename?: 'OperatorType' }
  & Pick<OperatorType, 'name' | 'nocCode'>
  & { feedMonitoring: (
    { __typename?: 'FeedMonitoringType' }
    & Pick<FeedMonitoringType, 'feedStatus'>
    & { liveStats: (
      { __typename?: 'LiveStatsType' }
      & Pick<LiveStatsType, 'feedErrors' | 'feedAlerts'>
    ) }
  ) }
);

export type OperatorDashboardVehicleCountsFragment = (
  { __typename?: 'OperatorType' }
  & Pick<OperatorType, 'nocCode'>
  & { feedMonitoring: (
    { __typename?: 'FeedMonitoringType' }
    & { liveStats: (
      { __typename?: 'LiveStatsType' }
      & Pick<LiveStatsType, 'currentVehicles' | 'expectedVehicles'>
    ) }
  ) }
);

export type DashboardOperatorListQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardOperatorListQuery = (
  { __typename?: 'Query' }
  & { operators: (
    { __typename?: 'OperatorsPage' }
    & { items: Array<Maybe<(
      { __typename?: 'OperatorType' }
      & OperatorDashboardFragment
    )>> }
  ) }
);

export type DashboardOperatorVehicleCountsListQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardOperatorVehicleCountsListQuery = (
  { __typename?: 'Query' }
  & { operators: (
    { __typename?: 'OperatorsPage' }
    & { items: Array<Maybe<(
      { __typename?: 'OperatorType' }
      & OperatorDashboardVehicleCountsFragment
    )>> }
  ) }
);

export type DashboardPerformanceStatsQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type DashboardPerformanceStatsQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { punctualityOverview?: Maybe<(
      { __typename?: 'PunctualityTotalsType' }
      & Pick<PunctualityTotalsType, 'onTime' | 'late' | 'early'>
    )> }
  ) }
);

export type DashboardServiceRankingQueryVariables = Exact<{
  params: ServicePerformanceInputType;
  trendFrom: Scalars['DateTime'];
  trendTo: Scalars['DateTime'];
}>;


export type DashboardServiceRankingQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { servicePunctuality?: Maybe<Array<(
      { __typename?: 'ServicePunctualityType' }
      & Pick<ServicePunctualityType, 'nocCode' | 'lineId' | 'onTime' | 'early' | 'late'>
      & { lineInfo: (
        { __typename?: 'ServiceInfoType' }
        & Pick<ServiceInfoType, 'serviceId' | 'serviceName' | 'serviceNumber'>
      ), trend?: Maybe<(
        { __typename?: 'ServicePunctualityType' }
        & Pick<ServicePunctualityType, 'onTime' | 'early' | 'late'>
      )> }
    )>> }
  ) }
);

export type EventFragment = (
  { __typename?: 'EventType' }
  & Pick<EventType, 'timestamp' | 'type' | 'data'>
);

export type EventsQueryVariables = Exact<{
  nocCode: Scalars['String'];
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
}>;


export type EventsQuery = (
  { __typename?: 'Query' }
  & { events: (
    { __typename?: 'EventsPage' }
    & { items?: Maybe<Array<(
      { __typename?: 'EventType' }
      & EventFragment
    )>> }
  ) }
);

export type EventStatsQueryVariables = Exact<{
  nocCode: Scalars['String'];
  start: Scalars['Date'];
  end: Scalars['Date'];
}>;


export type EventStatsQuery = (
  { __typename?: 'Query' }
  & { eventStats: Array<(
    { __typename?: 'EventStatsType' }
    & Pick<EventStatsType, 'count' | 'day'>
  )> }
);

export type VehicleStatFragment = (
  { __typename?: 'VehicleStatsType' }
  & Pick<VehicleStatsType, 'actual' | 'expected' | 'timestamp'>
);

export type BasicOperatorFragment = (
  { __typename?: 'OperatorType' }
  & Pick<OperatorType, 'name' | 'nocCode'>
  & { feedMonitoring: (
    { __typename?: 'FeedMonitoringType' }
    & Pick<FeedMonitoringType, 'feedStatus' | 'availability' | 'lastOutage' | 'unavailableSince'>
    & { liveStats: (
      { __typename?: 'LiveStatsType' }
      & Pick<LiveStatsType, 'updateFrequency'>
    ) }
  ) }
);

export type OperatorLiveStatusFragment = (
  { __typename?: 'OperatorType' }
  & Pick<OperatorType, 'name' | 'nocCode'>
  & { feedMonitoring: (
    { __typename?: 'FeedMonitoringType' }
    & Pick<FeedMonitoringType, 'feedStatus' | 'availability' | 'lastOutage' | 'unavailableSince'>
    & { liveStats: (
      { __typename?: 'LiveStatsType' }
      & Pick<LiveStatsType, 'updateFrequency' | 'currentVehicles' | 'expectedVehicles'>
      & { last24Hours: Array<Maybe<(
        { __typename?: 'VehicleStatsType' }
        & VehicleStatFragment
      )>>, last20Minutes: Array<Maybe<(
        { __typename?: 'VehicleStatsType' }
        & VehicleStatFragment
      )>> }
    ) }
  ) }
);

export type OperatorFeedHistoryFragment = (
  { __typename?: 'OperatorType' }
  & Pick<OperatorType, 'name' | 'nocCode'>
  & { feedMonitoring: (
    { __typename?: 'FeedMonitoringType' }
    & { historicalStats: (
      { __typename?: 'HistoricalStatsType' }
      & Pick<HistoricalStatsType, 'updateFrequency' | 'availability'>
    ), vehicleStats: Array<(
      { __typename?: 'VehicleStatsType' }
      & VehicleStatFragment
    )> }
  ) }
);

export type FeedMonitoringListQueryVariables = Exact<{ [key: string]: never; }>;


export type FeedMonitoringListQuery = (
  { __typename?: 'Query' }
  & { operators: (
    { __typename?: 'OperatorsPage' }
    & { items: Array<Maybe<(
      { __typename?: 'OperatorType' }
      & BasicOperatorFragment
    )>> }
  ) }
);

export type OperatorSparklineStatsQueryVariables = Exact<{
  nocCodes?: Maybe<Array<Scalars['String']>>;
}>;


export type OperatorSparklineStatsQuery = (
  { __typename?: 'Query' }
  & { operators: (
    { __typename?: 'OperatorsPage' }
    & { items: Array<Maybe<(
      { __typename?: 'OperatorType' }
      & Pick<OperatorType, 'nocCode'>
      & { feedMonitoring: (
        { __typename?: 'FeedMonitoringType' }
        & { liveStats: (
          { __typename?: 'LiveStatsType' }
          & { last24Hours: Array<Maybe<(
            { __typename?: 'VehicleStatsType' }
            & VehicleStatFragment
          )>> }
        ) }
      ) }
    )>> }
  ) }
);

export type OperatorLiveStatusQueryVariables = Exact<{
  nocCode: Scalars['String'];
}>;


export type OperatorLiveStatusQuery = (
  { __typename?: 'Query' }
  & { operator?: Maybe<(
    { __typename?: 'OperatorType' }
    & OperatorLiveStatusFragment
  )> }
);

export type OperatorHistoricStatsQueryVariables = Exact<{
  nocCode: Scalars['String'];
  date: Scalars['Date'];
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
}>;


export type OperatorHistoricStatsQuery = (
  { __typename?: 'Query' }
  & { operator?: Maybe<(
    { __typename?: 'OperatorType' }
    & OperatorFeedHistoryFragment
  )> }
);

export type HeadwayTimeSeriesQueryVariables = Exact<{
  params: HeadwayInputType;
}>;


export type HeadwayTimeSeriesQuery = (
  { __typename?: 'Query' }
  & { headwayMetrics: (
    { __typename?: 'HeadwayMetricsType' }
    & { headwayTimeSeries?: Maybe<Array<(
      { __typename?: 'HeadwayTimeSeriesType' }
      & Pick<HeadwayTimeSeriesType, 'ts'>
      & { actual: HeadwayTimeSeriesType['actualWaitTime'], scheduled: HeadwayTimeSeriesType['scheduledWaitTime'], excess: HeadwayTimeSeriesType['excessWaitTime'] }
    )>> }
  ) }
);

export type HeadwayOverviewQueryVariables = Exact<{
  params: HeadwayInputType;
}>;


export type HeadwayOverviewQuery = (
  { __typename?: 'Query' }
  & { headwayMetrics: (
    { __typename?: 'HeadwayMetricsType' }
    & { headwayOverview: (
      { __typename?: 'HeadwayOverviewType' }
      & { actual: HeadwayOverviewType['actualWaitTime'], scheduled: HeadwayOverviewType['scheduledWaitTime'], excess: HeadwayOverviewType['excessWaitTime'] }
    ) }
  ) }
);

export type HeadwayFrequentServicesQueryVariables = Exact<{
  noc: Scalars['String'];
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
}>;


export type HeadwayFrequentServicesQuery = (
  { __typename?: 'Query' }
  & { headwayMetrics: (
    { __typename?: 'HeadwayMetricsType' }
    & { frequentServices?: Maybe<Array<(
      { __typename?: 'FrequentServiceType' }
      & Pick<FrequentServiceType, 'serviceId'>
    )>> }
  ) }
);

export type HeadwayFrequentServiceInfoQueryVariables = Exact<{
  noc: Scalars['String'];
  lineId: Scalars['String'];
  fromTimestamp: Scalars['DateTime'];
  toTimestamp: Scalars['DateTime'];
}>;


export type HeadwayFrequentServiceInfoQuery = (
  { __typename?: 'Query' }
  & { headwayMetrics: (
    { __typename?: 'HeadwayMetricsType' }
    & { frequentServiceInfo: (
      { __typename?: 'FrequentServiceInfoType' }
      & Pick<FrequentServiceInfoType, 'numHours' | 'totalHours'>
    ) }
  ) }
);

export type OnTimeDelayFrequencyQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimeDelayFrequencyQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { delayFrequency?: Maybe<Array<(
      { __typename?: 'DelayFrequencyType' }
      & Pick<DelayFrequencyType, 'bucket' | 'frequency'>
    )>> }
  ) }
);

export type OnTimeTimeSeriesQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimeTimeSeriesQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { punctualityTimeSeries?: Maybe<Array<(
      { __typename?: 'PunctualityTimeSeriesType' }
      & Pick<PunctualityTimeSeriesType, 'ts' | 'onTime' | 'early' | 'late'>
    )>> }
  ) }
);

export type OnTimeStatsQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimeStatsQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { punctualityOverview?: Maybe<(
      { __typename?: 'PunctualityTotalsType' }
      & Pick<PunctualityTotalsType, 'early' | 'late' | 'onTime' | 'scheduled' | 'completed' | 'averageDeviation'>
    )> }
  ) }
);

export type OnTimePunctualityTimeOfDayQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimePunctualityTimeOfDayQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { punctualityTimeOfDay?: Maybe<Array<(
      { __typename?: 'PunctualityTimeOfDayType' }
      & Pick<PunctualityTimeOfDayType, 'timeOfDay' | 'onTime' | 'early' | 'late'>
    )>> }
  ) }
);

export type OnTimePunctualityDayOfWeekQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimePunctualityDayOfWeekQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { punctualityDayOfWeek?: Maybe<Array<(
      { __typename?: 'PunctualityDayOfWeekType' }
      & Pick<PunctualityDayOfWeekType, 'dayOfWeek' | 'onTime' | 'early' | 'late'>
    )>> }
  ) }
);

export type OnTimeServicePerformanceListQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimeServicePerformanceListQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { servicePerformance?: Maybe<Array<(
      { __typename?: 'ServicePerformanceType' }
      & Pick<ServicePerformanceType, 'lineId' | 'early' | 'onTime' | 'late' | 'averageDelay' | 'scheduledDepartures' | 'actualDepartures'>
      & { lineInfo: (
        { __typename?: 'ServiceInfoType' }
        & Pick<ServiceInfoType, 'serviceId' | 'serviceName' | 'serviceNumber'>
      ) }
    )>> }
  ) }
);

export type OnTimeStopPerformanceListQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimeStopPerformanceListQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { stopPerformance?: Maybe<Array<(
      { __typename?: 'StopPerformanceType' }
      & Pick<StopPerformanceType, 'lineId' | 'stopId' | 'early' | 'onTime' | 'late' | 'averageDelay' | 'scheduledDepartures' | 'actualDepartures' | 'timingPoint'>
      & { stopInfo: (
        { __typename?: 'StopInfoType' }
        & Pick<StopInfoType, 'stopId' | 'stopName'>
        & { stopLocation: (
          { __typename?: 'GpsPointType' }
          & Pick<GpsPointType, 'latitude' | 'longitude'>
        ), stopLocality: (
          { __typename?: 'LocalityType' }
          & Pick<LocalityType, 'localityId' | 'localityName' | 'localityAreaId' | 'localityAreaName'>
        ) }
      ) }
    )>> }
  ) }
);

export type OnTimeOperatorPerformanceListQueryVariables = Exact<{
  params: PerformanceInputType;
}>;


export type OnTimeOperatorPerformanceListQuery = (
  { __typename?: 'Query' }
  & { onTimePerformance: (
    { __typename?: 'OnTimePerformanceType' }
    & { operatorPerformance: (
      { __typename?: 'OperatorPerformancePage' }
      & { pageInfo?: Maybe<(
        { __typename?: 'PageInfo' }
        & Pick<PageInfo, 'totalCount' | 'next'>
      )>, items: Array<Maybe<(
        { __typename?: 'OperatorPerformanceType' }
        & Pick<OperatorPerformanceType, 'nocCode' | 'name' | 'early' | 'onTime' | 'late'>
      )>> }
    ) }
  ) }
);

export type ServiceInfoQueryVariables = Exact<{
  lineId: Scalars['String'];
}>;


export type ServiceInfoQuery = (
  { __typename?: 'Query' }
  & { serviceInfo: (
    { __typename?: 'ServiceInfoType' }
    & Pick<ServiceInfoType, 'serviceId' | 'serviceNumber' | 'serviceName'>
  ) }
);

export type TransitModelServicePatternStopsQueryVariables = Exact<{
  nocCode: Scalars['String'];
  lineId: Scalars['String'];
}>;


export type TransitModelServicePatternStopsQuery = (
  { __typename?: 'Query' }
  & { operator?: Maybe<(
    { __typename?: 'OperatorType' }
    & { transitModel: (
      { __typename?: 'TransitModelType' }
      & { lines: (
        { __typename?: 'PaginatedLineType' }
        & { items?: Maybe<Array<(
          { __typename?: 'LineType' }
          & Pick<LineType, 'lineId' | 'lineName'>
          & { servicePatterns: Array<Maybe<(
            { __typename?: 'ServicePatternType' }
            & Pick<ServicePatternType, 'servicePatternId' | 'name'>
            & { stops: Array<Maybe<(
              { __typename?: 'StopType' }
              & Pick<StopType, 'stopId' | 'stopName' | 'lon' | 'lat'>
            )>> }
          )>> }
        )>> }
      ) }
    ) }
  )> }
);

export type UserFragment = (
  { __typename?: 'UserType' }
  & Pick<UserType, 'id' | 'email' | 'username' | 'firstName' | 'lastName'>
  & { organisation?: Maybe<(
    { __typename?: 'OrganisationType' }
    & Pick<OrganisationType, 'id' | 'name'>
  )>, roles: Array<(
    { __typename?: 'RoleType' }
    & RoleFragment
  )> }
);

export type RoleFragment = (
  { __typename?: 'RoleType' }
  & Pick<RoleType, 'id' | 'name' | 'scope'>
);

export type AlertFragment = (
  { __typename?: 'AlertType' }
  & Pick<AlertType, 'alertId' | 'alertType' | 'eventHysterisis' | 'eventThreshold'>
  & { createdBy?: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'firstName' | 'lastName' | 'username'>
  )>, sendTo?: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'firstName' | 'lastName' | 'username'>
  )> }
);

export type ListUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListUsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'UserType' }
    & UserFragment
  )> }
);

export type ListRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListRolesQuery = (
  { __typename?: 'Query' }
  & { roles: Array<(
    { __typename?: 'RoleType' }
    & RoleFragment
  )> }
);

export type ListUserAlertsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListUserAlertsQuery = (
  { __typename?: 'Query' }
  & { userAlerts: Array<(
    { __typename?: 'AlertType' }
    & AlertFragment
  )> }
);

export type FetchUserAlertQueryVariables = Exact<{
  alertId: Scalars['String'];
}>;


export type FetchUserAlertQuery = (
  { __typename?: 'Query' }
  & { userAlert?: Maybe<(
    { __typename?: 'AlertType' }
    & AlertFragment
  )> }
);

export type EditUserMutationVariables = Exact<{
  username: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  role: Scalars['String'];
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'UserUpdateResponseType' }
    & Pick<UserUpdateResponseType, 'error'>
    & { user?: Maybe<(
      { __typename?: 'UserType' }
      & UserFragment
    )> }
  ) }
);

export type RemoveUserMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type RemoveUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'success' | 'error'>
  ) }
);

export type InviteUserMutationVariables = Exact<{
  email: Scalars['String'];
  organisationId: Scalars['String'];
  roleId: Scalars['String'];
}>;


export type InviteUserMutation = (
  { __typename?: 'Mutation' }
  & { inviteUser: (
    { __typename?: 'InvitationResponseType' }
    & Pick<InvitationResponseType, 'error'>
    & { invitation?: Maybe<(
      { __typename?: 'InvitationType' }
      & Pick<InvitationType, 'email' | 'accepted'>
    )> }
  ) }
);

export type UpdateUserAlertMutationVariables = Exact<{
  alertId: Scalars['String'];
  alertType?: Maybe<AlertTypeEnum>;
  sendToId: Scalars['String'];
  eventHysterisis?: Maybe<Scalars['Int']>;
  eventThreshold?: Maybe<Scalars['Int']>;
}>;


export type UpdateUserAlertMutation = (
  { __typename?: 'Mutation' }
  & { updateUserAlert: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'success' | 'error'>
  ) }
);

export type CreateUserAlertMutationVariables = Exact<{
  alertType?: Maybe<AlertTypeEnum>;
  sendToId: Scalars['String'];
  eventHysterisis?: Maybe<Scalars['Int']>;
  eventThreshold?: Maybe<Scalars['Int']>;
}>;


export type CreateUserAlertMutation = (
  { __typename?: 'Mutation' }
  & { addUserAlert: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'success' | 'error'>
  ) }
);

export type DeleteUserAlertMutationVariables = Exact<{
  alertId: Scalars['String'];
}>;


export type DeleteUserAlertMutation = (
  { __typename?: 'Mutation' }
  & { deleteUserAlert: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'success' | 'error'>
  ) }
);

export type OperatorListQueryVariables = Exact<{ [key: string]: never; }>;


export type OperatorListQuery = (
  { __typename?: 'Query' }
  & { operators: (
    { __typename?: 'OperatorsPage' }
    & { items: Array<Maybe<(
      { __typename?: 'OperatorType' }
      & Pick<OperatorType, 'name' | 'nocCode'>
    )>> }
  ) }
);

export type RequestResetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type RequestResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { requestResetPassword: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'error' | 'success'>
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  uid: Scalars['String'];
  token: Scalars['String'];
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename?: 'MutationResponseType' }
    & Pick<MutationResponseType, 'error' | 'success'>
  ) }
);

export type VerifyResetPasswordTokenMutationVariables = Exact<{
  uid: Scalars['String'];
  token: Scalars['String'];
}>;


export type VerifyResetPasswordTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyResetPasswordToken'>
);

export type SignUpMutationVariables = Exact<{
  key: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signUp: (
    { __typename?: 'SignUpResponseType' }
    & Pick<SignUpResponseType, 'error' | 'success'>
  ) }
);

export type InvitationQueryVariables = Exact<{
  key: Scalars['String'];
}>;


export type InvitationQuery = (
  { __typename?: 'Query' }
  & { invitation?: Maybe<(
    { __typename?: 'InvitationType' }
    & Pick<InvitationType, 'email' | 'accepted'>
  )> }
);

export const OperatorDashboardFragmentDoc = gql`
    fragment OperatorDashboard on OperatorType {
  name
  nocCode
  feedMonitoring {
    feedStatus
    liveStats {
      feedErrors
      feedAlerts
    }
  }
}
    `;
export const OperatorDashboardVehicleCountsFragmentDoc = gql`
    fragment OperatorDashboardVehicleCounts on OperatorType {
  nocCode
  feedMonitoring {
    liveStats {
      currentVehicles
      expectedVehicles
    }
  }
}
    `;
export const EventFragmentDoc = gql`
    fragment Event on EventType {
  timestamp
  type
  data
}
    `;
export const BasicOperatorFragmentDoc = gql`
    fragment BasicOperator on OperatorType {
  name
  nocCode
  feedMonitoring {
    feedStatus
    availability
    lastOutage
    unavailableSince
    liveStats {
      updateFrequency
    }
  }
}
    `;
export const VehicleStatFragmentDoc = gql`
    fragment VehicleStat on VehicleStatsType {
  actual
  expected
  timestamp
}
    `;
export const OperatorLiveStatusFragmentDoc = gql`
    fragment OperatorLiveStatus on OperatorType {
  name
  nocCode
  feedMonitoring {
    feedStatus
    availability
    lastOutage
    unavailableSince
    liveStats {
      updateFrequency
      currentVehicles
      expectedVehicles
      last24Hours {
        ...VehicleStat
      }
      last20Minutes {
        ...VehicleStat
      }
    }
  }
}
    ${VehicleStatFragmentDoc}`;
export const OperatorFeedHistoryFragmentDoc = gql`
    fragment OperatorFeedHistory on OperatorType {
  name
  nocCode
  feedMonitoring {
    historicalStats(date: $date) {
      updateFrequency
      availability
    }
    vehicleStats(granularity: minute, start: $start, end: $end) {
      ...VehicleStat
    }
  }
}
    ${VehicleStatFragmentDoc}`;
export const RoleFragmentDoc = gql`
    fragment Role on RoleType {
  id
  name
  scope
}
    `;
export const UserFragmentDoc = gql`
    fragment User on UserType {
  id
  email
  username
  firstName
  lastName
  organisation {
    id
    name
  }
  roles {
    ...Role
  }
}
    ${RoleFragmentDoc}`;
export const AlertFragmentDoc = gql`
    fragment Alert on AlertType {
  alertId
  alertType
  createdBy {
    firstName
    lastName
    username
  }
  sendTo {
    id
    firstName
    lastName
    username
  }
  eventHysterisis
  eventThreshold
}
    `;
export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    success
    expiresAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LogoutGQL extends Apollo.Mutation<LogoutMutation, LogoutMutationVariables> {
    document = LogoutDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserDocument = gql`
    query user {
  user {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UserGQL extends Apollo.Query<UserQuery, UserQueryVariables> {
    document = UserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CorridorsStopSearchDocument = gql`
    query corridorsStopSearch($query: String!) {
  corridor {
    addFirstStop(searchString: $query) {
      stopId
      stopName
      lat
      lon
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CorridorsStopSearchGQL extends Apollo.Query<CorridorsStopSearchQuery, CorridorsStopSearchQueryVariables> {
    document = CorridorsStopSearchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CorridorsSubsequentStopsDocument = gql`
    query corridorsSubsequentStops($stopList: [String]!) {
  corridor {
    addSubsequentStops(stopList: $stopList) {
      stopId
      stopName
      lon
      lat
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CorridorsSubsequentStopsGQL extends Apollo.Query<CorridorsSubsequentStopsQuery, CorridorsSubsequentStopsQueryVariables> {
    document = CorridorsSubsequentStopsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CorridorsListDocument = gql`
    query corridorsList {
  corridor {
    corridorList {
      id
      name
      stops {
        stopId
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CorridorsListGQL extends Apollo.Query<CorridorsListQuery, CorridorsListQueryVariables> {
    document = CorridorsListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCorridorDocument = gql`
    query getCorridor($corridorId: Int!) {
  corridor {
    getCorridor(corridorId: $corridorId) {
      id
      name
      stops {
        stopId
        stopName
        stopLocation {
          latitude
          longitude
        }
        stopLocality {
          localityId
          localityName
          localityAreaId
          localityAreaName
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCorridorGQL extends Apollo.Query<GetCorridorQuery, GetCorridorQueryVariables> {
    document = GetCorridorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CorridorStatsDocument = gql`
    query corridorStats($params: CorridorStatsInputType!) {
  corridor {
    stats(inputs: $params) {
      summaryStats {
        totalTransits
        numberOfServices
        averageJourneyTime
        scheduledTransits
      }
      journeyTimeStats {
        ts
        minTransitTime
        maxTransitTime
        avgTransitTime
        percentile25
        percentile75
      }
      journeyTimeTimeOfDayStats {
        hour
        minTransitTime
        maxTransitTime
        avgTransitTime
        percentile25
        percentile75
      }
      journeyTimeDayOfWeekStats {
        dow
        minTransitTime
        maxTransitTime
        avgTransitTime
        percentile25
        percentile75
      }
      journeyTimePerServiceStats {
        lineName
        servicePatternName
        noc
        operatorName
        totalJourneyTime
        recordedTransits
        scheduledTransits
      }
      journeyTimeHistogram {
        ts
        hist {
          bin
          freq
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CorridorStatsGQL extends Apollo.Query<CorridorStatsQuery, CorridorStatsQueryVariables> {
    document = CorridorStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCorridorDocument = gql`
    mutation createCorridor($name: String!, $stopIds: [String]!) {
  createCorridor(payload: {name: $name, stopIds: $stopIds}) {
    success
    error
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCorridorGQL extends Apollo.Mutation<CreateCorridorMutation, CreateCorridorMutationVariables> {
    document = CreateCorridorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteCorridorDocument = gql`
    mutation deleteCorridor($corridorId: Int!) {
  deleteCorridor(corridorId: $corridorId) {
    success
    error
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteCorridorGQL extends Apollo.Mutation<DeleteCorridorMutation, DeleteCorridorMutationVariables> {
    document = DeleteCorridorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DashboardOperatorListDocument = gql`
    query dashboardOperatorList {
  operators {
    items {
      ...OperatorDashboard
    }
  }
}
    ${OperatorDashboardFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DashboardOperatorListGQL extends Apollo.Query<DashboardOperatorListQuery, DashboardOperatorListQueryVariables> {
    document = DashboardOperatorListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DashboardOperatorVehicleCountsListDocument = gql`
    query dashboardOperatorVehicleCountsList {
  operators {
    items {
      ...OperatorDashboardVehicleCounts
    }
  }
}
    ${OperatorDashboardVehicleCountsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DashboardOperatorVehicleCountsListGQL extends Apollo.Query<DashboardOperatorVehicleCountsListQuery, DashboardOperatorVehicleCountsListQueryVariables> {
    document = DashboardOperatorVehicleCountsListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DashboardPerformanceStatsDocument = gql`
    query dashboardPerformanceStats($params: PerformanceInputType!) {
  onTimePerformance {
    punctualityOverview(inputs: $params) {
      onTime
      late
      early
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DashboardPerformanceStatsGQL extends Apollo.Query<DashboardPerformanceStatsQuery, DashboardPerformanceStatsQueryVariables> {
    document = DashboardPerformanceStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DashboardServiceRankingDocument = gql`
    query dashboardServiceRanking($params: ServicePerformanceInputType!, $trendFrom: DateTime!, $trendTo: DateTime!) {
  onTimePerformance {
    servicePunctuality(inputs: $params) {
      nocCode
      lineId
      lineInfo {
        serviceId
        serviceName
        serviceNumber
      }
      onTime
      early
      late
      trend(fromTimestamp: $trendFrom, toTimestamp: $trendTo) {
        onTime
        early
        late
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DashboardServiceRankingGQL extends Apollo.Query<DashboardServiceRankingQuery, DashboardServiceRankingQueryVariables> {
    document = DashboardServiceRankingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EventsDocument = gql`
    query events($nocCode: String!, $start: DateTime!, $end: DateTime!) {
  events(nocCode: $nocCode, start: $start, end: $end) {
    items {
      ...Event
    }
  }
}
    ${EventFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EventsGQL extends Apollo.Query<EventsQuery, EventsQueryVariables> {
    document = EventsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EventStatsDocument = gql`
    query eventStats($nocCode: String!, $start: Date!, $end: Date!) {
  eventStats(nocCode: $nocCode, start: $start, end: $end) {
    count
    day
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EventStatsGQL extends Apollo.Query<EventStatsQuery, EventStatsQueryVariables> {
    document = EventStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FeedMonitoringListDocument = gql`
    query feedMonitoringList {
  operators {
    items {
      ...BasicOperator
    }
  }
}
    ${BasicOperatorFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class FeedMonitoringListGQL extends Apollo.Query<FeedMonitoringListQuery, FeedMonitoringListQueryVariables> {
    document = FeedMonitoringListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OperatorSparklineStatsDocument = gql`
    query operatorSparklineStats($nocCodes: [String!]) {
  operators(filterBy: {nocCodes: $nocCodes}) {
    items {
      nocCode
      feedMonitoring {
        liveStats {
          last24Hours {
            ...VehicleStat
          }
        }
      }
    }
  }
}
    ${VehicleStatFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class OperatorSparklineStatsGQL extends Apollo.Query<OperatorSparklineStatsQuery, OperatorSparklineStatsQueryVariables> {
    document = OperatorSparklineStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OperatorLiveStatusDocument = gql`
    query operatorLiveStatus($nocCode: String!) {
  operator(nocCode: $nocCode) {
    ...OperatorLiveStatus
  }
}
    ${OperatorLiveStatusFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class OperatorLiveStatusGQL extends Apollo.Query<OperatorLiveStatusQuery, OperatorLiveStatusQueryVariables> {
    document = OperatorLiveStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OperatorHistoricStatsDocument = gql`
    query operatorHistoricStats($nocCode: String!, $date: Date!, $start: DateTime!, $end: DateTime!) {
  operator(nocCode: $nocCode) {
    ...OperatorFeedHistory
  }
}
    ${OperatorFeedHistoryFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class OperatorHistoricStatsGQL extends Apollo.Query<OperatorHistoricStatsQuery, OperatorHistoricStatsQueryVariables> {
    document = OperatorHistoricStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const HeadwayTimeSeriesDocument = gql`
    query headwayTimeSeries($params: HeadwayInputType!) {
  headwayMetrics {
    headwayTimeSeries(inputs: $params) {
      ts
      actual: actualWaitTime
      scheduled: scheduledWaitTime
      excess: excessWaitTime
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HeadwayTimeSeriesGQL extends Apollo.Query<HeadwayTimeSeriesQuery, HeadwayTimeSeriesQueryVariables> {
    document = HeadwayTimeSeriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const HeadwayOverviewDocument = gql`
    query headwayOverview($params: HeadwayInputType!) {
  headwayMetrics {
    headwayOverview(inputs: $params) {
      actual: actualWaitTime
      scheduled: scheduledWaitTime
      excess: excessWaitTime
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HeadwayOverviewGQL extends Apollo.Query<HeadwayOverviewQuery, HeadwayOverviewQueryVariables> {
    document = HeadwayOverviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const HeadwayFrequentServicesDocument = gql`
    query headwayFrequentServices($noc: String!, $fromTimestamp: DateTime!, $toTimestamp: DateTime!) {
  headwayMetrics {
    frequentServices(noc: $noc, fromTimestamp: $fromTimestamp, toTimestamp: $toTimestamp) {
      serviceId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HeadwayFrequentServicesGQL extends Apollo.Query<HeadwayFrequentServicesQuery, HeadwayFrequentServicesQueryVariables> {
    document = HeadwayFrequentServicesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const HeadwayFrequentServiceInfoDocument = gql`
    query headwayFrequentServiceInfo($noc: String!, $lineId: String!, $fromTimestamp: DateTime!, $toTimestamp: DateTime!) {
  headwayMetrics {
    frequentServiceInfo(noc: $noc, lineId: $lineId, fromTimestamp: $fromTimestamp, toTimestamp: $toTimestamp) {
      numHours
      totalHours
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HeadwayFrequentServiceInfoGQL extends Apollo.Query<HeadwayFrequentServiceInfoQuery, HeadwayFrequentServiceInfoQueryVariables> {
    document = HeadwayFrequentServiceInfoDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimeDelayFrequencyDocument = gql`
    query onTimeDelayFrequency($params: PerformanceInputType!) {
  onTimePerformance {
    delayFrequency(inputs: $params) {
      bucket
      frequency
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimeDelayFrequencyGQL extends Apollo.Query<OnTimeDelayFrequencyQuery, OnTimeDelayFrequencyQueryVariables> {
    document = OnTimeDelayFrequencyDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimeTimeSeriesDocument = gql`
    query onTimeTimeSeries($params: PerformanceInputType!) {
  onTimePerformance {
    punctualityTimeSeries(inputs: $params) {
      ts
      onTime
      early
      late
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimeTimeSeriesGQL extends Apollo.Query<OnTimeTimeSeriesQuery, OnTimeTimeSeriesQueryVariables> {
    document = OnTimeTimeSeriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimeStatsDocument = gql`
    query onTimeStats($params: PerformanceInputType!) {
  onTimePerformance {
    punctualityOverview(inputs: $params) {
      early
      late
      onTime
      scheduled
      completed
      averageDeviation
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimeStatsGQL extends Apollo.Query<OnTimeStatsQuery, OnTimeStatsQueryVariables> {
    document = OnTimeStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimePunctualityTimeOfDayDocument = gql`
    query onTimePunctualityTimeOfDay($params: PerformanceInputType!) {
  onTimePerformance {
    punctualityTimeOfDay(inputs: $params) {
      timeOfDay
      onTime
      early
      late
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimePunctualityTimeOfDayGQL extends Apollo.Query<OnTimePunctualityTimeOfDayQuery, OnTimePunctualityTimeOfDayQueryVariables> {
    document = OnTimePunctualityTimeOfDayDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimePunctualityDayOfWeekDocument = gql`
    query onTimePunctualityDayOfWeek($params: PerformanceInputType!) {
  onTimePerformance {
    punctualityDayOfWeek(inputs: $params) {
      dayOfWeek
      onTime
      early
      late
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimePunctualityDayOfWeekGQL extends Apollo.Query<OnTimePunctualityDayOfWeekQuery, OnTimePunctualityDayOfWeekQueryVariables> {
    document = OnTimePunctualityDayOfWeekDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimeServicePerformanceListDocument = gql`
    query onTimeServicePerformanceList($params: PerformanceInputType!) {
  onTimePerformance {
    servicePerformance(inputs: $params) {
      lineId
      lineInfo {
        serviceId
        serviceName
        serviceNumber
      }
      early
      onTime
      late
      averageDelay
      scheduledDepartures
      actualDepartures
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimeServicePerformanceListGQL extends Apollo.Query<OnTimeServicePerformanceListQuery, OnTimeServicePerformanceListQueryVariables> {
    document = OnTimeServicePerformanceListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimeStopPerformanceListDocument = gql`
    query onTimeStopPerformanceList($params: PerformanceInputType!) {
  onTimePerformance {
    stopPerformance(inputs: $params) {
      lineId
      stopId
      stopInfo {
        stopId
        stopName
        stopLocation {
          latitude
          longitude
        }
        stopLocality {
          localityId
          localityName
          localityAreaId
          localityAreaName
        }
      }
      early
      onTime
      late
      averageDelay
      scheduledDepartures
      actualDepartures
      timingPoint
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimeStopPerformanceListGQL extends Apollo.Query<OnTimeStopPerformanceListQuery, OnTimeStopPerformanceListQueryVariables> {
    document = OnTimeStopPerformanceListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OnTimeOperatorPerformanceListDocument = gql`
    query onTimeOperatorPerformanceList($params: PerformanceInputType!) {
  onTimePerformance {
    operatorPerformance(inputs: $params) {
      pageInfo {
        totalCount
        next
      }
      items {
        nocCode
        name
        early
        onTime
        late
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OnTimeOperatorPerformanceListGQL extends Apollo.Query<OnTimeOperatorPerformanceListQuery, OnTimeOperatorPerformanceListQueryVariables> {
    document = OnTimeOperatorPerformanceListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ServiceInfoDocument = gql`
    query serviceInfo($lineId: String!) {
  serviceInfo(serviceId: $lineId) {
    serviceId
    serviceNumber
    serviceName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ServiceInfoGQL extends Apollo.Query<ServiceInfoQuery, ServiceInfoQueryVariables> {
    document = ServiceInfoDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TransitModelServicePatternStopsDocument = gql`
    query transitModelServicePatternStops($nocCode: String!, $lineId: String!) {
  operator(nocCode: $nocCode) {
    transitModel {
      lines(filterBy: {lineIds: [$lineId]}) {
        items {
          lineId
          lineName
          servicePatterns {
            servicePatternId
            name
            stops {
              stopId
              stopName
              lon
              lat
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class TransitModelServicePatternStopsGQL extends Apollo.Query<TransitModelServicePatternStopsQuery, TransitModelServicePatternStopsQueryVariables> {
    document = TransitModelServicePatternStopsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ListUsersDocument = gql`
    query listUsers {
  users {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ListUsersGQL extends Apollo.Query<ListUsersQuery, ListUsersQueryVariables> {
    document = ListUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ListRolesDocument = gql`
    query listRoles {
  roles {
    ...Role
  }
}
    ${RoleFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ListRolesGQL extends Apollo.Query<ListRolesQuery, ListRolesQueryVariables> {
    document = ListRolesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ListUserAlertsDocument = gql`
    query listUserAlerts {
  userAlerts {
    ...Alert
  }
}
    ${AlertFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ListUserAlertsGQL extends Apollo.Query<ListUserAlertsQuery, ListUserAlertsQueryVariables> {
    document = ListUserAlertsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchUserAlertDocument = gql`
    query fetchUserAlert($alertId: String!) {
  userAlert(alertId: $alertId) {
    ...Alert
  }
}
    ${AlertFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchUserAlertGQL extends Apollo.Query<FetchUserAlertQuery, FetchUserAlertQueryVariables> {
    document = FetchUserAlertDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditUserDocument = gql`
    mutation editUser($username: String!, $firstName: String!, $lastName: String!, $role: String!) {
  updateUser(username: $username, payload: {firstName: $firstName, lastName: $lastName, role: {id: $role}}) {
    error
    user {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EditUserGQL extends Apollo.Mutation<EditUserMutation, EditUserMutationVariables> {
    document = EditUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveUserDocument = gql`
    mutation removeUser($username: String!) {
  deleteUser(username: $username) {
    success
    error
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveUserGQL extends Apollo.Mutation<RemoveUserMutation, RemoveUserMutationVariables> {
    document = RemoveUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteUserDocument = gql`
    mutation inviteUser($email: String!, $organisationId: String!, $roleId: String!) {
  inviteUser(payload: {email: $email, organisation: {id: $organisationId}, role: {id: $roleId}}) {
    invitation {
      email
      accepted
    }
    error
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteUserGQL extends Apollo.Mutation<InviteUserMutation, InviteUserMutationVariables> {
    document = InviteUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserAlertDocument = gql`
    mutation updateUserAlert($alertId: String!, $alertType: AlertTypeEnum, $sendToId: String!, $eventHysterisis: Int, $eventThreshold: Int) {
  updateUserAlert(alertId: $alertId, payload: {alertType: $alertType, sendTo: {id: $sendToId}, eventHysterisis: $eventHysterisis, eventThreshold: $eventThreshold}) {
    success
    error
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserAlertGQL extends Apollo.Mutation<UpdateUserAlertMutation, UpdateUserAlertMutationVariables> {
    document = UpdateUserAlertDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateUserAlertDocument = gql`
    mutation createUserAlert($alertType: AlertTypeEnum, $sendToId: String!, $eventHysterisis: Int, $eventThreshold: Int) {
  addUserAlert(payload: {alertType: $alertType, sendTo: {id: $sendToId}, eventHysterisis: $eventHysterisis, eventThreshold: $eventThreshold}) {
    success
    error
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateUserAlertGQL extends Apollo.Mutation<CreateUserAlertMutation, CreateUserAlertMutationVariables> {
    document = CreateUserAlertDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteUserAlertDocument = gql`
    mutation deleteUserAlert($alertId: String!) {
  deleteUserAlert(alertId: $alertId) {
    success
    error
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteUserAlertGQL extends Apollo.Mutation<DeleteUserAlertMutation, DeleteUserAlertMutationVariables> {
    document = DeleteUserAlertDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OperatorListDocument = gql`
    query operatorList {
  operators {
    items {
      name
      nocCode
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OperatorListGQL extends Apollo.Query<OperatorListQuery, OperatorListQueryVariables> {
    document = OperatorListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RequestResetPasswordDocument = gql`
    mutation requestResetPassword($email: String!) {
  requestResetPassword(email: $email) {
    error
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RequestResetPasswordGQL extends Apollo.Mutation<RequestResetPasswordMutation, RequestResetPasswordMutationVariables> {
    document = RequestResetPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResetPasswordDocument = gql`
    mutation resetPassword($uid: String!, $token: String!, $password: String!, $confirmPassword: String!) {
  resetPassword(uid: $uid, token: $token, password: $password, confirmPassword: $confirmPassword) {
    error
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetPasswordGQL extends Apollo.Mutation<ResetPasswordMutation, ResetPasswordMutationVariables> {
    document = ResetPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VerifyResetPasswordTokenDocument = gql`
    mutation verifyResetPasswordToken($uid: String!, $token: String!) {
  verifyResetPasswordToken(uid: $uid, token: $token)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifyResetPasswordTokenGQL extends Apollo.Mutation<VerifyResetPasswordTokenMutation, VerifyResetPasswordTokenMutationVariables> {
    document = VerifyResetPasswordTokenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignUpDocument = gql`
    mutation signUp($key: String!, $password: String!, $firstName: String!, $lastName: String!) {
  signUp(payload: {key: $key, password: $password, firstName: $firstName, lastName: $lastName}) {
    error
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SignUpGQL extends Apollo.Mutation<SignUpMutation, SignUpMutationVariables> {
    document = SignUpDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InvitationDocument = gql`
    query Invitation($key: String!) {
  invitation(key: $key) {
    email
    accepted
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InvitationGQL extends Apollo.Query<InvitationQuery, InvitationQueryVariables> {
    document = InvitationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }