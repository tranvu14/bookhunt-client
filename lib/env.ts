const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  } else {
    return unvalidatedEnvironmentVariable;
  }
};

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: getEnvironmentVariable('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  // Add other environment variables here
} as const; 