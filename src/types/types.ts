enum ScoreQuality {
  'very poor',
  'poor',
  'fair',
  'good',
  'very good',
  'excellent',
  'exceptional',
}

export interface IScoreResponse {
  endpoint: '/credit_score/plaid' | 'credit_score/coinbase';
  feedback: {
    advice: {
      credit_error: false;
      credit_exist: false;
      diversity_error: false;
      stability_error: false;
      velocity_error: false;
    };
    score: {
      bank_accounts: number;
      card_names: string[];
      cum_balance: number;
      loan_amount: 500 | 1000 | 5000 | 10000 | 15000 | 20000 | 25000;
      points: number;
      quality: ScoreQuality;
      score_exist: true;
    };
  };
  message: string;
  score: number;
  status_code: 200 | 400;
  status: 'Success' | 'Error';
  title: 'Credit Score';
}
