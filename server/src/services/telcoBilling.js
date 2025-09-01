
// Telco provider configs
const telcoProviders = {
  vodacom: {
    name: 'Vodacom',
    chargeSuccessRate: 0.95,
    refundSuccessRate: 0.98,
    delay: 500
  },
  mtn: {
    name: 'MTN',
    chargeSuccessRate: 0.93,
    refundSuccessRate: 0.97,
    delay: 600
  },
  cellc: {
    name: 'Cell C',
    chargeSuccessRate: 0.92,
    refundSuccessRate: 0.96,
    delay: 700
  },
  telkom: {
    name: 'Telkom',
    chargeSuccessRate: 0.90,
    refundSuccessRate: 0.95,
    delay: 800
  },
  default: {
    name: 'Default',
    chargeSuccessRate: 0.95,
    refundSuccessRate: 0.98,
    delay: 500
  }
};

class TelcoBillingService {
  constructor(provider = 'default') {
    this.provider = provider;
    this.config = telcoProviders[provider] || telcoProviders.default;
  }

  async chargeMsisdn(msisdn, amount) {
    await new Promise(resolve => setTimeout(resolve, this.config.delay));
    const success = Math.random() < this.config.chargeSuccessRate;
    if (!success) {
      throw new Error('Billing failed: Insufficient funds');
    }
    return {
      success: true,
      reference: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      provider: this.provider
    };
  }

  async refundMsisdn(msisdn, amount) {
    await new Promise(resolve => setTimeout(resolve, this.config.delay));
    const success = Math.random() < this.config.refundSuccessRate;
    if (!success) {
      throw new Error('Refund failed: System error');
    }
    return {
      success: true,
      reference: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      provider: this.provider
    };
  }

  async validateMsisdn(msisdn) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return /^0[0-9]{9}$/.test(msisdn);
  }
}

TelcoBillingService.providers = telcoProviders;

module.exports = TelcoBillingService;
