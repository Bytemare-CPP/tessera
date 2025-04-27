import supabaseAdmin from './supabaseAdmin';

/**
 * Sets up periodic cleanup of old selfie candidates
 * @param {number} intervalMinutes - How often to run cleanup (in minutes)
 */
export function setupCleanupScheduler(intervalMinutes: number = 1): void {
  console.log(`Setting up selfie candidates cleanup every ${intervalMinutes} minute(s)`);
  
  // Convert minutes to milliseconds
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // Initial cleanup after a short delay
  setTimeout(runCleanup, 10000);
  
  // Set up regular interval
  setInterval(runCleanup, intervalMs);
}

/**
 * Runs the cleanup function in Supabase
 */
async function runCleanup(): Promise<void> {
  try {
    console.log("Starting selfie candidates cleanup...");
    const startTime = Date.now();
    
    // Call the RPC function in Supabase
    const { data, error } = await supabaseAdmin.rpc('cleanup_old_selfie_candidates');
    
    if (error) {
      console.error('Cleanup error:', error);
      return;
    }
    
    const duration = Date.now() - startTime;
    console.log(`Selfie candidates cleanup completed in ${duration}ms. Records affected: ${data || 0}`);
  } catch (error) {
    console.error('Error running selfie candidates cleanup:', error);
  }
}