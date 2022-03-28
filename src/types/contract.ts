export interface IPermitQueryResponse {
  Ok: {
    description: string;
    score: number;
    status: string;
    timstamp: number;
  };
}

export interface IScoreQueryResponse {
  description: string;
  score: number;
  status: string;
  timstamp: number;
}
