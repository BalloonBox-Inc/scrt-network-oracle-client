import { StdSignature } from 'secretjs/types/types';

enum ScoreQuality {
  'very poor',
  'poor',
  'fair',
  'good',
  'very good',
  'excellent',
  'exceptional',
}

export interface IScoreResponsePlaid {
  endpoint: '/credit_score/plaid';
  feedback: {
    advice: {
      credit_error: boolean;
      credit_exist: boolean;
      diversity_error: boolean;
      stability_error: boolean;
      velocity_error: boolean;
    };
    score: {
      bank_accounts: number;
      card_names: string[];
      cum_balance: number;
      loan_amount: 500 | 1000 | 5000 | 10000 | 15000 | 20000 | 25000;
      points: number;
      quality: ScoreQuality;
      score_exist: boolean;
    };
  };
  message: string;
  score: number;
  status_code: 200 | 400;
  status: 'success' | 'error';
  title: 'Credit Score';
}

export interface IScoreResponseCoinbase {
  endpoint: 'credit_score/coinbase';
  feedback: {
    activity: {
      credit: {
        'timeframe(days)': number;
        tot_volume: number;
        weighted_avg_volume: number;
      };
      debit: {
        'timeframe(days)': number;
        tot_volume: number;
        weighted_avg_volume: number;
      };
      total_net_profit: number;
    };
    history: {
      'wallet_age(days)': number;
    };
    kyc: {
      verified: boolean;
    };
    liquidity: {
      avg_running_balance: number;
      'balance_timeframe(months)': number;
      current_balance: number;
    };
    advice: {
      credit_error: boolean;
      credit_exist: boolean;
      diversity_error: boolean;
      stability_error: boolean;
      velocity_error: boolean;
    };
    score: {
      bank_accounts: number;
      card_names: string[];
      cum_balance: number;
      loan_amount: 500 | 1000 | 5000 | 10000 | 15000 | 20000 | 25000;
      points: number;
      quality: ScoreQuality;
      score_exist: boolean;
    };
  };
  message: string;
  score: number;
  status_code: 200 | 400;
  status: 'success' | 'error';
  timestamp: string;
  title: 'Credit Score';
}

export interface IQueryInputs {
  permit_name: string;
  public_key: StdSignature['pub_key'];
  signature: StdSignature['signature'];
}
