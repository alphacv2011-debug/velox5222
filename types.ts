import React from 'react';

export interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  icon: 'package' | 'truck' | 'check' | 'alert';
}

export interface TrackingData {
  code: string;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  recipient: string;
  address: string;
  cep: string;
  events: TrackingEvent[];
}

export interface ShippingQuote {
  recommendedService: string;
  estimatedCost: string;
  estimatedTime: string;
  packagingAdvice: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}