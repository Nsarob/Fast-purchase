import NodeCache from 'node-cache';

// Cache configuration
const cache = new NodeCache({
  stdTTL: 300, // Default TTL: 5 minutes (300 seconds)
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone cached values for better performance
});

export default cache;
