type RequestPipelineRequired = {
  _request: {
    In: Record<string, any>;
    Joins: Record<string, any>;
    Out: Record<string, any>;
  };
};

export type BuildSubRequest<
  Pipeline extends RequestPipelineRequired,
  Native extends keyof Pipeline['_request']['In'] = keyof Pipeline['_request']['In'],
  Foreign extends keyof Pipeline['_request']['Joins'] = keyof Pipeline['_request']['Joins'],
  OmitFromResponse extends keyof (Pipeline['_request']['In'] &
    Pipeline['_request']['Joins']) = never
> = {
  /**
   * Properties that belong only to the pipeline for which the request
   * is being built
   */
  Native: Pick<Pipeline['_request']['In'], Native>;
  /**
   * Properties that are included in the pipeline from other pipelines
   */
  Foreign: Pick<Pipeline['_request']['Joins'], Foreign>;
  /**
   * Aggregate request properties
   */
  Request: Pick<Pipeline['_request']['In'], Native> &
    Pick<Pipeline['_request']['Joins'], Foreign>;
  /**
   * Properties that exist in complete request but are omitted from this
   *  particular sub request
   */
  Omitted: Omit<Pipeline['_request']['Out'], Native>;
  /**
   * Properties that shall be sent back as a response to the request.
   * Unless omits are defined, this object contains all the properties of the
   * sub request
   */
  Response: Omit<
    Pick<Pipeline['_request']['In'], Native> &
      Pick<Pipeline['_request']['Joins'], Foreign>,
    OmitFromResponse
  >;
};
