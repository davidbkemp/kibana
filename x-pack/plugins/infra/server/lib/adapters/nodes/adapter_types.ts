/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  InfraContainer,
  InfraFilter,
  InfraGroupBy,
  InfraGroupByFilter,
  InfraGroupByType,
  InfraHost,
  InfraPod,
  InfraResponse,
  InfraService,
  InfraTimerange,
} from '../../../../common/graphql/types';
import { InfraSourceConfiguration } from '../../sources';
import { InfraFrameworkRequest } from '../framework';

export interface InfraNodesAdapter {
  getNodes(req: InfraFrameworkRequest, options: InfraNodeRequestOptions): Promise<InfraResponse>;
}

export interface InfraHostsFieldsObject {
  name?: any;
  metrics?: any;
  groups?: [any];
}

export type InfraESQuery =
  | InfraESBoolQuery
  | InfraESRangeQuery
  | InfraESExistsQuery
  | InfraESQueryStringQuery
  | InfraESMatchQuery;

export interface InfraESExistsQuery {
  exists: { field: string };
}

export interface InfraESQueryStringQuery {
  query_string: {
    query: string;
    analyze_wildcard: boolean;
  };
}

export interface InfraESRangeQuery {
  range: {
    [name: string]: {
      gte: number;
      lte: number;
      format: string;
    };
  };
}

export interface InfraESMatchQuery {
  match: {
    [name: string]: {
      query: string;
    };
  };
}

export interface InfraESBoolQuery {
  bool: {
    must?: InfraESQuery[];
    should?: InfraESQuery[];
    filter?: InfraESQuery[];
  };
}

export interface InfraESMSearchHeader {
  index: string[] | string;
}

export interface InfraESSearchBody {
  query?: object;
  aggregations?: object;
  aggs?: object;
  size?: number;
}

export type InfraESMSearchBody = InfraESSearchBody | InfraESMSearchHeader;

export interface InfraNodeRequestOptions {
  nodeType: InfraNodeType;
  nodesKey: InfraNodesKey;
  sourceConfiguration: InfraSourceConfiguration;
  timerange: InfraTimerange;
  groupBy: InfraGroupBy[];
  metrics: string[];
  filters: InfraFilter[];
}

export enum InfraNodesKey {
  hosts = 'hosts',
  pods = 'pods',
  containers = 'containers',
  services = 'services',
}

export enum InfraNodeType {
  host = 'host',
  pod = 'pod',
  container = 'container',
  service = 'service',
}

export interface InfraNodesAggregations {
  waffle: {
    nodes: {
      buckets: InfraBucket[];
    };
  };
}

export type InfraProcessorTransformer<T> = (doc: T) => T;

export type InfraProcessorChainFn<T> = (
  next: InfraProcessorTransformer<T>
) => InfraProcessorTransformer<T>;

export type InfraProcessor<O, T> = (options: O) => InfraProcessorChainFn<T>;

export interface InfraProcesorRequestOptions {
  nodeOptions: InfraNodeRequestOptions;
  partitionId: number;
  numberOfPartitions: number;
  nodeField: string;
}

export interface InfraGroupByFilters {
  id: string /** The UUID for the group by object */;
  type: InfraGroupByType /** The type of aggregation to use to bucket the groups */;
  label?:
    | string
    | null /** The label to use in the results for the group by for the terms group by */;
  filters: InfraGroupByFilter[] /** The filters to use for the group by aggregation, this is ignored by the terms group by */;
}

export interface InfraGroupByTerms {
  id: string /** The UUID for the group by object */;
  type: InfraGroupByType /** The type of aggregation to use to bucket the groups */;
  label?:
    | string
    | null /** The label to use in the results for the group by for the terms group by */;
  field: string;
}

export interface InfraBucketWithKey {
  key: string;
  doc_count: number;
}

export interface InfraBucketWithAggs {
  [name: string]: {
    buckets: InfraBucket[];
  };
}

export type InfraBucket = InfraBucketWithAggs & InfraBucketWithKey;

export interface InfraGroupWithNodes {
  name: string;
  nodes: InfraNode[];
}

export interface InfraGroupWithSubGroups {
  name: string;
  groups: InfraGroupWithNodes[];
}

export type InfraNodeGroup = InfraGroupWithNodes | InfraGroupWithSubGroups;

export type InfraNode = InfraHost | InfraPod | InfraContainer | InfraService;

export interface InfraNodesResponse {
  total?: number;
}

export interface InfraGroupsResponse {
  total: number;
  groups: InfraNodeGroup[];
}

export interface InfraNodesOnlyResponse {
  total: number;
  nodes: InfraNode[];
}