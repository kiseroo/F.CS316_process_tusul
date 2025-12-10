'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free Explorer',
      price: '$0',
      description: 'Perfect for planning your first adventure.',
      features: [
        'Unlimited AI Trip Plans',
        'Basic Map Routing',
        'Save up to 3 Trips',
        'Community Support',
      ],
      cta: 'Get Started',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Pro Nomad',
      price: '$9.99',
      period: '/month',
      description: 'Advanced tools for the frequent traveler.',
      features: [
        'Everything in Free',
        'Offline Maps Download',
        'Unlimited Saved Trips',
        'Priority AI Routing (Faster)',
        'Exclusive Travel Deals',
      ],
      cta: 'Upgrade to Pro',
      href: '/signup?plan=pro',
      popular: true,
    },
    {
      name: 'Lifetime Wanderer',
      price: '$199',
      period: '/one-time',
      description: 'Pay once, travel forever.',
      features: [
        'All Pro Features',
        'Lifetime Access',
        'Early Access to New Features',
        'Dedicated Support Agent',
        'Custom Map Themes',
      ],
      cta: 'Get Lifetime',
      href: '/signup?plan=lifetime',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Pricing Plans
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect companion for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden ${
                tier.popular ? 'ring-2 ring-blue-600 scale-105 z-10' : 'border border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8 flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.period && <span className="ml-1 text-xl font-medium text-gray-500">{tier.period}</span>}
                </p>
                <p className="mt-6 text-gray-500">{tier.description}</p>

                <ul role="list" className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-gray-50">
                <Link href={tier.href} className="w-full block">
                  <Button 
                    className={`w-full py-6 text-lg ${
                      tier.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
