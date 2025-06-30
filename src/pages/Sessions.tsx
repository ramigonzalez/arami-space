import React from 'react';
import { Layout } from '../components/layout/Layout';
import { SessionTypeSelector } from '../components/session/SessionTypeSelector';

export const Sessions: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <SessionTypeSelector />
      </div>
    </Layout>
  );
};