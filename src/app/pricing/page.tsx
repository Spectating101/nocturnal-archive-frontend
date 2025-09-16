'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the platform',
    features: [
      '20 searches per month',
      'Basic research features',
      'Standard response time',
      'Community support'
    ],
    limitations: [
      'No export features',
      'No search history',
      'No priority queue'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Lite',
    price: '$5',
    period: 'per month',
    description: 'Great for students and casual researchers',
    features: [
      '200 searches per month',
      'Enhanced "Thinking" UX',
      'Export to PDF/Word',
      'Search history (30 days)',
      'Email support',
      'No ads'
    ],
    limitations: [
      'No analytics dashboard',
      'No team features'
    ],
    cta: 'Start Lite Plan',
    popular: false
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For serious researchers and professionals',
    features: [
      '1,000 searches per month',
      'Advanced analytics dashboard',
      'Full search history',
      'Priority queue access',
      'Export to all formats',
      'Priority email support',
      'API access (1,000 calls/month)',
      'Custom research templates'
    ],
    limitations: [
      'No team collaboration'
    ],
    cta: 'Start Pro Plan',
    popular: true
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per month',
    description: 'For research teams and small organizations',
    features: [
      '5,000 searches per month (pooled)',
      '5 team member seats',
      'Shared research history',
      'Team collaboration tools',
      'Advanced analytics & reporting',
      'Dedicated support',
      'API access (5,000 calls/month)',
      'SSO integration',
      'Custom branding'
    ],
    limitations: [
      'No enterprise features'
    ],
    cta: 'Start Team Plan',
    popular: false
  }
];

const addOns = [
  {
    name: 'Pay-as-you-go Overage',
    price: '$0.01',
    description: 'per additional search (capped at 2x plan price)',
    details: 'Never worry about unexpected bills - we cap overage charges to protect you.'
  },
  {
    name: 'Annual Discount',
    price: '20% off',
    description: 'when paid yearly',
    details: 'Save money and lock in your rate with annual billing.'
  },
  {
    name: 'Student Discount',
    price: '50% off',
    description: 'Lite and Pro plans',
    details: 'Valid .edu email required. Available for active students.'
  }
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const getAdjustedPrice = (basePrice: string) => {
    if (!annual || basePrice === '$0') return basePrice;
    const num = parseInt(basePrice.replace('$', ''));
    const discounted = Math.round(num * 0.8);
    return `$${discounted}`;
  };

  const getAdjustedPeriod = () => {
    return annual ? 'per month, billed annually' : 'per month';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Simple, Fair Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We believe in generous pricing that grows with you. No hidden fees, no predatory practices - 
            just honest value that makes research accessible to everyone.
          </p>
        </div>

        {/* Annual Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-gray-800 rounded-lg p-2">
            <span className={`px-4 py-2 rounded-md transition-colors ${!annual ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`px-4 py-2 rounded-md transition-colors ${annual ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
            >
              Annual (20% off)
            </button>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                tier.popular
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 ring-2 ring-blue-400'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{getAdjustedPrice(tier.price)}</span>
                  <span className="text-gray-400 ml-2">{getAdjustedPeriod()}</span>
                </div>
                <p className="text-gray-300">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {tier.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start">
                    <XMarkIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-400">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Flexible Add-ons</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {addOns.map((addon) => (
              <div key={addon.name} className="text-center">
                <h3 className="text-xl font-semibold mb-2">{addon.name}</h3>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-blue-400">{addon.price}</span>
                  <span className="text-gray-400 ml-1">{addon.description}</span>
                </div>
                <p className="text-sm text-gray-300">{addon.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-300 text-sm">Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I exceed my search limit?</h3>
              <p className="text-gray-300 text-sm">You'll be charged $0.01 per additional search, but we cap overage charges at 2x your plan price to prevent bill shocks.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-300 text-sm">Yes! Start with our free plan and upgrade when you need more features. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-300 text-sm">We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-xl text-gray-300 mb-6">
            Ready to accelerate your research?
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
